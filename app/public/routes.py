from flask import Blueprint, render_template, request, abort, Response, url_for
from sqlalchemy import or_, text
from flask import abort
from ..extensions import db
from ..models import Category, City, Listing, Submission
from ..utils import languages_from_str
from ..utils import geocode_location
from ..utils import send_contact_email

public_bp = Blueprint("public", __name__)

@public_bp.route("/contact", methods=["GET", "POST"])
def contact():
    success = False
    error = False

    if request.method == "POST":
        # honeypot
        if request.form.get("company_website"):
            success = True
        else:
            name = request.form.get("name", "").strip()
            email = request.form.get("email", "").strip()
            message = request.form.get("message", "").strip()

            if name and email and message:
                try:
                    send_contact_email(name, email, message)
                    success = True
                except Exception:
                    error = True

    return render_template("contact.html", success=success, error=error)

RADIUS_ALLOWED = (5, 10, 20, 50)

@public_bp.get("/admin")
@public_bp.get("/admin/")
def fake_admin():
    abort(404)
    
def _apply_radius_filter(query, center_lat: float, center_lng: float, radius_km: int):
    # Uses City.lat/lng as the listing position (city center approximation)
    return query.filter(
        text("""
        (6371 * acos(
          cos(radians(:clat)) * cos(radians(city.lat)) * cos(radians(city.lng) - radians(:clng)) +
          sin(radians(:clat)) * sin(radians(city.lat))
        )) <= :rkm
        """)
    ).params(clat=center_lat, clng=center_lng, rkm=radius_km)

@public_bp.app_context_processor
def inject_globals():
    return {
        "all_categories": Category.query.order_by(Category.name.asc()).all(),
        "all_cities": City.query.order_by(City.name.asc()).all(),
        "languages_from_str": languages_from_str
    }

# @public_bp.get("/")
# def home():
#     q_text = request.args.get("q", "").strip()
#     category_slug = request.args.get("category", "").strip()
#     city_slug = request.args.get("city", "").strip()
#     radius_km = request.args.get("radius", "").strip()

#     featured = Listing.query.filter_by(featured=True).order_by(Listing.updated_at.desc()).limit(8).all()

#     listings_query = Listing.query  # IMPORTANT: pornește mereu din Listing

#     # category filter
#     if category_slug:
#         cat = Category.query.filter_by(slug=category_slug).first()
#         if cat:
#             listings_query = listings_query.filter(Listing.category_id == cat.id)

#     # city filter
#     city = None
#     if city_slug:
#         city = City.query.filter_by(slug=city_slug).first()
#         if city:
#             listings_query = listings_query.filter(Listing.city_id == city.id)

#     # text search (name + description + category + city + languages)
#     if q_text:
#         listings_query = (
#             listings_query
#             .join(Category, Listing.category_id == Category.id)
#             .join(City, Listing.city_id == City.id)
#             .filter(or_(
#                 Listing.name.ilike(f"%{q_text}%"),
#                 Listing.description.ilike(f"%{q_text}%"),
#                 Category.name.ilike(f"%{q_text}%"),
#                 City.name.ilike(f"%{q_text}%"),
#                 Listing.languages.ilike(f"%{q_text}%"),
#             ))
#             .distinct()
#         )

#     # radius filter (doar dacă e selectat oraș)
#     if city and radius_km.isdigit():
#         r = int(radius_km)
#         if r in RADIUS_ALLOWED and city.lat is not None and city.lng is not None:
#             listings_query = listings_query.join(City, Listing.city_id == City.id)
#             listings_query = _apply_radius_filter(listings_query, city.lat, city.lng, r)

#     listings = (
#         listings_query
#         .order_by(Listing.featured.desc(), Listing.verified.desc(), Listing.updated_at.desc())
#         .limit(30)
#         .all()
#     )

#     return render_template(
#         "home.html",
#         featured=featured,
#         listings=listings,
#         q=q_text,
#         category_slug=category_slug,
#         city_slug=city_slug,
#         radius_km=radius_km
#     )
@public_bp.get("/")
def home():
    q_text = request.args.get("q", "").strip()
    category_slug = request.args.get("category", "").strip()
    location = request.args.get("location", "").strip()
    radius_km = request.args.get("radius", "").strip()

    featured = (
        Listing.query
        .filter_by(featured=True)
        .order_by(Listing.updated_at.desc())
        .limit(8)
        .all()
    )

    listings_query = Listing.query

    # -----------------
    # Category filter
    # -----------------
    if category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            listings_query = listings_query.filter(
                Listing.category_id == cat.id
            )

    # -----------------
    # Text search
    # -----------------
    if q_text:
        listings_query = (
            listings_query
            .join(Category, Listing.category_id == Category.id)
            .join(City, Listing.city_id == City.id)
            .filter(or_(
                Listing.name.ilike(f"%{q_text}%"),
                Listing.description.ilike(f"%{q_text}%"),
                Category.name.ilike(f"%{q_text}%"),
                City.name.ilike(f"%{q_text}%"),
                Listing.languages.ilike(f"%{q_text}%"),
            ))
            .distinct()
        )

    # -----------------
    # Location (manual) + radius
    # -----------------
    lat = lng = None
    if location:
        lat, lng = geocode_location(location)

    if lat and lng and radius_km.isdigit():
        r = int(radius_km)
        if r in RADIUS_ALLOWED:
            listings_query = (
                listings_query
                .join(City, Listing.city_id == City.id)
            )
            listings_query = _apply_radius_filter(
                listings_query,
                lat,
                lng,
                r
            )

    # -----------------
    # Final result
    # -----------------
    listings = (
        listings_query
        .order_by(
            Listing.featured.desc(),
            Listing.verified.desc(),
            Listing.updated_at.desc()
        )
        .limit(30)
        .all()
    )

    return render_template(
        "home.html",
        featured=featured,
        listings=listings,
        q=q_text,
        category_slug=category_slug,
        location=location,
        radius_km=radius_km
    )


@public_bp.get("/category/<slug>")
def category_page(slug: str):
    category = Category.query.filter_by(slug=slug).first()
    if not category:
        abort(404)

    city_slug = request.args.get("city", "").strip()
    radius_km = request.args.get("radius", "").strip()
    verified = request.args.get("verified", "").strip() == "1"
    featured = request.args.get("featured", "").strip() == "1"

    q = Listing.query.filter_by(category_id=category.id)

    city = None
    if city_slug:
        city = City.query.filter_by(slug=city_slug).first()
        if city:
            q = q.filter_by(city_id=city.id)

    if city and radius_km.isdigit():
        r = int(radius_km)
        if r in RADIUS_ALLOWED and city.lat is not None and city.lng is not None:
            q = q.join(City, Listing.city_id == City.id)
            q = _apply_radius_filter(q, city.lat, city.lng, r)

    if verified:
        q = q.filter_by(verified=True)
    if featured:
        q = q.filter_by(featured=True)

    listings = q.order_by(Listing.featured.desc(), Listing.verified.desc(), Listing.updated_at.desc()).all()

    return render_template(
        "category.html",
        category=category,
        listings=listings,
        city_slug=city_slug,
        radius_km=radius_km,
        verified=verified,
        featured=featured
    )

@public_bp.get("/city/<slug>")
def city_page(slug: str):
    city = City.query.filter_by(slug=slug).first()
    if not city:
        abort(404)

    category_slug = request.args.get("category", "").strip()
    verified = request.args.get("verified", "").strip() == "1"
    featured = request.args.get("featured", "").strip() == "1"

    q = Listing.query.filter_by(city_id=city.id)
    if category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            q = q.filter_by(category_id=cat.id)
    if verified:
        q = q.filter_by(verified=True)
    if featured:
        q = q.filter_by(featured=True)

    listings = q.order_by(Listing.featured.desc(), Listing.verified.desc(), Listing.updated_at.desc()).all()
    return render_template("city.html", city=city, listings=listings, category_slug=category_slug, verified=verified, featured=featured)

@public_bp.get("/listing/<slug>")
def listing_page(slug: str):
    listing = Listing.query.filter_by(slug=slug).first()
    if not listing:
        abort(404)
    return render_template("listing.html", listing=listing)

@public_bp.route("/recommend", methods=["GET", "POST"])
def recommend():
    if request.method == "POST":
        honeypot = request.form.get("company_website", "")
        if honeypot:
            return render_template("recommend.html", success=True)

        business_name = request.form.get("business_name", "").strip()
        category_name = request.form.get("category_name", "").strip()
        city_name = request.form.get("city_name", "").strip()

        if business_name and category_name and city_name:
            sub = Submission(
                business_name=business_name,
                category_name=category_name,
                city_name=city_name,
                contact=request.form.get("contact", "").strip() or None,
                website=request.form.get("website", "").strip() or None,
                message=request.form.get("message", "").strip() or None,
                submitter_name=request.form.get("submitter_name", "").strip() or None,
                submitter_email=request.form.get("submitter_email", "").strip() or None,
            )
            db.session.add(sub)
            db.session.commit()
            return render_template("recommend.html", success=True)

    return render_template("recommend.html", success=False)

# SEO landing: /servicii/<category_slug>/<city_slug>
@public_bp.get("/servicii/<category_slug>/<city_slug>")
def seo_landing(category_slug: str, city_slug: str):
    category = Category.query.filter_by(slug=category_slug).first()
    city = City.query.filter_by(slug=city_slug).first()
    if not category or not city:
        abort(404)

    listings = (
        Listing.query
        .filter_by(category_id=category.id, city_id=city.id)
        .order_by(Listing.featured.desc(), Listing.verified.desc(), Listing.updated_at.desc())
        .all()
    )

    seo_title = f"{category.name} români în {city.name} — Servicii în limba română"
    seo_description = (
        f"Găsește {category.name.lower()} care vorbesc română în {city.name}. "
        f"Listă verificată, contacte rapide și firme recomandate de comunitate."
    )

    return render_template(
        "seo_landing.html",
        category=category,
        city=city,
        listings=listings,
        seo_title=seo_title,
        seo_description=seo_description
    )

# sitemap.xml
@public_bp.get("/sitemap.xml")
def sitemap():
    base = request.url_root.rstrip("/")

    categories = Category.query.all()
    cities = City.query.all()
    listings = Listing.query.all()

    pages = []
    pages.append(f"{base}{url_for('public.home')}")

    for c in categories:
        pages.append(f"{base}{url_for('public.category_page', slug=c.slug)}")
    for city in cities:
        pages.append(f"{base}{url_for('public.city_page', slug=city.slug)}")
    for c in categories:
        for city in cities:
            pages.append(f"{base}{url_for('public.seo_landing', category_slug=c.slug, city_slug=city.slug)}")
    for l in listings:
        pages.append(f"{base}{url_for('public.listing_page', slug=l.slug)}")

    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for p in pages:
        xml.append("  <url>")
        xml.append(f"    <loc>{p}</loc>")
        xml.append("  </url>")
    xml.append("</urlset>")

    return Response("\n".join(xml), mimetype="application/xml")

@public_bp.get("/impressum")
def impressum():
    return render_template("impressum.html")

@public_bp.get("/datenschutz")
def datenschutz():
    return render_template("datenschutz.html")
