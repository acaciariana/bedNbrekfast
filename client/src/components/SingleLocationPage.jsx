/* eslint-disable react/jsx-no-target-blank */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import LocationGallery from "../LocationGallery";
import AddressLink from "../AddressLink";

export default function SingleLocationPage() {
    const {id} = useParams();
    const [location, setLocation] = useState(null);
    useEffect(() => {
        if(!id) { return; }
        else {
            axios.get(`/locations/${id}`)
            .then(response => {
                setLocation(response.data)
            })
        }
    }, [id]); //NOTE: every time the dependency changes, id, you rerun the useEffect fxn

    if(!location) {
        return '';
    }

    

    return(
        <div className="mt-8 bg-gray-200 px-8 py-8 max-w-full max-h-full rounded-3xl">
            <div className="object-contain">
                <h1 className="text-3xl">{location.title}</h1>
                <AddressLink>{location.address}</AddressLink>
                <LocationGallery location={location}/>
                <div className="mb-8 mt-8 gap-8 grid grid-cols-[2fr_1fr] border-t">
                    <div>
                        <div className="my-4">
                            <h2 className="font-semibold text-2xl">Description</h2>
                            {location.description}
                        </div>
                        Check In: {location.checkIn}<br />
                        Check Out: {location.checkOut}<br />
                        Max Number of Guests: {location.maxGuests}<br />
                        
                    </div>
                    <div>
                        <BookingWidget location={location}/>
                    </div>
                </div>
            </div>
            <div className="-m-8 px-8 py-8">
                <h2 className="font-semibold text-2xl">
                    Extra Info
                </h2>
            </div>
            <div className="mt-2 mb-2 text-sm text-gray-700 leading-5">
                            {location.extraInfo}
            </div>
            
        </div>
    );
}