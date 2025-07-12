from rest_framework.routers import DefaultRouter
from .views import MedicalEntryViewSet

router = DefaultRouter()
router.register('entries', MedicalEntryViewSet, basename='medicalentry')

urlpatterns = router.urls