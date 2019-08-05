import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Context from './context';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { userInfo: { isAuth } } = useContext(Context);

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
