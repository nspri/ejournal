from django.urls import path
from .views import ArticleAPIView

urlpatterns = [
    path("articles/", ArticleAPIView.as_view()),
    path("articles/<int:pk>/", ArticleAPIView.as_view()),
    # path('authors/', AuthorAPIView.as_view()),
    # path('authors/<int:pk>/', AuthorAPIView.as_view()),
]
