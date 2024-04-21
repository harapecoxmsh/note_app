from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),
    path('tags/', views.TagListCreate.as_view(), name='tag-create'),
    path('notes/<int:pk>/download/', views.download_file, name='download_file'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
