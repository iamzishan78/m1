import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from '@apollo/client';
import { GETMONGOUSERS as GETUSERS } from '../../graphQL/useQueryGetUsers';
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

    const [getAllUsers, { data: userLists }] = useLazyQuery(GETUSERS, {
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (userLists && userLists.allUsers) {
            setUsers(
                userLists.allUsers.map((user) => ({
                    value: user._id,
                    text: user.name
                }))
            );
        }
    }, [userLists]);

    return (
        <Autocomplete
            options={users}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            value={users.find((user) => user?.value === value) || null}
            getOptionLabel={(option) => option.text}
            getOptionSelected={(option) => option.value === value}
            renderInput={(params) => (
                <TextField size="small" {...params} className={classes.maxWidth} multiline value={value} />
            )}
        />
    );
};