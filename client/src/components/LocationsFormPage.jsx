import { useEffect, useState } from "react";
import Features from "../Features";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNavigation from "../AccountNavigation";
import { Navigate, useParams } from "react-router-dom";

export default function LocationsFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [features, setFeatures] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(1);
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/locations/' + id)
        .then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setDescription(data.description);
            setAddedPhotos(data.photos);
            setFeatures(data.features);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        })
    }, [id])
    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text) {
        return( 
            <p className="text-sm text-gray-500">{text}</p>
        );
    }
    
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    async function saveLocation(ev) {
        ev.preventDefault();
        const locationData = {
            title, 
                address, 
                addedPhotos, 
                description, 
                features, 
                extraInfo, 
                checkIn, 
                checkOut, 
                maxGuests,
                price
        }
        if(id){
            await axios.put('/locations', {
                id, ...locationData
                
            });
        } else {
            await axios.post('/locations', locationData);
        }
        
        setRedirect(true);
    }

    if(redirect) {
        return <Navigate to={'/account/locations'} />
    }


    return (
        <div className="">
            <AccountNavigation />
            <form onSubmit={saveLocation} className="">
                {preInput('Title', 'Title for your accomodations, keep it short and sweet!')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example, my lovely apartment" className="" />
                {preInput('Address', 'Address to this place')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" className="" />
                {preInput('Photos', 'The more photos, the better!')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                {preInput('Description', 'Description of the place')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>
                {preInput('Features', 'Select all features of your location')}
                <div className="mt-2 gap-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1">
                    <Features selected={features} onChange={setFeatures}/>
                </div>
                {preInput('Extra info', 'House rules, etc.')}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>
                {preInput('Check in/check out times', 'Add check in and check out times')}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                        <h3 className="mt-2">Check-in time</h3>
                        <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="14:00"/>
                    </div>
                    <div>
                        <h3 className="mt-2">Check-out time</h3>
                        <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                    <div>
                        <h3 className="mt-2">Max number of guests</h3>
                        <input type="text" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} />
                    </div>
                    <div>
                        <h3 className="mt-2">Price per Night</h3>
                        <input type="text" value={price} onChange={ev => setPrice(ev.target.value)} />
                    </div>
                </div>
                <div className="">
                    <button className="primary my-4">Save</button>
                </div>
            </form>
        </div>
    )
}