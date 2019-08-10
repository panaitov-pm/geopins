import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import Login from '../components/Auth/Login';
import UserContext from '../context/userContext';

const Splash = () => {
    const { userInfo: { isAuth } } = useContext(UserContext);

    return isAuth ? <Redirect to="/"/> : <Login />;
};

export default Splash;
