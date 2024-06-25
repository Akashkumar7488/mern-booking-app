import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import {MdTravelExplore} from 'react-icons/md';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
    
    const navigate = useNavigate();
    const search = useSearchContext();
    

    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCOunt, setAdultCount] = useState<number>(search.adultCount);
    const [childCOunt, setChildCount] = useState<number>(search.childCount);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(
            destination,
            checkIn,
            checkOut,
            adultCOunt,
            childCOunt,
        );
        navigate("/search");
    };
    const minDate = new Date();
    const maxDate = new Date(); 
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    return (
        <form onSubmit={handleSubmit} className="-mt-3 p-3 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4" style={{background:"#FFEDBC"}}>
         <div className="flex flex-row items-center flex-1 bg-white p-2">
            <MdTravelExplore size={25} className="mr-2"/>
            <input placeholder="Where are you going?" className="text-md w-full focus:outline-none"
            value={destination}
            onChange={(event) => setDestination(event.target.value)} />
         </div>

         <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
                Adult:
                <input className="w-full p-1 focus:outline-none  font-bold"
                type="number"
                min={1}  
                max={20} 
                value={adultCOunt}
                onChange={(event) => setAdultCount(parseInt(event.target.value))}
                />
            </label>

            <label className="items-center flex">
                Children:
                <input className="w-full p-1 focus:outline-none  font-bold"
                type="number"
                min={0}  
                max={20} 
                value={childCOunt}
                onChange={(event) => setChildCount(parseInt(event.target.value))}
                />
            </label>
         </div>

         {/* Date */}
         <DatePicker 
         selected={checkIn} 
         onChange={(date) => setCheckIn(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="checkin Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"/>

<DatePicker 
         selected={checkOut} 
         onChange={(date) => setCheckOut(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="checkout Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"/>
            <div className="flex gap-1">
                <button className="w-2/3 bg-green-600 text-white h-full p-2 font-bold text-xl hover:bg-green-500 rounded">
                Search</button>
                <button className="w-2/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500 rounded">
                Clear</button>

            </div>
        </form>
    )
};

export default SearchBar;
