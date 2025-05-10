from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article, Author
from .serializers import ArticleSerializer, AuthorSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers import *
import json

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt


# --- Article API View ---


class ArticleAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ArticleSerializer

    def get(self, request, pk=None):
        if pk:
            # article = get_object_or_404(Article, pk=pk)
            # authors = Author.objects.filter(article=article)
            articles = Article.objects.prefetch_related(
                Prefetch("authors", queryset=Author.objects.all())
            )
            for article in articles:
                print(article.title)
                for author in article.authors.all():
                    print(f"- {author.firstname} {author.lastname}")
            # author_serializer = AuthorSerializer(authors, many=True)
            serializer = ArticleSerializer(article)
        else:
            articles = Article.objects.all()
            serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    def post(self, request):
        # split data into authors and article
        authors_data = request.data.get(
            "authors", "[]"
        )  # Get authors data, default to empty array if not provided
        authors_data = json.loads(authors_data)
        user = self.request.user
        data = request.data
        data.pop("submitted_by", None)
        # add the user that submitted
        data["submitted_by"] = request.user

        # print(data)
        article_serializer = ArticleSerializer(data=data, context={"request": request})
        # print(data)
        if article_serializer.is_valid():
            # save the article data
            article = article_serializer.save()

            # Now loop through authors_data, which should be a list of dictionaries
            for author_data in authors_data:
                # Ensure each author_data is a dictionary
                # create  author data with alrready existing article
                author_data["article"] = article.id  # if ForeignKey expects ID
                # save the data
                author_serializer = createAuthorSerializer(data=author_data)
                if author_serializer.is_valid():
                    author_serializer.save()
                else:
                    return Response(author_serializer.errors, status=400)

            return Response(article_serializer.data, status=201)
        else:
            return Response(article_serializer.errors, status=400)

    def put(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        serializer = ArticleSerializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Create your views here.
