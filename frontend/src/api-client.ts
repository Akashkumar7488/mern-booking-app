import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

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
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Token invalid or expired");
            }
            throw new Error("Failed to validate token");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message);
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

// for request OTP
export const requestOtp = async ({ email, phoneNumber }: { email: string; phoneNumber: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, phoneNumber })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const responseBody = await response.json();
            if (!response.ok) {
                throw new Error(responseBody.message);
            }
            return responseBody;
        } else {
            throw new Error("Server returned non-JSON response");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};


// verifyOtpAndResetPassword
export const verifyOtpAndResetPassword = async ({ otp, newPassword }: { otp: string; newPassword: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp-reset-password`, {
         method: 'POST',
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ otp, newPassword })
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
    return responseBody;
};

