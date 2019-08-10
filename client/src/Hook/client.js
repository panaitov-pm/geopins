import { useContext, useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import UserContext from '../context/userContext';

export const BASE_URL = process.env.NODE_ENV === 'production'
    ? '<insert-prod-url>'
    : 'http://localhost:4000/graphql';

export const useClient = () => {
    const { userInfo } = useContext(UserContext);
    const [idToken, setIdToken] = useState('');

    useEffect(() => {
        setIdToken(userInfo.idToken);
    }, []);

    return new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken },
    });
};
