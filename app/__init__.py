# from flask import Flask
# from .config import Config
# from .extensions import db, migrate
# from .public.routes import public_bp
# from .admin.routes import admin_bp
# from flask import Response, request, url_for

# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     db.init_app(app)
#     migrate.init_app(app, db)

#     app.register_blueprint(public_bp)
#     app.register_blueprint(admin_bp, url_prefix="/control-9f3a7")

#     return app
from flask import Flask, request, redirect
from werkzeug.middleware.proxy_fix import ProxyFix

from .config import Config
from .extensions import db, migrate
from .public.routes import public_bp
from .admin.routes import admin_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 🔒 Corect pentru Heroku (știe că e HTTPS în spate)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # 🔁 Redirect permanent HTTP → HTTPS (SEO + canonical)
    @app.before_request
    def force_https():
        if request.headers.get("X-Forwarded-Proto", "http") != "https":
            url = request.url.replace("http://", "https://", 1)
            return redirect(url, code=301)

    # extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # blueprints
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix="/control-9f3a7")

    return app