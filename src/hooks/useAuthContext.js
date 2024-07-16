import { AuthContext } from '../context/AuthContext.js';
import { useContext } from 'react';

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    console.log('tried getting context');

    if(!context){
        throw Error('useAuthContext shold be used within useAuthContextProvider');
    }
    return context;
}