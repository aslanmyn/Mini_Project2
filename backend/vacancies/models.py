from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Vacancy(models.Model):
    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vacancies')
    title = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.TextField(
        help_text="Comma-separated list of required skills (e.g., Python, Django, REST)"
    )
    experience_required = models.PositiveIntegerField(
        help_text="Minimum years of experience required"
    )
    location = models.CharField(max_length=255, blank=True, null=True)
    job_type = models.CharField(
        max_length=50,
        choices=[
            ("full_time", "Full-Time"),
            ("part_time", "Part-Time"),
            ("contract", "Contract"),
            ("internship", "Internship"),
            ("remote", "Remote"),
        ],
        default="full_time"
    )
    salary_min = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    salary_max = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Vacancy"
        verbose_name_plural = "Vacancies"
        ordering = ['-created_at']


    def __str__(self):
        return f"{self.title} - {self.recruiter.username}"
    
    

    def skill_list(self):
        return [skill.strip().lower() for skill in self.required_skills.split(",") if skill.strip()]
    
    