import {createContext} from 'react';

const MapContext = createContext({
    draft: null,
    pins: [],
    currentPin: null,
});

export default MapContext;
