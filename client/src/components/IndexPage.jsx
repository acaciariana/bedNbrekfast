import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        axios.get('/locations')
        .then(response => {
            setLocations(response.data);
        })
    }, [])
    return(
        <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {locations.length > 0 && locations.map(location => (
                <Link to={'/locations/' + location._id} key={location._id}>
                    <div className="bg-gray-5000 mb-2 rounded-2xl flex">
                        {location.photos?.[0] && (
                            <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/' + location.photos?.[0]} alt="" />
                        )}  
                    </div>
                    <h2 className="font-bold">{location.address}</h2>
                    <h3 className="text-sm text-gray-500">{location.title}</h3>
                    <div className="mt-1">
                        <span className="font-bold">${location.price}</span> per night
                    </div>
                </Link>
            ))}
        </div>
    );
}