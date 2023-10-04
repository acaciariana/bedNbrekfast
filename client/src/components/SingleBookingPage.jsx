import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import AddressLink from "../AddressLink";
import LocationGallery from "../LocationGallery";
import BookingDates from "../BookingDates";

export default function SingleBookingPage() {
    const {id} = useParams();
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        if(id){
            axios.get('/bookings').then(response  => {
                const foundBooking = response.data.find(({_id}) => _id === id);
                if(foundBooking){
                    setBooking(foundBooking);
                }
            })
        }
    },[id]);

    if(!booking){
        return '';
    }
    return (
        <div className="my-8">
            <h1 className="text-3xl">{booking.location.title}</h1>
            <AddressLink className="my-2 block">{booking.location.address}</AddressLink>
            <div className="flex bg-gray-200 my-6 p-6 rounded-2xl items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-4">Your Booking Information</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>
                        Total Price:
                    </div>
                    <div className="text-3xl">   
                        ${booking.price}
                    </div>
                </div>
            </div>
            <LocationGallery location={booking.location}/>
        </div>
    )
}