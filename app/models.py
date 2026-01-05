from datetime import datetime
from .extensions import db

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    slug = db.Column(db.String(140), nullable=False, unique=True)

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), nullable=False, unique=True)
    state = db.Column(db.String(120), nullable=True)

    # for radius search (center of city)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)

class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(240), nullable=False, unique=True)

    description = db.Column(db.Text, nullable=True)

    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey("city.id"), nullable=False)

    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(80), nullable=True)
    whatsapp = db.Column(db.String(80), nullable=True)
    website = db.Column(db.String(255), nullable=True)

    languages = db.Column(db.String(50), nullable=True)  # "ro,de,en"
    verified = db.Column(db.Boolean, default=False)
    featured = db.Column(db.Boolean, default=False)

    image_url = db.Column(db.String(500), nullable=True)  # Cloudinary URL

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = db.relationship("Category")
    city = db.relationship("City")

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(200), nullable=False)
    category_name = db.Column(db.String(120), nullable=False)
    city_name = db.Column(db.String(120), nullable=False)

    contact = db.Column(db.String(255), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    message = db.Column(db.Text, nullable=True)

    submitter_name = db.Column(db.String(120), nullable=True)
    submitter_email = db.Column(db.String(120), nullable=True)

    status = db.Column(db.String(20), default="PENDING")  # PENDING/APPROVED/REJECTED

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
