export default function userReducer(state, { type, payload }) {
    switch (type) {
        case 'LOGIN_USER':
            return {
                ...state,
                currentUser: payload,
            };
        case 'IS_LOGGED_IN':
            return {
                ...state,
                isAuth: payload,
            };
        case 'SIGNOUT_USER':
            return {
                ...state,
                isAuth: false,
                currentUser: null,
            };
        case 'SET_ID_TOKEN':
            return {
                ...state,
                idToken: payload,
            };
        default:
            return state;
    }
}
