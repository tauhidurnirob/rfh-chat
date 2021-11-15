import { createStore, createHook } from 'react-sweet-state';
import { getCookie } from '../CustomMethods';

const Store = createStore({
    initialState: {
        loggedIn: getCookie('loggedIn') || false
    },
    actions: {
        login: () => ({setState}) => {
            setState({
                loggedIn: true
            });
            document.cookie = "loggedIn = "+ true;
        },
        logOut: () => ({setState}) => {
            setState({
                loggedIn: false
            });
            document.cookie = "loggedIn = "+ false;
        },
    }
});

export const useAuthState = createHook(Store);