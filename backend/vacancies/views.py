from .models import Vacancy
from rest_framework import viewsets
from .serializers import VacancySerializer 
from rest_framework.exceptions import PermissionDenied


class VacancyViewSet(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer 

    def perform_create(self, serializer):
        user = self.request.user
        # Check if the user is a recruiter or admin
        if user.role not in ['recruiter', 'admin']:  # Adjust the role check if you're using Groups instead
            raise PermissionDenied("You do not have permission to create a vacancy.")
        # Set the recruiter field automatically to the logged-in user
        serializer.save(recruiter=user)
    
    
    

    