from flask import Flask
from flask_cors import CORS

from routes.display import bp as display_bp
from routes.upload import bp as upload_bp
from routes.download import bp as download_bp
from routes.misc import bp as misc_bp
from routes.db import bp as db_bp

app = Flask(__name__)
CORS(app)


app.register_blueprint(display_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(download_bp)
app.register_blueprint(misc_bp)
app.register_blueprint(db_bp)


if __name__ == '__main__':
    app.run(debug=True)