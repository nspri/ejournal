from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()


class Article(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="article_files/")
    submitted_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="submittedby"
    )
    reviewed = models.BooleanField(default=False)
    reviewed_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    # author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="articles")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    cover_image = models.ImageField(upload_to="article_images/", null=True, blank=True)

    def __str__(self):
        return self.title


class Author(models.Model):
    firstname = models.CharField(max_length=45, default="john")
    lastname = models.CharField(max_length=45, default="doe")
    title = models.CharField(max_length=45, null=True)
    phone_number = models.CharField(max_length=45, null=True)
    email = models.CharField(max_length=80, null=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"


class authorToarticle(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="authors"
    )
    contribution_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.firstname} {self.author.lastname} - {self.article.title}"

class articlereviews(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    review_file = models.FileField(upload_to="review_files/",null=True,blank=True)
    review_text = models.TextField(
        blank=True,  # Allow blank in forms
        null=True,   # Allow NULL in database
        help_text="Content is optional."
    )
    reviewed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # reviewed_by = models.ForeignKey(User, on_delete=models.CASCADE)

# Create your models here.
