from rest_framework.routers import DefaultRouter
from .views import HistoryViewSet

router = DefaultRouter()
router.register('', HistoryViewSet)

urlpatterns = router.urls