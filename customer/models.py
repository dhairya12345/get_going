from django.db import models
import json
# Create your models here.
class Details(models.Model):
    id  = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.CharField(max_length=320)
    password = models.CharField(max_length=20)
    phone = models.CharField(max_length=10)
    profile_img = models.CharField(max_length=200,null=True,blank=True)
    def __str__(self):
        return f"{self.id} {self.name} {self.email} {self.password} {self.phone}{self.profile_img}"

class Vehical(models.Model):
    id = models.AutoField(primary_key=True)
    u_id = models.ForeignKey(Details,on_delete=models.CASCADE)
    company = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    ac = models.BooleanField()
    seats_available = models.IntegerField()
    amenities = models.TextField(null=True,blank=True)  # Storing list as a JSON string
    number_plate = models.TextField(null=True,blank=True)
    color = models.TextField(null=True,blank=True)

    def set_amenities(self, amenities_list):
        self.amenities = json.dumps(amenities_list)

    def get_amenities(self):
        return json.loads(self.amenities)
    
    def __str__(self):
        return f"{self.id} {self.u_id.id} {self.company} {self.type} {self.ac} {self.seats_available} {self.amenities} {self.number_plate} {self.color}"

class AvailableRides(models.Model):
    id = models.AutoField(primary_key=True)
    u_id = models.ForeignKey(Details,on_delete=models.CASCADE)
    vehical_id = models.ForeignKey(Vehical,on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    pick_up = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    hex_pick = models.CharField(max_length=16)
    hex_dest = models.CharField(max_length=16)
    price = models.CharField(max_length=10,null=True,blank=True)
    remain_seats = models.IntegerField(null=True,blank=True)
    def __str__(self):
        return f"{self.id} {self.u_id.id} {self.vehical_id.id} {self.date} {self.time} {self.pick_up} {self.destination} {self.hex_pick} {self.hex_dest} {self.price} {self.remain_seats}"
    class Meta:
        unique_together = ('u_id', 'date', 'pick_up', 'destination')

class request_ride(models.Model):
    id = models.AutoField(primary_key=True)
    u_id = models.ForeignKey(Details,on_delete=models.CASCADE)
    avl_ride = models.ForeignKey(AvailableRides,on_delete=models.CASCADE)

    def __str__(self):
       return f"{self.id} {self.u_id.id} {self.avl_ride}"

class conform_ride(models.Model):
    id = models.AutoField(primary_key=True)
    u_id = models.ForeignKey(Details,on_delete=models.CASCADE)
    avl_ride = models.ForeignKey(AvailableRides,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id} {self.u_id.id} {self.avl_ride}"
class cancel_ride(models.Model):
    id = models.AutoField(primary_key=True)
    u_id = models.ForeignKey(Details,on_delete=models.CASCADE)
    avl_ride = models.ForeignKey(AvailableRides,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id} {self.u_id.id} {self.avl_ride}"

class cancel_drive(models.Model):
    id = models.AutoField(primary_key=True)
    u_id = models.ForeignKey(Details,on_delete=models.CASCADE)
    vehical_id = models.ForeignKey(Vehical,on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    pick_up = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    hex_pick = models.CharField(max_length=16)
    hex_dest = models.CharField(max_length=16)
    price = models.CharField(max_length=10,null=True,blank=True)
    
    
    def __str__(self):
        return f"{self.id} {self.u_id.id} {self.vehical_id.id} {self.date} {self.time} {self.pick_up} {self.destination} {self.hex_pick} {self.hex_dest} {self.price}"
