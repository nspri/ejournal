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
            print("No image data found")
        
        clean.update({
                'firstname': data.get('firstname'),
                'lastname': data.get('lastname'),
                'password': data.get('password'),
            })
        # Merge nested profile fields
        if 'profile' not in clean:
            lean['profile'] = {}

        clean['profile'].update({
            'phonenumber': data.get('phonenumber'),
            })
        serializer = self.serializer_class(data=clean)

        if serializer.is_valid():
            serializer.save()
            response = {"message": "User Created Successfully", "data": serializer.data}

            return Response(data=response, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request: Request):
        encrypted_b64 = request.data.get("encrypted")
        decrypted_login_details = decrypt_incoming_data(encrypted_b64)
        # email = request.data.get("email")
        # password = request.data.get("password")
        # print(email,password)
        user = authenticate(
            email=decrypted_login_details.get("email"),
            password=decrypted_login_details.get("password"),
        )

        if user is not None:

            tokens = create_jwt_pair_for_user(user)
            user_articles = Article.objects.filter(submitted_by=user)
            serialized_articles = ArticleSerializer(user_articles, many=True).data
            # print(serialized_articles)

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
                "articles_submitted": serialized_articles,
                #"is_staff": True,
                "is_staff": user.is_staff,
            }
            print(response)
            return Response(data=response, status=status.HTTP_200_OK)

        else:
            return Response(data={"message": "Invalid email or password"})

    def get(self, request: Request):
        content = {"user": str(request.user), "auth": str(request.auth)}

        return Response(data=content, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    # serializer_class = ProfileSerializer

    def decode_base64(base64_string):
        # Split the base64 string to get the content type and the data
        format, imgstr = base64_string
        g.split(";base64,")
        # Decode base64 string
        data = ContentFile(
            base64.b64decode(imgstr), name="temp"
        )  # Assuming PNG format here
        return data

    def post(self, request: Request, name: str):
        profile = Profile.objects.get(user__username=name)
        user = User.objects.get(username=name)
        print(profile)
        email = request.data.get("email")
        user.email = email
        name = request.data.get("name")
        user.username = name
        age = request.data.get("age")
        profile.age = age
        dob = request.data.get("dob")
        date_object = datetime.strptime(dob, "%Y-%m-%d").date()
        user.date_of_birth = date_object
        print(user.date_of_birth)
        image = request.data.get("image")
        # print(image)
        if image:
            # Decode base64 string into image data
            # format, img = image.split(';base64,')
            image_data = ContentFile(base64.b64decode(image), name="profile.png")
            #   Save image data to the database
            #   image = ImageModel()
            #   image.image_field.save('image.png', image_data, save=True)  # Adjust 'image_field' to your actual image field name
            profile.image = image_data
        profile.save()
        user.save()
        response = {
            "message": "Successfull",
        }
        return Response(data=response, status=status.HTTP_200_OK)

# Create your views here.
