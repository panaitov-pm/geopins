import {createContext} from 'react';

const UserContext = createContext({
    currentUser: null,
    isAuth: false,
    idToken: '',
});


export default UserContext;
