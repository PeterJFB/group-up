from django.urls import path
from .views import HelloView

# This is a simple view that returns "Hello World"
urlpatterns = [path("hello", HelloView.as_view(), name="hello")]
