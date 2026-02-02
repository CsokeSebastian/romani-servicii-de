import os

basedir = os.path.abspath(os.path.dirname(__file__))


def _normalize_database_url(url: str) -> str:
    # Heroku vechi folosește postgres://
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


class Config:
    # 🔐 Cheie pentru sesiuni (OBLIGATORIU să fie stabilă)
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")

    # 🔑 Parola pentru admin (/control-9f3a7/login)
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

    # 🗄️ Database (local SQLite / production DATABASE_URL)
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(basedir, "app.db")
    )
    SQLALCHEMY_DATABASE_URI = _normalize_database_url(DATABASE_URL)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 🔧 Flask
    DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"

    # ☁️ Cloudinary (opțional – nu strică dacă lipsesc)
    CLOUDINARY_URL = os.getenv("CLOUDINARY_URL", "")
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")
