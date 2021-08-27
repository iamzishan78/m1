import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from '@apollo/client';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
    iconContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    tex1: {
        colorPrimary: 'white'
    }
}))

export default function ContactAutoComplete({ value, onChange, onKeyDown, onBlur }) {
    let classes = useStyles();
    const [users, setUsers] = useState([]);

    const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        getAllMongoUsers();
    }, []);

    useEffect(() => {
        if (userLists && userLists.allMongoUsers) {
            console.log(userLists.allMongoUsers)
            setUsers(
                userLists.allMongoUsers.map((user) => ({
                    value: user._id,
                    text: user.displayName || user.name
                }))
            );
        }
    }, [userLists]);

    return (
        <Autocomplete
            options={users}
            onChange={onChange ? onChange : () => { }}
            onKeyDown={onKeyDown ? onKeyDown : () => { }}
            onBlur={onBlur ? onBlur : () => { }}
            value={users.find((user) => user?.value === value) || null}
            getOptionLabel={(option) => option.text}
            getOptionSelected={(option) => option.value === value}
            renderInput={(params) => (
                <TextField size="small" placeholder='Select Contact Owner' {...params} className={classes.maxWidth} multiline value={value} />
            )}
        />
    );
};