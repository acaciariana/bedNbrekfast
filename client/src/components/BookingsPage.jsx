import axios from "axios";
import { useEffect, useState } from "react";
import LocationImg from "../LocationImg";
import AccountNavigation from "../AccountNavigation";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";
// import { Navigate } from "react-router-dom";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    console.log(bookings);
    // const [redirect, setRedirect] = useState('');
    useEffect(() => {
        axios.get('/bookings').then(response => {
            setBookings(response.data);
        })
    }, []);
    // if(redirect) {
    //     return <Navigate to={redirect} />
    // }
    return(
        <div>
            {/* <div>
                <button onClick={setRedirect('/account')} className="">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <h2>Back</h2>
                </button>
            </div> */}
            <AccountNavigation />
            <div>
                {bookings?.length > 0 && bookings.map(booking => (
                    <Link to={`/account/bookings/${booking._id}`} className="mt-10 flex gap-4 bg-gray-200 rounded-2xl overflow-hidden" key={booking.id}>
                        <div className="w-48">
                            <LocationImg location={booking.location}/>
                        </div>
                        <div className="py-3 grow pr-3">
                            <h2 className="text-2xl font-semibold">
                                {booking.location.title}
                            </h2>
                            <div className="text-xl">
                                <BookingDates booking={booking} className={' mb-2 mt-4 text-gray-500'}/>
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    <span className="text-2xl">
                                        Total Price: ${booking.price}
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                    </Link>
                ))}
                {bookings.length == 0 && (
                    <div className="flex mt-64 justify-center text-4xl font-bold">Book an <span className="text-primary px-2 italic">Amazing</span> Vacation!</div>
                )}
            </div>
        </div>
    );
}