import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import UserContext from '../../context/userContext';
import { ME_QUERY } from '../../graphql/queries';
import { BASE_URL } from '../../Hook/client';

const Login = ({ classes }) => {
    const { dispatchUser } = useContext(UserContext);

    const onSuccess = async googleUser => {
        try {
            const idToken = googleUser.getAuthResponse().id_token;

            const client = new GraphQLClient(BASE_URL, {
                headers: { authorization: idToken },
            });

            const { me } = await client.request(ME_QUERY);

            dispatchUser({ type: 'LOGIN_USER', payload: me });
            dispatchUser({type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn()});
            dispatchUser({type: 'SET_ID_TOKEN', payload: idToken});
        } catch (err) {
            onFailure(err);
        }
    };

    const onFailure = (err) => console.error('Error logging in', err);

    return (
        <div className={classes.root}>
            <Typography
                component="h1"
                variant="h3"
                gutterBottom
                noWrap
                style={{ color: 'rgb(66, 133, 244)' }}
            >
                Welcome
            </Typography>
            <GoogleLogin
                isSignedIn={true}
                clientId="481416908012-smudm2lphbrnfe0ubdtg1grdej0cgauf.apps.googleusercontent.com"
                onSuccess={onSuccess}
                onFailure={onFailure}
                theme="dark"
                buttonText="Login with Google"
            />
        </div>
    );
};

const styles = {
    root: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
};

export default withStyles(styles)(Login);
