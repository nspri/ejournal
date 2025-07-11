from django.urls import path
from .views import (
    ArticleAPIView,
    get_Article_to_review_APIView,
    ArticleReviewSubmissionAPIView,
    PublishArticleView,
    article_submitted_by_user,
)

urlpatterns = [
    path("articles/", ArticleAPIView.as_view()),
    path("articles/<int:pk>/", ArticleAPIView.as_view()),
    # path("article_detail/<int:pk>/", Article_detail_APIView.as_view()),
    path("articles2review/", get_Article_to_review_APIView.as_view()),
    path("articles2review/<int:pk>/", get_Article_to_review_APIView.as_view()),
    path("review_submissions/", ArticleReviewSubmissionAPIView.as_view()),
    path("publish_paper/", PublishArticleView.as_view()),
    path(
        "user_articles/",
        article_submitted_by_user.as_view(),
    ),
    # path('authors/', AuthorAPIView.as_view()),
    # path('authors/<int:pk>/', AuthorAPIView.as_view()),
]
