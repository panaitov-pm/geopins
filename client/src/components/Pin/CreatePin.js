import React, { useContext, useState } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';

import MapContext from '../../context/mapContext';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../Hook/client';

const CreatePin = ({ classes }) => {
    const { mapInfo, dispatchMap } = useContext(MapContext);
    const client = useClient();

    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isDisabled = !title.trim() || !content.trim() || !image || submitting;

    const onDeleteDraft = () => {
        setTitle('');
        setImage('');
        setContent('');
        dispatchMap({ type: 'DELETE_DRAFT' });
    };

    const onImageUpload = async () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'webpins');
        data.append('cloud_name', 'webpavel52');

        const res = await axios.post(
            'http://api.cloudinary.com/v1_1/webpavel52/image/upload',
            data,
        );

        return res.data.url;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = await onImageUpload();
            const { latitude, longitude } = mapInfo.draft;

            setSubmitting(true);

            const variables = {
                title,
                image: url,
                content,
                latitude,
                longitude,
            };

            const { createPin } = await client.request(CREATE_PIN_MUTATION, variables);

            dispatchMap({type: 'CREATE_PIN', payload: createPin});

            onDeleteDraft();
        } catch (err) {
            setSubmitting(false);
            console.error('Error creating pin', err);
        }
    };

    return (
        <form action="">
            <Typography
                className={classes.alignCenter}
                component="h2"
                variant="h4"
                color="secondary"
            >
                <LandscapeIcon
                    className={classes.iconLarge}
                />
                Pin Location
            </Typography>
            <div>
                <TextField
                    name="title"
                    label="Title"
                    placeholder="Insert pin title"
                    onChange={e => setTitle(e.target.value)}
                />
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className={classes.input}
                    onChange={e => setImage(e.target.files[0])}
                />
                <label htmlFor="image">
                    <Button
                        style={{ color: image && 'green' }}
                        component="span"
                        size="small"
                        className={classes.button}
                    >
                        <AddAPhotoIcon />
                    </Button>
                </label>
            </div>
            <div className={classes.contentField}>
                <TextField
                    name="content"
                    label="COntent"
                    multiline
                    rows="6"
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    onChange={e => setContent(e.target.value)}
                />
            </div>
            <div>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={onDeleteDraft}
                >
                    <ClearIcon className={classes.leftIcon} />
                    Discard
                </Button>
                <Button
                    type="submit"
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    disabled={isDisabled}
                    onClick={onSubmit}
                >
                    Submit
                    <SaveIcon className={classes.rightIcon} />
                </Button>
            </div>
        </form>
    );
};

const styles = theme => ({
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingBottom: theme.spacing.unit,
    },
    contentField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '95%',
    },
    input: {
        display: 'none',
    },
    alignCenter: {
        display: 'flex',
        alignItems: 'center',
    },
    iconLarge: {
        fontSize: 40,
        marginRight: theme.spacing.unit,
    },
    leftIcon: {
        fontSize: 20,
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        fontSize: 20,
        marginLeft: theme.spacing.unit,
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit,
        marginLeft: 0,
    },
});

export default withStyles(styles)(CreatePin);
