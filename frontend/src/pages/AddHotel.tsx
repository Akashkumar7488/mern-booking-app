import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForms/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from '../api-client'
const AddHotel = () =>{
    const {showToast} = useAppContext();

    const {mutate, isLoading} = useMutation(apiClient.addMyHotel, {
        onSuccess: () =>{
            showToast({message: "Hotel Saved!", type: "Success"
            });
        },
        onError: () =>{
            showToast({message: "Error saving Hotel", type: "Error"})
        }
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    }
    return (<ManageHotelForm onSave={handleSave} isLoading={isLoading}/>)
};

export default AddHotel;