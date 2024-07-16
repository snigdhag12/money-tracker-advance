import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [error, setError ] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        const url = process.env.REACT_APP_API_URL + 'user/login';
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });
        const json = await res.json();

        if(!res.ok){
            setIsLoading(false);
            setError(json.error);
        }else {
            // save user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            //update authcontext
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }
    return { login, isLoading, error }
}