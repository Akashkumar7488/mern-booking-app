import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelType} from '../../backend/src/shared/types'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
}









