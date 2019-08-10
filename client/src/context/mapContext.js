import {createContext} from 'react';

const MapContext = createContext({
    draft: null,
    pins: [],
});

export default MapContext;
