from django.shortcuts import render
from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from users.api_utility import decrypt_incoming_data
from .serializers import *
from .tokens import create_jwt_pair_for_user
from rest_framework.permissions import *
import base64
from django.core.files.base import ContentFile
from datetime import datetime
from Articles.models import Article
from Articles.serializers import ArticleSerializer
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.


class SignUpView(generics.GenericAPIView):
    serializer_class = SignUpSerializer
    permission_classes = []

    def post(self, request: Request):
        encrypted_b64 = request.data.get("encrypted")
        image = request.data.get("image")
        clean = request.data.get("clean")
        data = decrypt_incoming_data(encrypted_b64)
        if isinstance(clean, str):
            clean = json.loads(clean)
        if isinstance(image, list) and len(image) > 0:
            image_data = image[0].get(
                "data", None
            )  # Access the 'data' field in the first dictionary of the list
        if image_data:
            clean["profile"]["image"] = image_data
        else:
            clean.update(
                {
                    "firstname": data.get("firstname"),
                    "lastname": data.get("lastname"),
                    "password": data.get("password"),
                }
            )
        # Merge nested profile fields
        if "profile" not in clean:
            lean["profile"] = {}

        clean["profile"].update(
            {
                "phonenumber": data.get("phonenumber"),
            }
        )
        serializer = self.serializer_class(data=clean)

        if serializer.is_valid():
            serializer.save()
            response = {"message": "User Created Successfully", "data": serializer.data}

            return Response(data=response, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request: Request):
        encrypted_b64 = request.data.get("encrypted")
        decrypted_login_details = decrypt_incoming_data(encrypted_b64)
        # email = request.data.get("email")
        # password = request.data.get("password")
        user = authenticate(
            email=decrypted_login_details.get("email"),
            password=decrypted_login_details.get("password"),
        )

        if user is not None:

            tokens = create_jwt_pair_for_user(user)
            user_articles = Article.objects.filter(submitted_by=user)
            serialized_articles = ArticleSerializer(user_articles, many=True).data
            #

            # with open(user.profile.image.path, "rb") as img_file:
            # image = base64.b64encode(img_file.read()).decode("utf-8")
            response = {
                "message": "Login Successfull",
                "tokens": tokens,
                "username": user.username,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email,
                "profilephoto": user.profile.image.url,
                "title": user.profile.title,
                "phonenumber": user.profile.phonenumber,
                # "articles_submitted": serialized_articles,
                # "is_staff": True,
                "is_staff": user.is_staff,
            }
            return Response(data=response, status=status.HTTP_200_OK)

        else:
            return Response(data={"message": "Invalid email or password"})

    def get(self, request: Request):
        content = {"user": str(request.user), "auth": str(request.auth)}

        return Response(data=content, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self, request):
        return Profile.objects.get(user=request.user)

    def get(self, request):
        profile = self.get_object(request)
        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        profile = self.get_object(request)  # This should return a Profile instance
        user = User.objects.get(profile=profile)  # Get related User instance
        # Extract data sent from frontend
        user_data = {
            "firstname": request.data.get("user.firstname"),
            "lastname": request.data.get("user.lastname"),
            "email": request.data.get("user.email"),
            "username": request.data.get("user.username"),
        }

        profile_data = {
            "title": request.data.get("title"),
            "phonenumber": request.data.get("phonenumber"),
            "image": request.FILES.get("image"),
        }

        # Bind instance + data to serializers
        pro_serializer = ProfileSerializer(
            instance=profile,
            data=profile_data,
            context={"request": request},
            partial=True,
        )
        user_serializer = UserSerializer(instance=user, data=user_data, partial=True)
        is_pro_valid = pro_serializer.is_valid()
        is_user_valid = user_serializer.is_valid()

        if is_pro_valid and is_user_valid:
            pro_serializer.save()
            user_serializer.save()

            # Return combined updated data
            return Response(
                {
                    "user": user_serializer.data,
                    "profile": pro_serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "user_errors": user_serializer.errors,
                    "profile_errors": pro_serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
