from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VacancyViewSet


urlpatterns = [
    path('vacancies/', VacancyViewSet.as_view({'get': 'list', 'post': 'create'}), name='vacancy-list-create'),
    path('vacancies/<int:pk>/', VacancyViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='vacancy-detail'),
]