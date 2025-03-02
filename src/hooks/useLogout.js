import { useAuthContext } from './useAuthContext'

export const useLogout = () => {

    const {dispatch} = useAuthContext();
    const logout = () => {
        //remove user from local storage
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'});
    }

    return { logout }
}