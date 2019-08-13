import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery';

import MapContext from '../context/mapContext';
import NoContent from './Pin/NoContent';
import CreatePin from './Pin/CreatePin';
import PinContent from './Pin/PinContent';

const Blog = ({ classes }) => {
    const mobileSize = useMediaQuery('(max-width: 650px)');
    const { mapInfo } = useContext(MapContext);

    const { draft, currentPin } = mapInfo;

    const renderPinContent = () => {
        if(!draft && !currentPin) {
            return <NoContent />;
        }

        if(draft && !currentPin) {
            return <CreatePin />;
        }

        if(!draft && currentPin) {
            return <PinContent />;
        }
    };

    return (
        <Paper className={mobileSize ? classes.rootMobile : classes.root}>
            {
                renderPinContent()
            }
        </Paper>
    );
};

const styles = {
    root: {
        minWidth: 350,
        maxWidth: 400,
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'scroll',
        display: 'flex',
        justifyContent: 'center',
    },
    rootMobile: {
        maxWidth: '100%',
        maxHeight: 300,
        overflowX: 'hidden',
        overflowY: 'scroll',
    },
};

export default withStyles(styles)(Blog);
