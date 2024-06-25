import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom"
import * as apiClient from '../api-client';
import ManageHotelForm from "../forms/ManageHotelForms/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () =>{
    const {hotelId} = useParams();
   const {showToast} = useAppContext();
    const { data: hotel, isLoading, error } = useQuery(
        ["fetchMyHotelById", hotelId],
        () => apiClient.fetchMyHotelById(hotelId || ''),
        {
            enabled: !!hotelId,
        }
    );

    const {mutate } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            showToast({message: "Hotel Saved!", type: "Success"})
        },
        onError: () => {
            showToast({message: "Error saving Hotel", type: "Error"})
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    }
    return <ManageHotelForm  hotel={hotel} onSave={handleSave} isLoading={isLoading} />
   
}

export default EditHotel; 