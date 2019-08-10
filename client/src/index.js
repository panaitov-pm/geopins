import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './pages/App';
import Splash from './pages/Splash';
import UserContext from './context/userContext';
import UserReducer from './reducer/userReducer';
import MapContext from './context/mapContext';
import MapRedicer from './reducer/mapReducer';
import ProtectedRoute from './ProtectedRoute';

import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorker from './serviceWorker';

const Root = () => {

    /*userContext*/
    const initialUserState = useContext(UserContext);
    const [userInfo, dispatchUser] = useReducer(UserReducer, initialUserState);

    /*mapContext*/
    const initialMapContext = useContext(MapContext);
    const [mapInfo, dispatchMap] = useReducer(MapRedicer, initialMapContext);

    return (
        <Router>
            <UserContext.Provider value={{ userInfo, dispatchUser }}>
                <MapContext.Provider value={{ mapInfo, dispatchMap }}>
                <Switch>
                    <ProtectedRoute exact path="/" component={App} />
                    <Route path="/login" component={Splash} />
                </Switch>
                </MapContext.Provider>
            </UserContext.Provider>
        </Router>
    );
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
