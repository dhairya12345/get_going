from django.shortcuts import render, redirect
from .models import Details
from .models import AvailableRides
from .models import request_ride
from .models import conform_ride
import json
from django.utils import timezone
import firebase_admin
from firebase_admin import auth, credentials
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.contrib import messages

from opencage.geocoder import OpenCageGeocode
from datetime import datetime
from .utils import get_coords_from_address
from django.core.mail import EmailMultiAlternatives
import h3
import os
if not firebase_admin._apps:
    # Replace 'path_to_your_service_account_key.json' with the actual path to your service account JSON file
    cred_path = settings.FIREBASE_ADMIN_KEY_PATH
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

def driver_aboutus(request):
    return render(request,'driver_aboutus.html')

def customer(request):     
    return render(request, 'frontpage.html')

def rider_aboutus(request):
    return render(request,"rider_aboutus.html")
def login(request):
     user = None
     if request.method == 'POST':
        username = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = Details.objects.values('id','password').get(email=username)
        except Details.DoesNotExist:
             print("exception data not exist")
        if user != None:
            stored_password = user['password']
            if stored_password==password:
                request.session['valid'] = user["id"]
                return redirect('user_home1')
            else:
                return HttpResponse(f"Email: {user} is not valid")
       
     return render(request, 'loginpage.html')

def signup(request):
    if request.method == "POST":
         # Collect data from the form
        name = request.POST.get("name")
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        
        # Prepare data dictionary to pass as a message
        data = {
            'name': name,
            'email': email,
            'password': password,
            'phone': phone,
        }
        
        # Print the data for debugging purposes
        print(f"Data being passed to message: {data}")
        
        # Add the data to the messages framework (use info level to temporarily store data)
        messages.add_message(request, messages.INFO, json.dumps(data))
        
        # Redirect to phoneAuth view
        return redirect('phoneAuth')

    return render(request, 'signup.html')

def phoneAuth(request):
       message = messages.get_messages(request)
       name, email, phone, password = None, None, None, None
       print(f"Messages in phoneAuth: {message}")
       if message:
         json_message = list(message)[0].message
        # Extracting the actual values
         try:
           data = json.loads(json_message)
           name = data.get('name')
           email = data.get('email')
           phone = data.get('phone')
           password = data.get('password')

           request.session['name'] = name
           request.session['email'] = email
           request.session['phone'] = phone
           request.session['password'] = password


           print("my var data is :",name,email,phone,password)
           
         except json.JSONDecodeError:
            return JsonResponse({"error": "invalid json formate"})

       if request.method == "POST":
           
           try:
              print(request.body)
              if not request.body:
               return JsonResponse({"error": "Request body is empty"}, status=400)
              data =json.loads(request.body)
              id_token = data.get("token")
              if not id_token:
                return JsonResponse({"error": "Missing ID token in the request body"}, status=400)
            
    
              decoded_token = auth.verify_id_token(id_token)
              uid = decoded_token["uid"]
              phone_number = decoded_token.get("phone_number","unknown")
    
            # Optionally, you can hash the password here before storing it securely in your database.
            # Ensure you use a proper password hashing mechanism (e.g., `make_password()` in Django).
              name = request.session.get('name')
              email = request.session.get('email')
              phone = request.session.get('phone')
              password = request.session.get('password')
            
              print("Inside:", name, email, phone, password)
              try:
                if Details.objects.filter(email=email).exists():
                    redirect("login")
                else:
                    Details.objects.create(
                    name=name,
                    email=email,
                    password=password,  # Store hashed password in production
                    phone=phone,
                 )
        
                request.session.pop('name', None)
                request.session.pop('email', None)
                request.session.pop('phone', None)
                request.session.pop('password', None)  
              except Exception as e:
                      return JsonResponse({"error": str(e)})
                 
              
           
              return JsonResponse({"message": "OTP verified", "uid": uid, "phone_number": phone_number}, status=200)
           except json.JSONDecodeError:
              return JsonResponse({"error": "Invalid JSON format in request body"}, status=400)
           except Exception as e:
               return JsonResponse({"error": str(e)}, status=400)
    
       return render(request, 'otp.html')

def user_home1(request):
    valid = request.session.get('valid')
    referer = request.META.get('HTTP_REFERER')
    print('hello',valid)
    if not referer or 'customer/login/' not in referer:
         return redirect('loginpage')
        
    elif not valid:
        return redirect('loginpage')
    else:  
        user_data = Details.objects.get(id=valid)
        avl_ride = AvailableRides.objects.filter(
            u_id__id = valid,
        )
        ava_ride = conform_ride.objects.filter(
         u_id__id=valid,
         avl_ride__date__gte=timezone.localdate()
     )  # Returns None, not exception
        print("helloo",ava_ride)
        context = {
            'user_data' : user_data,
            'ava_ride' : ava_ride,
            'avl_ride' : avl_ride
        } 
        return render(request, "user_home1.html",context)
   
def profile(request):
    valid = request.session.get('valid')
    referer = request.META.get('HTTP_REFERER')
    if not referer or 'customer/login/user_home1' not in referer:
         return redirect('user_home1')
        
    elif not valid:
        return redirect('loginpage')
    else:   
        user = Details.objects.get(id = valid)
        context = {
            'user':user,
        }
    if request.method == "POST":
        uploaded_file = request.FILES.get('file')
        name = request.POST.get("name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        password = request.POST.get("password")
        if name and email and phone:
            details = Details.objects.get(id=valid)
            details.name = name.strip()
            details.email = email.strip()
            details.phone = phone.strip()
            if password:
                details.password = password.strip()
            details.save()
            return JsonResponse({'status':'ok'})
        if uploaded_file:
            file_name = uploaded_file.name
            parts = file_name.split('.')
            file_extension = parts[-1]
            new_file = str(valid)+'.'+file_extension
            path = os.path.join(settings.BASE_DIR,'static','profile',new_file)
            with open(path,'wb+') as f:
                for i in uploaded_file:
                    f.write(i)
            try:
                details = Details.objects.get(id=valid)
                details.profile_img = "profile"+"/"+ new_file
                details.save()
            except Details.DoesNotExist:
                print("user not exist")
            return JsonResponse({'status':'ok'})
    return render(request,"wallet_profile.html",context)

def book_ride(request):
    if request.method == "POST":  # ✅ Use `.method`, not `== "POST"` string compare
        try:
            data = json.loads(request.body)
            source = data.get('source')
            destination = data.get('destination')
            date = data.get('date')
            time = data.get('time')
        

            hex_start = get_hex(source)
            hex_destination = get_hex(destination)

            if not hex_start or not hex_destination:
              return JsonResponse({'status': 'error', 'message': 'Invalid location data'}, status=400)
            
            nearby_hexes_start = list(h3.grid_ring(hex_start, k=1))
            nearby_hexes_destination = list(h3.grid_ring(hex_destination, k=1))
            nearby_hexes_start.append(hex_start)
            nearby_hexes_destination.append(hex_destination)
            print(f"Nearby Hexes Start: {nearby_hexes_start}")
            print(f"Nearby Hexes Destination: {nearby_hexes_destination}")
            print("Hex Start:", hex_start)
            print("Hex Destination:", hex_destination)
            # Query for rides where both hex_pick and hex_dest match the nearby hexes
            nearby_location = AvailableRides.objects.filter(
                hex_pick__in=nearby_hexes_start, hex_dest__in=nearby_hexes_destination,date=date
            )

            print("Found rides:", nearby_location)
            ride_data = []
            for location in nearby_location:
                # Format the departure time nicely
                try:
                    departure_dt = datetime.combine(location.date, location.time)
                    departure_str = departure_dt.strftime("%d/%m/%Y, %-I:%M %p")  # use %-I for non-padded hour (Linux)
                except Exception as e:
                    departure_str = f"{location.date} {location.time}"  # fallback

                # Ensure amenities is a list
                amenities = location.vehical_id.amenities
                if not isinstance(amenities, list):
                    amenities = [amenities] if amenities else []

                # Ensure avatar is a full URL (adjust if needed)
                avatar_url = location.u_id.profile_img
                if avatar_url and not avatar_url.startswith("http"):
                    avatar_url = request.build_absolute_uri(avatar_url)

                ride = {
                    "id": location.id,
                    "driver": {
                        "name": location.u_id.name,
                        "avatar": avatar_url,
                        "rating":  4.5,
                        "reviews":  42
                    },
                    "price": int(location.price),
                    "source": location.pick_up,
                    "destination": location.destination,
                    "departure": departure_str,
                    "car": {
                        "model": location.vehical_id.company,
                        "type": location.vehical_id.type,
                        "ac": bool(location.vehical_id.ac),
                        "seatsAvailable": int(location.vehical_id.seats_available),
                    },
                    "amenities": ['ac','wifi']
                }

                ride_data.append(ride)
            print(ride_data)
            
            # ✅ Return list with safe=False
            return JsonResponse(ride_data, safe=False)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

    return render(request, "book_ride.html")

  
def get_hex(address):
    try:
        if not address:
            print("No address provided")
            return None

        lat, lon = get_coords_from_address(address)
        
        # Check explicitly if lat and lon are not None
        if lat is None or lon is None:
            print("Coordinates not found")
            return None
        
        print(lat, lon)
        resolution = 6
        center_hex = h3.latlng_to_cell(lat, lon, resolution)
        print(f"Center Hex: {center_hex}")

        return center_hex

    except Exception as e:
        print(f"Error: {e}")
        return None


def user(request):
    valid = request.session.get('valid')
    try:
        
        if request.method == "POST":
            content_type = request.content_type
            if content_type and ("application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type):
                        source = request.POST.get("source")
                        destination = request.POST.get("destination")
                        date = request.POST.get("date")
                        time = request.POST.get("time")
                        print (dir(h3))
                        print(source)
                        hex_start = get_hex(source)
                        hex_destination = get_hex(destination)
                        resolution = 6
                        radius_km = 15
                        edge_length_km = h3.average_hexagon_edge_length(resolution, unit='km')
                        hex_diameter = 2 * edge_length_km  # approx distance across hexagon

                        k = int(radius_km / hex_diameter)
                        if radius_km % hex_diameter != 0:
                          k += 1   
                                                

                        nearby_hexes_start = list(h3.grid_disk(hex_start, k))
                        nearby_hexes_destination = list(h3.grid_disk(hex_destination, k))
                        nearby_hexes_start.append(hex_start)
                        nearby_hexes_destination.append(hex_destination)
                        print(f"Nearby Hexes Start: {nearby_hexes_start}")
                        print(f"Nearby Hexes Destination: {nearby_hexes_destination}")
                        print("Hex Start:", hex_start)
                        print("Hex Destination:", hex_destination)
                        # Query for rides where both hex_pick and hex_dest match the nearby hexes
                        rides = AvailableRides.objects.filter(
                            hex_pick__in=nearby_hexes_start, hex_dest__in=nearby_hexes_destination
                        )

                        print("Found rides:", rides)

                        print(source,destination)
                        
                        data = list(rides.values("id","u_id__name","u_id__profile_img","vehical_id__seats_available","price","time"))
                        return JsonResponse({'rides': data})
            elif content_type and "application/json" in content_type:
                try:
                    json_data = json.loads(request.body.decode('utf-8'))
                    ride_id = json_data.get('ride_id')
                    print("my ride id is:",ride_id)
                    print("detail id",valid)
                    u_id = Details.objects.get(id=valid)
                    avl_ride = AvailableRides.objects.get(id=ride_id)
                    request_ride.objects.create(
                      u_id = u_id,
                      avl_ride = avl_ride
                    )

                    return JsonResponse({'status':'success','type':'json','message':'user data entered'})
                except (ValueError,UnicodeDecodeError):
                    return JsonResponse({'error': 'Invalid JSON'},status=400)
    except Exception as e:
        print("Error:",e)
        return JsonResponse({"error": str(e)},status=500)

    return render(request,"user.html")

def logout_user(request):
    request.session.flush()
    return redirect('loginpage')

def cancelride(request):
    valid = request.session.get('valid')
    req_ride = list(request_ride.objects.filter(
        u_id__id = valid
    ))
    for i in req_ride:
        i.ride_status = "requested"
    conf_ride = list(conform_ride.objects.filter(
        u_id__id = valid
    ))
    for j in conf_ride:
        j.ride_status = "conformed"
    
    today = timezone.now().date()
    now_time = timezone.now().time()

    # Filter out null dates and keep only upcoming
    tabel_data = [r for r in (req_ride + conf_ride) if r.avl_ride.date and r.avl_ride.date >= today]

    # Sort, safely defaulting null times
    tabel_data.sort(key=lambda x: (
       x.avl_ride.date,
       x.avl_ride.time or now_time
    ))

    context = {
        'tabel_data' : tabel_data,
    }
    if request.method == 'POST':
        data = json.loads(request.body)
        ride_id = data.get('ride_id')
        ride_status = data.get('ride_status')
        if ride_status == "requested":
            try:
                ride = request_ride.objects.get(avl_ride__id = ride_id)
                rider_name = ride.u_id.name
                pickup = ride.avl_ride.pick_up
                destination = ride.avl_ride.destination
                date = ride.avl_ride.date
                time = ride.avl_ride.time
                recipient_mail = ride.avl_ride.u_id.email
                ride.delete()
                subject = 'Cancelled Ride by Rider'
                message = f"""
                <html>
                <body style='font-family: Arial, sans-serif; color: #333; background-color: #f5f9ff; padding: 20px;'>
                    <div style='background-color: #ffffff; border: 1px solid #cce5ff; border-radius: 8px; padding: 20px;'>
                    <h2 style='color: #007bff;'>Ride Cancellation Notice</h2>
                    <p><strong>{rider_name}</strong> has cancelled their ride.</p>
                    <table style='border-collapse: collapse;'>
                        <tr><td style='padding: 4px;'><strong>From:</strong></td><td>{pickup}</td></tr>
                        <tr><td style='padding: 4px;'><strong>To:</strong></td><td>{destination}</td></tr>
                        <tr><td style='padding: 4px;'><strong>Date:</strong></td><td>{date}</td></tr>
                        <tr><td style='padding: 4px;'><strong>Time:</strong></td><td>{time}</td></tr>
                    </table>
                    <p>We apologize for any inconvenience.</p>
                    </div>
                    <p style='font-size: 12px; color: #999; margin-top: 10px;'>This is an automated message from Get Going.</p>
                </body>
                </html>
                """
        
                from_email = 'kavyapatel272727@gmail.com'
                recipient_list = [recipient_mail]
        
                msg = EmailMultiAlternatives(subject, '', from_email, recipient_list)
                msg.attach_alternative(message, "text/html")
                msg.send()
                return JsonResponse({'message': 'successfull'})
            except request_ride.DoesNotExist:
                return JsonResponse({'error': 'Ride not found'}, status=404)
        elif ride_status == "conformed":
            try:
                ride = conform_ride.objects.get(avl_ride__id = ride_id)
                ride.delete()
                return JsonResponse({'message': 'successfull'})
            except conform_ride.DoesNotExist:
                return JsonResponse({'error': 'Ride not found'}, status=404)
        else:
            return JsonResponse({'error': 'Invalid request'},status=400)

    return render(request,'cancelride.html',context)