from django.contrib import admin
from Articles.models import *
# Register your models here.

admin.site.register(Article)
admin.site.register(authorToarticle)
admin.site.register(Author)
