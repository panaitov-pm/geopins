import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Subscription } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import differentInMinutes from 'date-fns/difference_in_minutes';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import MapContext from '../context/mapContext';
import Blog from './Blog';
import PinIcon from './PinIcon';
import { GET_PINS_QUERY } from '../graphql/queries';
import { useClient } from '../Hook/client';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import UserContext from '../context/userContext';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import { PIN_ADDED_SUBSCRIPTION, PIN_DELETED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION } from '../graphql/subscriptions';

const INITIAL_VIEWPORT = {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 17,
};

const Map = ({ classes }) => {
    const { mapInfo, dispatchMap } = useContext(MapContext);
    const { userInfo } = useContext(UserContext);
    const client = useClient();
    const mobileSize = useMediaQuery('(max-width: 650px)');

    const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
    const [userPosition, setUserPosition] = useState(null);
    const [popup, setPopup] = useState(null);

    // remove popup if pin itself is deleted by the author of the pin
    useEffect(() => {
        const pinExists = popup && mapInfo.pins.findIndex(pin => pin._id === popup._id) > -1;

        if(!pinExists) {
            setPopup(null);
        }
    }, [mapInfo.pins.length]);

    const getUserPosition = () => {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;

                setViewport({ ...viewport, latitude, longitude });
                setUserPosition({ latitude, longitude });
            });
        }
    };

    const onMapClick = ({ lngLat, leftButton }) => {

        if(!leftButton) return;

        if(!mapInfo.draft) {
            dispatchMap({ type: 'CREATE_DRAFT' });
        }

        const [longitude, latitude] = lngLat;
        dispatchMap({ type: 'UPDATE_DRAFT_LOCATION', payload: { latitude, longitude } });
    };

    const getPins = async () => {
        const { getPins } = await client.request(GET_PINS_QUERY);

        dispatchMap({ type: 'GET_PINS', payload: getPins });
    };

    const highlightNewPin = (pin) => {
        const isNewPin = differentInMinutes(Date.now(), Number(pin.createdAt)) <= 30;

        return isNewPin ? '#39e' : '#339';
    };

    const selectPin = (pin) => {
        setPopup(pin);

        dispatchMap({ type: 'SET_PIN', payload: pin });
    };

    const isAuthUser = () => userInfo.currentUser._id === popup.author._id;

    const deletePin = async (pin) => {
        const variables = { pinId: pin._id };

        await client.request(DELETE_PIN_MUTATION, variables);

        setPopup(null);
    };

    useEffect(() => {
        getUserPosition();
    }, []);

    useEffect(() => {
        getPins().then(r => r);
    }, []);

    return (
        <div className={mobileSize ? classes.rootMobile : classes.root}>
            <ReactMapGL
                mapboxApiAccessToken="pk.eyJ1Ijoid2VicGF2ZWwiLCJhIjoiY2p5emRtOTN0MDBtYzNtbXlyd2N3d3JmOCJ9.ZLgKQM37w3VSDA0ZwBrYdA"
                width="100vw"
                height="calc(100vh - 64px)"
                mapStyle="mapbox://styles/mapbox/streets-v9"
                scrollZoom={!mobileSize}
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
                            <PinIcon size={40} color="#669" />
                        </Marker>
                    )
                }
                {
                    mapInfo.draft && (
                        <Marker
                            latitude={mapInfo.draft.latitude}
                            longitude={mapInfo.draft.longitude}
                            offsetLeft={-19}
                            offsetTop={-37}
                        >
                            <PinIcon size={40} color="#339" />
                        </Marker>
                    )
                }

                {/*    Create pins  */}
                {
                    mapInfo.pins.map(pin => (
                        <Marker
                            key={pin._id}
                            latitude={pin.latitude}
                            longitude={pin.longitude}
                            offsetLeft={-19}
                            offsetTop={-37}
                        >
                            <PinIcon
                                size={40}
                                color={highlightNewPin(pin)}
                                onClick={() => selectPin(pin)}
                            />
                        </Marker>
                    ))
                }

                {/*Popup Dialog for created Pins*/}
                {popup && (
                    <Popup
                        anchor="top"
                        latitude={popup.latitude}
                        longitude={popup.longitude}
                        closeOnClick={false}
                        onClose={() => setPopup(null)}
                    >
                        <img
                            className={classes.popupImage}
                            src={popup.image}
                            alt={popup.title}
                        />
                        <div className={classes.popupTab}>
                            <Typography>
                                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
                            </Typography>
                            {
                                isAuthUser() && (
                                    <Button onClick={() => deletePin(popup)}>
                                        <DeleteIcon className={classes.deleteIcon} />
                                    </Button>
                                )
                            }
                        </div>

                    </Popup>
                )}
            </ReactMapGL>

            {/*Subscriptions for Creating / Updated / Deleting Pins*/}
            <Subscription
                subscription={PIN_ADDED_SUBSCRIPTION}
                onSubscriptionData={({ subscriptionData }) => {
                    const { pinAdded } = subscriptionData.data;
                    console.log('---pinAdded', pinAdded);
                    dispatchMap({ type: 'CREATED_PIN', payload: pinAdded });
                }}
            />
            <Subscription
                subscription={PIN_UPDATED_SUBSCRIPTION}
                onSubscriptionData={({ subscriptionData }) => {
                    const { pinUpdated } = subscriptionData.data;
                    console.log('---pinUpdated', pinUpdated);
                    dispatchMap({ type: 'CREATED_COMMENT', payload: pinUpdated });
                }}
            />
            <Subscription
                subscription={PIN_DELETED_SUBSCRIPTION}
                onSubscriptionData={({ subscriptionData }) => {
                    const { pinDeleted } = subscriptionData.data;
                    console.log('---pinDeleted', pinDeleted);
                    dispatchMap({ type: 'DELETE_PIN', payload: pinDeleted });
                }}
            />
            <Blog />
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
