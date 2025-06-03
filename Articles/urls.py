from django.urls import path
from .views import ArticleAPIView,Article_detail_APIView,get_Article_to_review_APIView

urlpatterns = [
    path("articles/", ArticleAPIView.as_view()),
    path("articles/<int:pk>/", ArticleAPIView.as_view()),
    path("article_detail/<int:pk>/", Article_detail_APIView.as_view()),
    path("articles2review/", get_Article_to_review_APIView.as_view()),
    path("articles2review/<int:pk>/",get_Article_to_review_APIView.as_view()),
    # path('authors/', AuthorAPIView.as_view()),
    # path('authors/<int:pk>/', AuthorAPIView.as_view()),
]
