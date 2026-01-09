from app import create_app
from app.extensions import db
from app.models import Category, City
from app.utils import slugify

CATEGORIES = [
    "Dentiști",
    "Avocați",
    "Contabili",
    "Constructori",
    "Mecanici Auto",
    "Frizerii",
    "Medici",
    "Traducători",
    "Altele"
]

CITIES = [
    ("Berlin", "Berlin", 52.5200, 13.4050),
    ("Hamburg", "Hamburg", 53.5511, 9.9937),
    ("München", "Bayern", 48.1351, 11.5820),
    ("Köln", "NRW", 50.9375, 6.9603),
    ("Frankfurt am Main", "Hessen", 50.1109, 8.6821),
    ("Stuttgart", "Baden-Württemberg", 48.7758, 9.1829),
    ("Düsseldorf", "NRW", 51.2277, 6.7735),
    ("Dortmund", "NRW", 51.5136, 7.4653),
    ("Essen", "NRW", 51.4556, 7.0116),
    ("Leipzig", "Sachsen", 51.3397, 12.3731),
    ("Bremen", "Bremen", 53.0793, 8.8017),
    ("Dresden", "Sachsen", 51.0504, 13.7373),
]

def main():
    app = create_app()
    with app.app_context():

        # --------------------
        # CATEGORIES (UPSERT)
        # --------------------
        existing_categories = {c.slug: c for c in Category.query.all()}

        for name in CATEGORIES:
            slug = slugify(name)
            if slug in existing_categories:
                existing_categories[slug].name = name
            else:
                db.session.add(Category(name=name, slug=slug))

        # --------------------
        # CITIES (UPSERT)
        # --------------------
        existing_cities = {c.slug: c for c in City.query.all()}

        for name, state, lat, lng in CITIES:
            slug = slugify(name)
            if slug in existing_cities:
                city = existing_cities[slug]
                city.name = name
                city.state = state
                city.lat = lat
                city.lng = lng
            else:
                db.session.add(
                    City(
                        name=name,
                        slug=slug,
                        state=state,
                        lat=lat,
                        lng=lng
                    )
                )

        db.session.commit()
        print("✅ Seed completed successfully.")

if __name__ == "__main__":
    main()