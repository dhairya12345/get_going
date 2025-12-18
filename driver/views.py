from django.shortcuts import render,redirect
from customer.models import Details
from customer.models import AvailableRides
from customer.models import conform_ride
from customer.models import request_ride
from customer.models import cancel_ride
from customer.models import Vehical
from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from datetime import timedelta
from django.db import transaction
from django.core.mail import EmailMultiAlternatives
from customer.utils import get_coords_from_address
from django.db.models import F
import json
import h3
from datetime import datetime
# Create your views here.
def login(request):
    user = None
    if request.method == 'POST':
        username = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = Details.objects.values('id','password').get(email=username)
        except Details.DoesNotExist:
            print("exception data not exist")
        if user!= None:
            stored_password = user['password']
            if password == stored_password:
                request.session['valid'] = user["id"]
                return redirect('dashboard')
            else:
                return HttpResponse("not valid login again")
    return render(request, 'loginpage.html')

def dashboard(request):
    valid = request.session.get('valid')
    if not valid:
        return redirect('login')
    else:
        user_data = Details.objects.get(id=valid)
        avl_ride = AvailableRides.objects.filter(
            u_id__id = valid,
        )
        total_earning = 0
        for ride in avl_ride:
            booked_seats = ride.vehical_id.seats_available - ride.remain_seats
            total_earning += booked_seats * float(ride.price or 0)
        total_ride = avl_ride.count()
        conform_data = list(conform_ride.objects.filter(
            avl_ride__u_id__id = valid,
        ))
        for i in conform_data:
            i.ride_type = 'Completed'
        cancel_data = list(cancel_ride.objects.filter(
            avl_ride__u_id__id = valid,
        ))
        for j in cancel_data:
            j.ride_type = 'Cancelled'
        tabel_data = conform_data + cancel_data
        tabel_data.sort(key=lambda x: (x.avl_ride.date, x.avl_ride.time), reverse=True)
        context = {
            'user_data': user_data,
            'earning' : total_earning,
            'total_ride': total_ride,
            'tabel_data': tabel_data,

        }
    return render(request,'dashboard.html',context)
def earnings(request):
    valid = request.session.get('valid')
    now = timezone.now()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

   
    user_data = Details.objects.get(id=valid)
    avs_ride = conform_ride.objects.filter(
        u_id__id=valid,
    )
    avs_ride_week = avs_ride.filter(avl_ride__date__gte=week_ago, avl_ride__date__lt=now)
    avs_ride_month = avs_ride.filter(avl_ride__date__gte=month_ago, avl_ride__date__lt=now)
    totalride = avs_ride.count()
    total_week_earning = 0
    for ride in avs_ride_week:
        booked_seats = ride.avl_ride.vehical_id.seats_available - ride.avl_ride.remain_seats
        total_week_earning += booked_seats * float(ride.avl_ride.price or 0)
    total_month_earning =0
    for ride in avs_ride_month:
        booked_seats = ride.avl_ride.vehical_id.seats_available - ride.avl_ride.remain_seats
        total_month_earning += booked_seats * float(ride.avl_ride.price or 0)

    context = {
        'lastweek': total_week_earning,
        'lastmonth': total_month_earning,
        'totalride': totalride,
        'user_data':user_data,
    }

    return render(request, "earnings.html", context)

def vehicledetails(request):
    valid = request.session.get('valid')
    if request.method == "POST":
        company1 = request.POST.get("company")
        type1 = request.POST.get("type")
        ac1 = request.POST.get("ac")
        number_plate1 = request.POST.get("number_plate")
        color1 = request.POST.get("color")
        avl_seats1 = request.POST.get("avl_seats")
        ac1 = True if ac1 == "AC" else False
        
        u_id1 = Details.objects.get(id=valid)
        if Vehical.objects.filter(u_id__id = valid).exists():
            Vehical.objects.filter(u_id=u_id1).update(
                company=company1,
                type=type1,
                ac=ac1,
                seats_available=avl_seats1,
                number_plate=number_plate1,
                color=color1
            )
        else:
            Vehical.objects.create(
                u_id=u_id1,
                company=company1,
                type=type1,
                ac=ac1,
                seats_available = avl_seats1,
                number_plate = number_plate1,
                color = color1
            )
       
    return render(request,"vehicledetails.html")


def driverridedetails(request):
    
    valid = request.session.get('valid')
    request_data = request_ride.objects.filter(avl_ride__u_id__id=valid)
    user_data = Details.objects.get(id=valid)
    context = {
        'request_data': request_data,
        'user_data' : user_data
    }

    if request.method == "POST":
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            label = data.get('label')
            if label == "accept":
                request_id = data.get('ride_id1')
                requested_data = request_data.filter(id=request_id).first()

                if not requested_data:
                    return JsonResponse({'status': 'error', 'message': 'Invalid request id'}, status=404)

                with transaction.atomic():
                    try:
                        available_ride = AvailableRides.objects.select_for_update().get(id=requested_data.avl_ride.id)
                        if available_ride.remain_seats > 0:
                            available_ride.remain_seats = F('remain_seats') - 1
                            available_ride.save()
                            available_ride.refresh_from_db()

                            conform_ride.objects.create(
                                u_id=requested_data.u_id,
                                avl_ride=requested_data.avl_ride
                            )

                            requested_data.delete()
                            recipient_mail = requested_data.u_id.email
                            subject = 'Your ride has been accepted!'
                            message = f"""
                            <html>
                            <body style='font-family: Arial, sans-serif; color: #333; background-color: #f5f9ff; padding: 20px;'>
                                <div style='background-color: #ffffff; border: 1px solid #cce5ff; border-radius: 8px; padding: 20px;'>
                                    <h2 style='color: #28a745;'>Ride Confirmation Ticket</h2>
                                    <p>Your ride has been accepted by the car owner. Here are your ride details:</p>
                                    <table style='border-collapse: collapse;'>
                                        <tr><td style='padding: 4px;'><strong>Meet Location:</strong></td><td>{available_ride.pick_up}</td></tr>
                                        <tr><td style='padding: 4px;'><strong>Destination:</strong></td><td>{available_ride.destination}</td></tr>
                                        <tr><td style='padding: 4px;'><strong>Car Number Plate:</strong></td><td>{available_ride.vehical_id.number_plate}</td></tr>
                                        <tr><td style='padding: 4px;'><strong>Car Color:</strong></td><td>{available_ride.vehical_id.color}</td></tr>
                                        <tr><td style='padding: 4px;'><strong>Date:</strong></td><td>{available_ride.date}</td></tr>
                                        <tr><td style='padding: 4px;'><strong>Time:</strong></td><td>{available_ride.time}</td></tr>
                                        <tr><td style='padding: 4px;'><strong>Price:</strong></td><td>{available_ride.price}</td></tr>
                                    </table>
                                    <p>Please reach the meeting point on time. Safe journey!</p>
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
                        else:
                            return JsonResponse({'status': 'error', 'message': 'No available seats'}, status=400)

                    except AvailableRides.DoesNotExist:
                        return JsonResponse({'status': 'error', 'message': 'Available ride not found'}, status=404)

                return JsonResponse({'status': 'ride accepted'})
            else:
                request_id = data.get('ride_id1')
                requested_data = request_data.filter(id=request_id).first()
                recipient_mail = requested_data.u_id.email
                available_ride = AvailableRides.objects.get(id=requested_data.avl_ride.id)
                requested_data.delete()
                subject = 'Your ride has been cancelled'
                message = f"""
                <html>
                <body style='font-family: Arial, sans-serif; color: #333; background-color: #f5f9ff; padding: 20px;'>
                    <div style='background-color: #ffffff; border: 1px solid #ffc107; border-radius: 8px; padding: 20px;'>
                        <h2 style='color: #dc3545;'>Ride Cancellation Notice</h2>
                        <p>We regret to inform you that your scheduled ride has been cancelled by the car owner. Please see the details below:</p>
                        <table style='border-collapse: collapse;'>
                            <tr><td style='padding: 4px;'><strong>Meet Location:</strong></td><td>{available_ride.pick_up}</td></tr>
                            <tr><td style='padding: 4px;'><strong>Destination:</strong></td><td>{available_ride.destination}</td></tr>
                            <tr><td style='padding: 4px;'><strong>Date:</strong></td><td>{available_ride.date}</td></tr>
                            <tr><td style='padding: 4px;'><strong>Time:</strong></td><td>{available_ride.time}</td></tr>
                        </table>
                        <p>We apologize for the inconvenience. You may book another ride anytime from your dashboard.</p>
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
                return JsonResponse({'status': 'ride accepted'})

        else:
            #handle form data here
            name = request.POST.get('name')
            datetime_str = request.POST.get('date')  # e.g., '2025-06-25T03:29'
            pick_up1 = request.POST.get('pickup')
            destination1 = request.POST.get('destination')
            price1 = request.POST.get('price')
            date_value = None
            time_value = None
            hex_start = get_hex(pick_up1)
            hex_destination = get_hex(destination1)
            if datetime_str:
                dt = datetime.fromisoformat(datetime_str)
                date_value = dt.date()   # use with DateField
                time_value = dt.time()   # use with TimeField
            user_data = Details.objects.filter(id = valid).first()
            print("dd",user_data)
            vehical_data = Vehical.objects.filter(u_id__id = valid).first()
            print("vehical-data",vehical_data)
            AvailableRides.objects.create(
                u_id = user_data,
                vehical_id = vehical_data,
                date = date_value,
                time = time_value,
                pick_up = pick_up1,
                destination = destination1,
                hex_pick = hex_start,
                hex_dest = hex_destination,
                price = price1,
                remain_seats = vehical_data.seats_available,
            )
            return JsonResponse({'status': 'ok'})
            
    return render(request, "driverridedetails.html", context)

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

def help(request):
     valid = request.session.get('valid')
     user_data = Details.objects.get(id=valid)
     context = {
         'user_data':user_data,
     }
     return render(request, "help.html",context)

def settings1(request):
    valid = request.session.get('valid')
    user_data = Details.objects.get(id=valid)
    context = {
         'user_data':user_data,
     }
    return render(request,"settings1.html",context)
