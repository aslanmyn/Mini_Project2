from dj_rest_auth.serializers import LoginSerializer, PasswordResetSerializer
from rest_framework import serializers
from .models import User
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


class CustomLoginSerializer(LoginSerializer):
    username = None  # remove username field
    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        # override to use email as the login field
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = self.authenticate(request=self.context.get('request'),
                                     email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        attrs['user'] = user
        return attrs



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']  # Add other fields if needed