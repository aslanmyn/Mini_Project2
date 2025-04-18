from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('job_seeker', 'Job Seeker'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')
    is_email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
    

