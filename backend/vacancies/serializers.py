from rest_framework import serializers
from .models import Vacancy
from django.contrib.auth import get_user_model

class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = '__all__'  # Include all fields from the Vacancy model

    

