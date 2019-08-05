import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './pages/App';
import Splash from './pages/Splash';
import Context from './context';
import reducer from './reducer';
import ProtectedRoute from './ProtectedRoute';

import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorker from './serviceWorker';

const Root = () => {

    const initialState = useContext(Context);
    const [userInfo, dispatch] = useReducer(reducer, initialState);

    console.log('---state', {userInfo});

    return (
        <Router>
            <Context.Provider value={{userInfo, dispatch}}>
                <Switch>
                    <ProtectedRoute exact path="/" component={App} />
                    <Route path="/login" component={Splash} />
                </Switch>
            </Context.Provider>
        </Router>
    );
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
