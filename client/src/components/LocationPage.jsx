import { Link } from "react-router-dom";
import AccountNavigation from "../AccountNavigation";
import axios from "axios";
import { useEffect, useState } from "react";
import LocationImg from "../LocationImg";

export default function LocationPage() {
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        axios.get('/user_locations').then(({data}) => {
            setLocations(data);
        });
    }, []);
    return(
        <div>
            <AccountNavigation />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full " to={'/account/locations/new'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                    Add New Location
                </Link>
            </div>
            <div className="mt-4">
                <div>
                {locations.length > 0 && locations.map(location => (
                    <Link to={'/account/locations/'+location._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl" key={location._id}>
                        <div className="flex bg-gray-300 w-32 h-32 shrink-0">
                            <LocationImg location={location}/>
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{location.title}</h2>
                            <p className="text-sm mt-2">{location.description}</p>
                        </div>
                        
                    </Link>
                ))}
                </div>
                
            </div>
        </div>
    )
}