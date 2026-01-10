from flask import Flask
from .config import Config
from .extensions import db, migrate
from .public.routes import public_bp
from .admin.routes import admin_bp
from flask import Response, request, url_for

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix="/control-9f3a7")

    return app
