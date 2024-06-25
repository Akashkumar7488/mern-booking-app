import { Link } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () =>{
    const {isLoggedIn} = useAppContext();
    return (
        <>
         <div className="w-full py-6" style={{backgroundColor:"#3D7EAA"}}>
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">TravelLookup.com</Link>
                </span>
                <span className="flex space-x-2">
                    {isLoggedIn ? (<>
                    <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600"to="/my-bookings">My Bookings</Link>
                    <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/my-hotels">My Hotels</Link>
                    <SignOutButton/>
                    </>):(
                         <Link to="/sign-in" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-red-100">Sign In</Link>
                    ) }
                    
                </span>
            </div>
         </div>
        </>
    )
}
export default Header;