import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import UserContext from './context/userContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { userInfo: { isAuth } } = useContext(UserContext);

    return (
        <Route
            render={props =>
                isAuth
                    ? <Component {...props} />
                    : <Redirect to="/login" />}
            {...rest}
        />
    );
};

export default ProtectedRoute;
