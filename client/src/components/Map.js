import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
import PinIcon from './PinIcon';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 13,
};

const Map = ({ classes }) => {
    const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
    const [userPosition, setUserPosition] = useState(null);

    const getUserPosition = () => {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;

                setViewport({ ...viewport, latitude, longitude });
                setUserPosition({ latitude, longitude });
            });
        }
    };

    const onMapClick = event => {
        console.log('---event', event);
    };

    useEffect(() => {
        getUserPosition();
    }, []);

    return (
        <div className={classes.root}>
            <ReactMapGL
                mapboxApiAccessToken="pk.eyJ1Ijoid2VicGF2ZWwiLCJhIjoiY2p5emRtOTN0MDBtYzNtbXlyd2N3d3JmOCJ9.ZLgKQM37w3VSDA0ZwBrYdA"
                width="100vw"
                height="calc(100vh - 64px)"
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onViewportChange={newViewport => setViewport(newViewport)}
                onClick={onMapClick}
                {...viewport}
            >

                {
                    userPosition && (
                        <Marker
                            latitude={userPosition.latitude}
                            longitude={userPosition.longitude}
                            offsetLeft={-19}
                            offsetTop={-37}
                        >
                            <PinIcon size={40} color="#669"/>
                        </Marker>
                    )
                }
            </ReactMapGL>
        </div>
    );
};

const styles = {
    root: {
        display: 'flex',
    },
    rootMobile: {
        display: 'flex',
        flexDirection: 'column-reverse',
    },
    navigationControl: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '1em',
    },
    deleteIcon: {
        color: 'red',
    },
    popupImage: {
        padding: '0.4em',
        height: 200,
        width: 200,
        objectFit: 'cover',
    },
    popupTab: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
};

export default withStyles(styles)(Map);
