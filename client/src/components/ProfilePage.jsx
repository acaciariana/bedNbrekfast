import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import LocationPage from "./LocationPage";
import AccountNavigation from "../AccountNavigation";

export default function ProfilePage(){ 
    const [redirect, setRedirect] = useState(null);
    const {ready, user, setUser} = useContext(UserContext);

       // eslint-disable-next-line react-hooks/rules-of-hooks
    let {subpage} = useParams();
    if(subpage === undefined) {
        subpage = 'profile';
    }
    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }
    if(!ready){
        return 'Loading...';
    }
    if(ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    
    if(redirect) {
        return <Navigate to={redirect} />
    }
    return(
        <div>
            <AccountNavigation />
                {subpage === 'profile' && (
                    <div className="text-center max-w-lg mx-auto">
                        Logged in as {user.name} ({user.email}) <br />
                        <button onClick={logout} className="primary max-w-md mt-2">Logout</button>
                    </div>
                )}
                {subpage === 'locations' && (
                    <LocationPage />
                )}
            
        </div>
    );
}