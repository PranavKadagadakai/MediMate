from django.apps import AppConfig

# ✨ FIX: Renamed class from HistoryConfig to TrackerConfig for clarity.
class TrackerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tracker'