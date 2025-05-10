from django.db import models
from doctorpatient.settings import AUTH_USER_MODEL

class UserQueryHistory(models.Model):
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    query = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)