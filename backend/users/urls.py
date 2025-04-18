from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import path, include
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from .views import UserProfileView

urlpatterns = [
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/auth/password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/auth/', include('dj_rest_auth.urls')),               
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
]
