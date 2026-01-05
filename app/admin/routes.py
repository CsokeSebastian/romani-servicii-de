from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session, flash
import cloudinary
import cloudinary.uploader

from ..extensions import db
from ..models import Category, City, Listing, Submission
from ..utils import slugify, languages_to_str, languages_from_str

admin_bp = Blueprint("admin", __name__)

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not session.get("is_admin"):
            return redirect(url_for("admin.login", next=request.path))
        return fn(*args, **kwargs)
    return wrapper

@admin_bp.before_app_request
def setup_cloudinary():
    from flask import current_app
    cfg = current_app.config
    if cfg.get("CLOUDINARY_URL"):
        cloudinary.config(cloudinary_url=cfg["CLOUDINARY_URL"])
    elif cfg.get("CLOUDINARY_CLOUD_NAME") and cfg.get("CLOUDINARY_API_KEY") and cfg.get("CLOUDINARY_API_SECRET"):
        cloudinary.config(
            cloud_name=cfg["CLOUDINARY_CLOUD_NAME"],
            api_key=cfg["CLOUDINARY_API_KEY"],
            api_secret=cfg["CLOUDINARY_API_SECRET"],
            secure=True
        )

@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    from flask import current_app
    if request.method == "POST":
        password = request.form.get("password", "")
        if password == current_app.config["ADMIN_PASSWORD"]:
            session["is_admin"] = True
            flash("Logged in.", "success")
            next_url = request.args.get("next") or url_for("admin.dashboard")
            return redirect(next_url)
        flash("Wrong password.", "error")
    return render_template("admin/login.html")

@admin_bp.get("/logout")
def logout():
    session.pop("is_admin", None)
    flash("Logged out.", "success")
    return redirect(url_for("public.home"))

@admin_bp.get("/")
@admin_required
def dashboard():
    pending = Submission.query.filter_by(status="PENDING").count()
    listings = Listing.query.count()
    featured = Listing.query.filter_by(featured=True).count()
    return render_template("admin/dashboard.html", pending=pending, listings=listings, featured=featured)

@admin_bp.get("/listings")
@admin_required
def listings():
    q = request.args.get("q", "").strip()
    query = Listing.query
    if q:
        query = query.filter(Listing.name.ilike(f"%{q}%"))
    items = query.order_by(Listing.updated_at.desc()).all()
    return render_template("admin/listings.html", items=items, q=q, languages_from_str=languages_from_str)

def _upload_image_to_cloudinary(file_storage):
    if not file_storage or not file_storage.filename:
        return None
    result = cloudinary.uploader.upload(
        file_storage,
        folder="romani-servicii-de",
        resource_type="image",
        transformation=[
            {"width": 600, "height": 600, "crop": "limit"},
            {"quality": "auto", "fetch_format": "auto"},
        ]
    )
    return result.get("secure_url")

@admin_bp.route("/listings/new", methods=["GET", "POST"])
@admin_required
def listings_new():
    categories = Category.query.order_by(Category.name.asc()).all()
    cities = City.query.order_by(City.name.asc()).all()

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        if not name:
            flash("Name is required.", "error")
            return render_template("admin/listing_form.html", categories=categories, cities=cities, item=None, languages_from_str=languages_from_str)

        description = request.form.get("description", "").strip() or None
        category_id = int(request.form.get("category_id"))
        city_id = int(request.form.get("city_id"))

        phone = request.form.get("phone", "").strip() or None
        whatsapp = request.form.get("whatsapp", "").strip() or None
        website = request.form.get("website", "").strip() or None
        address = request.form.get("address", "").strip() or None

        langs = request.form.getlist("languages")
        verified = request.form.get("verified") == "on"
        featured = request.form.get("featured") == "on"

        base_slug = slugify(name)
        slug = base_slug
        i = 2
        while Listing.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{i}"
            i += 1

        image_url = _upload_image_to_cloudinary(request.files.get("image"))

        item = Listing(
            name=name,
            slug=slug,
            description=description,
            category_id=category_id,
            city_id=city_id,
            phone=phone,
            whatsapp=whatsapp,
            website=website,
            address=address,
            languages=languages_to_str(langs),
            verified=verified,
            featured=featured,
            image_url=image_url
        )
        db.session.add(item)
        db.session.commit()
        flash("Listing created.", "success")
        return redirect(url_for("admin.listings"))

    return render_template("admin/listing_form.html", categories=categories, cities=cities, item=None, languages_from_str=languages_from_str)

@admin_bp.route("/listings/<int:listing_id>/edit", methods=["GET", "POST"])
@admin_required
def listings_edit(listing_id: int):
    item = Listing.query.get_or_404(listing_id)
    categories = Category.query.order_by(Category.name.asc()).all()
    cities = City.query.order_by(City.name.asc()).all()

    if request.method == "POST":
        item.name = request.form.get("name", "").strip()
        if not item.name:
            flash("Name is required.", "error")
            return render_template("admin/listing_form.html", categories=categories, cities=cities, item=item, languages_from_str=languages_from_str)

        item.description = request.form.get("description", "").strip() or None
        item.category_id = int(request.form.get("category_id"))
        item.city_id = int(request.form.get("city_id"))
        item.phone = request.form.get("phone", "").strip() or None
        item.whatsapp = request.form.get("whatsapp", "").strip() or None
        item.website = request.form.get("website", "").strip() or None
        item.address = request.form.get("address", "").strip() or None
        item.languages = languages_to_str(request.form.getlist("languages"))
        item.verified = request.form.get("verified") == "on"
        item.featured = request.form.get("featured") == "on"

        new_image = request.files.get("image")
        if new_image and new_image.filename:
            item.image_url = _upload_image_to_cloudinary(new_image)

        db.session.commit()
        flash("Listing updated.", "success")
        return redirect(url_for("admin.listings"))

    return render_template("admin/listing_form.html", categories=categories, cities=cities, item=item, languages_from_str=languages_from_str)

@admin_bp.post("/listings/<int:listing_id>/delete")
@admin_required
def listings_delete(listing_id: int):
    item = Listing.query.get_or_404(listing_id)
    db.session.delete(item)
    db.session.commit()
    flash("Listing deleted.", "success")
    return redirect(url_for("admin.listings"))

@admin_bp.get("/submissions")
@admin_required
def submissions():
    items = Submission.query.order_by(Submission.created_at.desc()).all()
    return render_template("admin/submissions.html", items=items)

@admin_bp.post("/submissions/<int:sub_id>/reject")
@admin_required
def submissions_reject(sub_id: int):
    sub = Submission.query.get_or_404(sub_id)
    sub.status = "REJECTED"
    db.session.commit()
    flash("Submission rejected.", "success")
    return redirect(url_for("admin.submissions"))

@admin_bp.post("/submissions/<int:sub_id>/approve")
@admin_required
def submissions_approve(sub_id: int):
    sub = Submission.query.get_or_404(sub_id)
    sub.status = "APPROVED"

    category = Category.query.filter(Category.name.ilike(sub.category_name)).first()
    if not category:
        category = Category.query.order_by(Category.name.asc()).first()

    city = City.query.filter(City.name.ilike(sub.city_name)).first()
    if not city:
        city = City.query.order_by(City.name.asc()).first()

    base_slug = slugify(sub.business_name)
    slug = base_slug
    i = 2
    while Listing.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{i}"
        i += 1

    new_listing = Listing(
        name=sub.business_name,
        slug=slug,
        description=sub.message,
        category_id=category.id,
        city_id=city.id,
        website=sub.website,
        phone=sub.contact
    )
    db.session.add(new_listing)
    db.session.commit()
    flash("Submission approved and listing created (please review/edit).", "success")
    return redirect(url_for("admin.listings_edit", listing_id=new_listing.id))
