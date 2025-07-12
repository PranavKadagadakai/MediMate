from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/summarize/', include('summarizer.urls')),
    path('api/translate/', include('translator.urls')),
    path('api/forum/', include('forum.urls')),
    path('api/tracker/', include('tracker.urls')),
    path('api/messaging/', include('messaging.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)