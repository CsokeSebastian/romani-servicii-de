from flask import Flask, request, redirect
from werkzeug.middleware.proxy_fix import ProxyFix
from .config import Config
from .extensions import db, migrate
from .public.routes import public_bp
from .admin.routes import admin_bp
from dotenv import load_dotenv
load_dotenv()  # ✅ încarcă .env înainte să importăm Config
from .extensions import db, migrate
from .public.routes import public_bp
from .admin.routes import admin_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Heroku / reverse proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix="/control-9f3a7")

    return app

    # Reverse proxy (Heroku): ca Flask să vadă corect schema/host-ul din headers
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    @app.before_request
    def force_https():
        """
        Forțează HTTPS DOAR în production (Heroku).
        Pe local NU face nimic, ca să nu te trimită în https și să nu ai nevoie de incognito.
        """

        # ✅ Local / dev: nu forța HTTPS
        if app.debug:
            return None

        # ✅ Production: forțează HTTPS doar dacă platforma îți spune că request-ul a venit pe http
        xf_proto = request.headers.get("X-Forwarded-Proto")
        if xf_proto and xf_proto != "https":
            return redirect(request.url.replace("http://", "https://", 1), code=301)

        return None

    # extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # blueprints
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix="/control-9f3a7")

    return app