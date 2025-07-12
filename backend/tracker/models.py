from django.db import models
from users.models import CustomUser

class MedicalEntry(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='medical_entries')
    entry_type = models.CharField(max_length=50, choices=[
        ('symptom', 'Symptom'),
        ('medication', 'Medication'),
        ('diagnosis', 'Diagnosis'),
    ])
    description = models.TextField()
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.entry_type} for {self.user.username} on {self.date.strftime('%Y-%m-%d')}"