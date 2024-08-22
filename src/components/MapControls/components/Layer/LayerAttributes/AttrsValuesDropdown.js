import React from 'react';
import { TextField } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    dropdownContainer: {
        width: '485px',
        fontFamily: 'Arial, sans-serif',
    },
    dropdown: {
        border: '1px solid #ccc',
        padding: '12px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    arrowIcon: {
        display: 'inline-block',
        width: '0',
        height: '0',
        marginLeft: '5px',
        verticalAlign: 'middle',
        borderLeft: '5.5px solid transparent',
        borderRight: '5.5px solid transparent',
        borderTop: '5.5px solid black',
        transition: 'transform 0.2s ease',
    },
    dropdownList: {
        listStyleType: 'none',
        margin: '8px 0 0 0',
        padding: '0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: '#fff',
    },
    listItem: {
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
    },
    colorBox: {
        width: '60px',
        height: '30px',
        border: '1px solid #ccc',
    },
    textFieldInput: {
        height: '50px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    startAdornmentBox: {
        width: '100px',
        height: '30px',
        border: '1px solid #ccc',
        marginRight: '8px',
    },
}));

const AttrsValuesDropdown = ({
    selectedValue,
    attroptions,
    setSelectedOption,
    setFillColor,
    fillColor,
}) => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    return (
        <>
            {selectedValue ? (
                <div className={classes.dropdownContainer}>
                    <div
                        id="color-dropdown"
                        className={classes.dropdown}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>{selectedValue ? selectedValue['label'] : ''}</span>
                        <span
                            className={classes.arrowIcon}
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        ></span>
                    </div>
                    {isOpen && (
                        <ul className={classes.dropdownList}>
                            {attroptions.map((option, index) => (
                                <li
                                    key={index}
                                    className={classes.listItem}
                                    onClick={() => {
                                        setSelectedOption(option);
                                        setFillColor(option['color']);
                                        setDisplayColorPicker(!displayColorPicker);
                                    }}
                                    style={{
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <span>{option['label']}</span>
                                    <span
                                        className={classes.colorBox}
                                        style={{ backgroundColor: option['color'] }}
                                    ></span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <TextField
                    variant="outlined"
                    fullWidth
                    onClick={() => setDisplayColorPicker(!displayColorPicker)}
                    InputProps={{
                        className: classes.textFieldInput,
                        startAdornment: (
                            <div
                                className={classes.startAdornmentBox}
                                style={{ backgroundColor: fillColor }}
                            />
                        ),
                    }}
                />
            )}
            {displayColorPicker && <Paper id='fill-picker-box'>
                <ColorPickerStyledBox value={fillColor} onChange={(color) => setFillColor(color)} />
            </Paper>}
        </>
    )
};

export default AttrsValuesDropdown;
