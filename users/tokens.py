from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django_rest_passwordreset.signals import reset_password_token_created 
from django.template.loader import render_to_string
User = get_user_model()
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from datetime import datetime
from publications.settings import EMAIL_HOST_PASSWORD,EMAIL_HOST_USER

def create_jwt_pair_for_user(user: User):
    refresh = RefreshToken.for_user(user)

    tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}

    return tokens


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = "http://localhost:5173/"  # Replace with your production frontend URL
    token = reset_password_token.key
    full_link = f"{sitelink}password-reset-confirm?token={token}"

    context = {
        "full_link": full_link,
        "logo_url": "pub_frontend/pubfrontend/src/assets/logo.JPG",  # Replace with your actual logo URL
        "current_year": datetime.now().year,
        "email_adress": reset_password_token.user.email,
    }

    html_message = render_to_string("users/email.html", context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject=f"Reset Your Password - {reset_password_token.user.email}",
        body=plain_message,
        from_email="itharmar28@gmail.com",  # Replace with your sender email
        to=[reset_password_token.user.email],
    )
    msg.attach_alternative(html_message, "text/html")
    msg.send()
