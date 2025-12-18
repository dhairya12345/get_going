from django.urls import path
from . import views

urlpatterns = [
    path('driver/login', views.login, name='login'),
    path('driver/login/dashboard',views.dashboard,name='dashboard'),
    path('driver/login/dashboard/earnings',views.earnings,name="earnings"),
    path('driver/login/dashboard/vehicledetails',views.vehicledetails,name="vehicledetails"),
    path('driver/login/dashboard/driverridedetails',views.driverridedetails,name="driverridedetails"),
    path('driver/login/dashboard/help',views.help,name="help"),
    path('driver/login/dashboard/settings1',views.settings1,name="settings1"),
]