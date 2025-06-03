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
import bleach
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from Articles.html_converters import extract_file_content


# --- Article API View ---
class Article_detail_APIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ArticleSerializer

    def get(self, request, pk=None):
        print(pk)
        if pk:
            article = get_object_or_404(Article, pk=pk)
            html = extract_file_content(article.file)
            print(html)
            safe_html = bleach.clean(
                html,
                tags=[
                    "p", "br", "strong", "em", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "blockquote", "a"
                ],
                attributes={"a": ["href"]},
                strip=True,
            )

            return JsonResponse({"html": safe_html},status=200)



class ArticleAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ArticleSerializer

    def get(self, request, pk=None):

        if pk:
            # article = get_object_or_404(Article, pk=pk)
            # authors = Author.objects.filter(article=article)
            articles = Article.objects.prefetch_related(
                Prefetch(
                    "authors",  # related_name from authorToarticle
                    queryset=authorToarticle.objects.select_related("author"),
                )
            )
            for article in articles:
                #print(article.title)
                for author in article.authors.all():
                    print(f"- {author.firstname} {author.lastname}")
            # author_serializer = AuthorSerializer(authors, many=True)
            serializer = ArticleSerializer(article)
        else:
            # articles = Article.objects.all()
            articles = Article.objects.filter(published=True,reviewed=True).prefetch_related(
                Prefetch(
                    "authors",  # related_name from authorToarticle
                    queryset=authorToarticle.objects.select_related("author"),
                )
            )
            print(articles)
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
                author_serializer = createAuthorSerializer(data=author_data)
                if author_serializer.is_valid():
                    author_serializer.save()
                    author_article_combined_data = {}
                    author_article_combined_data["author"] = (
                        author_serializer.instance.id
                    )
                    author_article_combined_data["article"] = article.id
                    article_to_author_serializer = createAuthorToArticleSerializer(
                        data=author_article_combined_data
                    )
                    if article_to_author_serializer.is_valid():
                        article_to_author_serializer.save()
                    else:
                        return Response(author_serializer.errors, status=400)
            return Response(article_serializer.data, status=201)
        else:
            return Response(article_serializer.errors, status=400)

    def put(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        print(request.data)
        article.title = request.data.get("title")
        article.file = request.data.get("file")
        article.cover_image =request.data.get("cover_image")
        article.save()
        articletoauthor = authorToarticle.objects.filter(article=article).delete()
        authors_data = request.data.get(
            "authors", "[]"
        ) 
        authors_data = json.loads(authors_data)
        print(authors_data)
        for author_data in authors_data:
            a = author_data.get("author", author_data) 
            #print(a["firstname"])
            new_author = Author.objects.create(firstname=a["firstname"],lastname=a["lastname"],phone_number=a["phone_number"],email=a["email"],title=a["title"])
            print(new_author)
            authorToarticle.objects.create(article = article,author = new_author)
            #Author.objects.create(firstname=author_data)
        serializer = ArticleSerializer(article)
            # serializer.save()
        print(serializer.data)
        return Response(serializer.data,status=201)
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# to send articles that are to be reviews to teh  frontend 
class get_Article_to_review_APIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ArticleSerializer

    def get(self, request, pk=None):
        if pk:
            # article = get_object_or_404(Article, pk=pk)
            # authors = Author.objects.filter(article=article)
            articles = Article.objects.filter(published=False,reviewed=False).prefetch_related(
                Prefetch(
                    "authors",  # related_name from authorToarticle
                    queryset=authorToarticle.objects.select_related("author"),
                )
            )
            for article in articles:
                print(article.title)
                for author in article.authors.all():
                    print(f"- {author.firstname} {author.lastname}")
            # author_serializer = AuthorSerializer(authors, many=True)
            serializer = ArticleSerializer(article)
        else:
            # articles = Article.objects.all()
            articles = Article.objects.filter(published=False,reviewed=False).prefetch_related(
                Prefetch(
                    "authors",  # related_name from authorToarticle
                    queryset=authorToarticle.objects.select_related("author"),
                )
            )
            # print(articles)
            serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)
# Create your views here.
