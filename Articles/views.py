from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article, Author
from .serializers import ArticleSerializer, AuthorSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from .serializers import *
import json
import bleach
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from rest_framework.request import Request
from Articles.html_converters import extract_file_content


# --- Article API View ---
class PublishArticleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        article_id = request.data.get('article')

        if not article_id:
            return Response({"detail": "Article ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        article_to_publish = get_object_or_404(Article, id=article_id)
        print(article_to_publish.submitted_by)
        print(request.user)

        if article_to_publish.reviewed and request.user == article_to_publish.submitted_by:
            if article_to_publish.published == True:
                article_to_publish.published = False
                pub_status = False
            else:
                article_to_publish.published = True
                pub_status = True
            article_to_publish.save()
            return Response({"pubstatus": pub_status}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "You are not authorized to publish this article or it hasn't been reviewed yet."}, status=status.HTTP_403_FORBIDDEN)


class latestarticleview(APIView):
    queryset = Article.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ArticleSerializer
    
    def get(self, request: Request, *args, **kwargs):
        latestposts = Article.objects.order_by('-created_at')[:3]
        serializer = ArticleSerializer(instance=latestposts, many=True)
        print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


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


class ArticleReviewSubmissionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleReviewsSerializer

    def post(self, request):
        user = request.user

        if not user.is_staff:
            return Response(
                {"detail": "You must be a staff member to submit reviews."},
                status=status.HTTP_403_FORBIDDEN,
            )
        article_id = request.data.get('article')
        article = get_object_or_404(Article, id=article_id)

        article.reviewed = True
        article.reviewed_by = user
        article.save()

        # The data can come in form-data, so we combine data and files
        # print(request.data.article)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Create your views here.
