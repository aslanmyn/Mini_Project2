from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserProfileSerializer

class UserProfileView(RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
