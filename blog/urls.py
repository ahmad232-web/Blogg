from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('login/', views.login_page_view, name='login'),
    path('signup/', views.signup_page_view, name='signup'),
    path('post/<slug:slug>/', views.post_page_view, name='post-page'),

    path('api/posts/', views.PostListView.as_view(), name='api-posts'),
    path('api/posts/<slug:slug>/', views.PostDetailView.as_view(), name='api-post-detail'),
    path('api/auth/register/', views.RegisterView.as_view(), name='api-register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='api-login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='api-refresh'),
    path('api/auth/me/', views.MeView.as_view(), name='api-me'),
]
