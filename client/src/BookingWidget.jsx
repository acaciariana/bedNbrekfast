import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";


/* eslint-disable react/prop-types */
export default function BookingWidget({location}) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const {user} = useContext(UserContext);

    useEffect(() => {
        if(user) {
            setName(user.name);
        }
    }, [user])

    let numberOfNights = 0;
    if(checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }
    async function bookLocation() {
        const data = {
            checkIn, 
            checkOut, 
            guests, 
            name, 
            phone,
            location: location._id, 
            price: numberOfNights * location.price
        };

        const response = await axios.post('/booking', data);
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`)

        
    }
    if(redirect) {
        return <Navigate to={redirect} />
    }
    return(
        <div className="bg-white shadow p-4 rounded-2xl">
                <div className="text-2xl text-center">
                    Price: ${location.price} / per night
                </div>
                <div className="border rounded-2xl mt-4">
                    <div className="flex">
                        <div className="py-3 px-4">
                            <label className="pr-2">Check In:</label>
                            <input type="date" className="" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}/>
                        </div>
                        <div className="py-3 px-4 border-l">
                            <label className="pr-2">Check Out:</label>
                            <input type="date" className="" value={checkOut} onChange={ev => setCheckOut(ev.target.value)}/>
                        </div>
                    </div>
                    <div className="py-3 px-4 border-t">
                            <label>Number of Guests</label>
                            <input type="number" value={guests} onChange={ev => setGuests(ev.target.value)}/>
                    </div>
                    {numberOfNights > 0 && (
                        <div>
                            <div className="py-3 px-4 border-t">
                                <label>Full Name: </label>
                                <input type="text" value={name} onChange={ev => setName(ev.target.value)}/>
                            </div>
                            <div className="py-3 px-4 border-t">
                                <label>Phone Number: </label>
                                <input type="tel" value={phone} onChange={ev => setPhone(ev.target.value)}/>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={bookLocation} className="primary mt-4">
                    Book This Place 
                    {numberOfNights > 0 && (
                        <span className="pl-1">
                            for ${numberOfNights * location.price}
                        </span>
                    )}
                </button>
            </div>
    );
}