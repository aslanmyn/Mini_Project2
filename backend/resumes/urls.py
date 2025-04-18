from django.urls import path
from .views import (
    ResumeUploadParseView,
    JobMatchView,
    # Add other views here when needed
)

urlpatterns = [
    path('upload/', ResumeUploadParseView.as_view(), name='resume-upload'),
    path('match/', JobMatchView.as_view(), name='job-match'),
]
