import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"

# Worker processes
workers = 1
timeout = 120

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Server mechanics
preload_app = False