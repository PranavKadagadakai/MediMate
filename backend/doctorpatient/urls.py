from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/chat/', include('chatbot.urls')),
    path('api/summarize/', include('summarizer.urls')),
    path('api/translate/', include('translator.urls')),
    path('api/forum/', include('forum.urls')),
    path('api/history/', include('history.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)