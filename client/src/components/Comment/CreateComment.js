import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import { useClient } from '../../Hook/client';
import MapContext from '../../context/mapContext';
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations';

const CreateComment = ({ classes }) => {
    const client = useClient();
    const { mapInfo } = useContext(MapContext);
    const [comment, setComment] = useState('');
    const isDisabled = !comment.trim();

    const onSubmitComment = async () => {
        const variables = { pinId: mapInfo.currentPin._id, text: comment };

        await client.request(CREATE_COMMENT_MUTATION, variables);

        setComment('');
    };

    return (
        <>
            <form action="" className={classes.form}>
                <IconButton onClick={() => setComment('')} disabled={isDisabled} className={classes.clearButton}>
                    <ClearIcon />
                </IconButton>
                <InputBase
                    className={classes.input}
                    placeholder="Add comment"
                    multiline={true}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <IconButton onClick={onSubmitComment} disabled={isDisabled} className={classes.sendButton}>
                    <SendIcon />
                </IconButton>
            </form>
            <Divider />
        </>
    );
};

const styles = theme => ({
    form: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    clearButton: {
        padding: 0,
        color: 'red',
    },
    sendButton: {
        padding: 0,
        color: theme.palette.secondary.dark,
    },
});

export default withStyles(styles)(CreateComment);
