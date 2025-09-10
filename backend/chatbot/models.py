from django.db import models


from django.conf import settings

class ConversationHistory(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	history = models.JSONField(default=list)  # List of dicts: {"author": "user"|"bot", "text": str}
	updated_at = models.DateTimeField(auto_now=True)

	def add_message(self, author, text):
		self.history.append({"author": author, "text": text})
		self.save()
