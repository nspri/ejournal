from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()


class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="articles")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    cover_image = models.ImageField(upload_to="article_images/", null=True, blank=True)

    def __str__(self):
        return self.title


class Author(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    contribution_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.firstnamwe} {self.user.lastname} - {self.article.title}"


# Create your models here.
