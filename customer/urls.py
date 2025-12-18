from django.urls import path
from . import views

urlpatterns = [
    path('customer/', views.customer, name='customer'),
    path('customer/login/',views.login,name='loginpage'),
    path('customer/signup',views.signup,name="signup"),
    path('customer/phoneAuth/',views.phoneAuth,name="phoneAuth"),
    path('customer/login/user_home1',views.user_home1,name="user_home1"),
    path('customer/login/user_home1/profile',views.profile,name="profile"),
    path('customer/login/user_home1/book_ride',views.book_ride,name="book_ride"),
    path('customer/login/user_home1/user',views.user,name="user"),
    path('customer/login/logout.html', views.logout_user, name='logout'),
    path('customer/login/user_home1/cancelride',views.cancelride,name="cancelride"),
    path('customer/driver_aboutus',views.driver_aboutus,name='driver_aboutus'),
    path('customer/rider_aboutus',views.rider_aboutus,name='rider_aboutus')

]