import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelSearchResponse, HotelType, UserType} from '../../backend/src/shared/types'
import { useSearchParams } from "react-router-dom";
import {paymentIntentResponse} from "../../backend/src/shared/types"
import { BookingFormData } from "./forms/BookingForm/BookingForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const fetchCurrentUser = async(): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials:"include",
    });
    if(!response.ok) {
        throw new Error("Error fetching user");
    }
    return response.json();
}

export const register = async (formData: RegisterFormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method:'POST',
        credentials:'include',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    });

    const responseBody = await response.json();

    if(!response.ok){
        throw new Error(responseBody.message)
    }
};

export const signIn = async (FormData:SignInFormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/auth/login`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(FormData)
    })

    const body = await response.json();
    if(!response.ok){
        throw new Error(body.message)
    }
    return body;
}

// api-client.ts

export const validateToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Token invalid or expired");
            }
            throw new Error("Failed to validate token");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message  || 'An unknown error occurred');
    }
};

// Function to fetch with token, refresh if needed
export const fetchWithToken = async (url: string, options: RequestInit) => {
    let response = await fetch(url, options);
  
    if (response.status === 401) {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newToken = data.token;
  
        // Retry the original request with the new token
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        };
        response = await fetch(url, options);
      } else {
        window.location.href = '/login';
      }
    }
  };



export const signOut = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST"
    });

    if(!response.ok){
        throw new Error("Error during sign out");
    }
};

export const addMyHotel = async (hotelFormData: FormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials:"include",
        body: hotelFormData,
    });

    if(!response.ok) {
        throw new Error("Failed to add hotel");
    }
    return response.json();

};


export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
         credentials:"include",
    });

    if(!response.ok) {
        throw new Error("Error fetching hotels");
    }
    return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> =>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials:"include",
    });
    if(!response.ok) {
        throw new Error("Error fetching Hotels");
    }
    return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(
        `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
            method: "PUT",
            body: hotelFormData,
            credentials:"include",
        }
    );
    if(!response.ok) {
        throw new Error("Failed to update hotel");
    }
    return response.json();
};

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOptions?: string;
};

export const SearchHotels = async (searchParams: SearchParams)
: Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOptions || "");

    searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
);

searchParams.facilities?.forEach((facility) =>
queryParams.append("facilities", facility)
);
    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`)

    if(!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
}

export const fetchHotelById = async(hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`)
    if(!response.ok) {
        throw new Error("Error fetching Hotels");
    }
    return response.json();
};

export const createPaymentIntent = async(hotelId: string, numberOfNights: string)
: Promise<paymentIntentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, {
        credentials:"include",
        method:"POST",
        body:JSON.stringify({numberOfNights}),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!response.ok) {
        throw new Error("Error fetching payment intent");
    }
    return response.json();
};

export const createRoomBooking = async(formData: BookingFormData) => {
    const response = await fetch(
        `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body:JSON.stringify(formData),
        }
    );
    if(!response.ok) {
        throw new Error("Error booking room");
    }
}



