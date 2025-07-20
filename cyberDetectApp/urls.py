from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_login, name="login"),
    path('chatBot/', views.chatBot, name="chatBot"),
    path('detectBully/', views.detectBully, name="detectBully"),
    path('log_out', views.log_out, name='log_out'),
]
