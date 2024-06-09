import React, { useContext, useState } from 'react';
import Toast from '../components/Toast';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client'

type ToastMessage = {
    message: string;
    type: "Success" | "Error";
};

type AppContextType = {
    showToast: (toastMessage: ToastMessage)=> void;
    isLoggedIn: boolean;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
    children,
}: {
children: React.ReactNode
}) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const {isError} = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    })
    const showToast = (toastMessage: ToastMessage) => {
        setToast(toastMessage);
    };
    // Determine isLoggedIn based on isError
    const isLoggedIn = !isError;

    const contextValue: AppContextType = {
        showToast,
        isLoggedIn,
    };
    return (
        <AppContext.Provider value={contextValue}>
            {toast && (<Toast message={toast.message} type={toast.type === 'Success' ? 'SUCCESS' : 'ERROR'} onClose={()=> setToast(undefined)}/>)}
            {children}</AppContext.Provider>
    )
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}