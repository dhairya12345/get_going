from django.contrib import admin
from .models import Details
from .models import Vehical
from .models import AvailableRides
from .models import request_ride
from .models import conform_ride
from .models import cancel_ride
# Register your models here.

class DetailsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "password", "phone","profile_img")

admin.site.register(Details, DetailsAdmin)

class VehicalAdmin(admin.ModelAdmin):
    list_display = ("id","u_id","company","type","ac","seats_available","amenities","number_plate","color")

admin.site.register(Vehical,VehicalAdmin)

class AvailableRidesAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = (
        "id", "u_id", "vehical_id", "date", "time", "pick_up", "destination", "hex_pick", "hex_dest", "price","remain_seats"
    )
    
    # Searchable fields
    search_fields = ["pick_up", "destination", "vehical_id__id"]
    
    # Filters to allow easier filtering in the admin
    list_filter = ["date", "pick_up", "destination"]
    
    # Ordering for the list view
    ordering = ["date", "time"]

    # Read-only fields (e.g., 'id' can't be edited)
    readonly_fields = ("id",)

    # Define the fields to display in the form view (add/edit view)
    fields = ["u_id", "vehical_id", "date", "time", "pick_up", "destination", "hex_pick", "hex_dest", "price","remain_seats"]

    # Optionally, you can allow inlines for related models like Details or Vehical, if needed
    # inlines = [DetailsInline, VehicalInline]
    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True
    list_display_links = ("id",)

admin.site.register(AvailableRides,AvailableRidesAdmin)

class request_rideAdmin(admin.ModelAdmin):
    list_display = ("id","u_id","avl_ride")

admin.site.register(request_ride,request_rideAdmin)

class conform_rideAdmin(admin.ModelAdmin):
    list_display = ("id","u_id","avl_ride")
admin.site.register(conform_ride,conform_rideAdmin)

class cancel_rideAdmin(admin.ModelAdmin):
    list_display = ("id","u_id","avl_ride")
admin.site.register(cancel_ride,cancel_rideAdmin)