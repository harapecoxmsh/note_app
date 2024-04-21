from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    creater = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tags", null=True, blank=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    content = models.TextField()
    file = models.FileField(upload_to='uploads/',blank=True, null=True)
    file_name = models.CharField(max_length=255,blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")



