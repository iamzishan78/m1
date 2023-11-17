import {
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ReactSelectField from 'components/Shared/M1nTable/components/SubComponents/ReactSelectField';
import NumberField from 'components/Shared/components/Fields/NumberField';
import { get } from 'lodash';
import React, { Fragment, useState } from 'react';
import { Controller } from 'react-hook-form';

const useStyles = makeStyles(theme => ({
  text: {
    '& div': {
      paddingRight: 0,
    },
  },
}));

const CommonFieldList = ({ data, fields, control, offClickHandler = () => { } }) => {
  const classes = useStyles();

  const [isHovered, setIsHovered] = useState(false);

  if (!fields || fields.length === 0) return null;

  return fields.map((field, index) => {
    const fieldKey = (field.key || field.esKey).replaceAll('.keyword', '');

    const handleEdit = () => {
      window.setStateApp(stateApp => ({
        ...stateApp,
        selectedMeta: field,
        showFieldModal: true,
      }));
    };

    const isMetaField = field._id && field.category;

    const endAdornment =
      isMetaField && isHovered === field._id ? (
        <InputAdornment position="end">
          <IconButton
            aria-label="Edit Meta"
            style={{ padding: '6px' }}
            onClick={handleEdit}
          >
            <EditIcon />
          </IconButton>
        </InputAdornment>
      ) : undefined;

    return (
      <Grid
        item
        xs={4}
        key={index + field.label + fieldKey}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <Grid item xs={3}>
          <div style={{ wordBreak: 'break-word' }}>
            {fieldKey !== 'approvalStatus' && field.label}
          </div>
        </Grid>

        <Grid
          item
          xs={8}
          onMouseEnter={() => {
            setIsHovered(field._id);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        >
          <Fragment key={index}>
            {(field.type === 'text' ||
              field.type === 'number' ||
              field.type === 'dropdown' ||
              field.type === 'multiselect' ||
              field.type === 'select') && (
                <Controller
                  control={control}
                  name={fieldKey}
                  render={params => {
                    return (
                      <Fragment>
                        {field.type === 'text' && (
                          <TextField
                            {...params}
                            id={`field-${fieldKey}`}
                            variant="outlined"
                            margin="dense"
                            type="text"
                            fullWidth
                            defaultValue={get(data, fieldKey)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            className={classes.text}
                            InputProps={{
                              ...field.InputProps,
                              endAdornment,
                            }}
                            onBlur={event => offClickHandler(fieldKey, event.target.value)}
                          />
                        )}
                        {field.type === 'number' && (
                          <NumberField
                            id={`field-${fieldKey}`}
                            index={index}
                            field={field}
                            offClickHandler={(key, value) => {
                              offClickHandler(key, value);
                            }}
                            {...params}
                            props={{
                              className: classes.text,
                              endAdornment,
                            }}
                          />
                        )}
                        {field.type === 'dropdown' && (
                          <div
                            style={{
                              margin: '8px 0px 4px',
                            }}
                          >
                            <ReactSelectField
                              id={`field-${field.title}`}
                              isSingleSelect={true}
                              fullWidth
                              variant="outlined"
                              dropdownOptions={field.dropdownOptions}
                              column={field}
                              onCustomKeyChange={value => {
                                offClickHandler(fieldKey, value, field.isCustom);
                              }}
                              disabled={field.disabled}
                              value={get(data, `${fieldKey}`, '')}
                              minHeight=""
                            />
                          </div>
                        )}
                        {field.type === 'select' && (
                          <Select
                            {...params}
                            id={`field-${fieldKey}`}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            style={{ margin: '8px 0px 4px' }}
                            onChange={event =>
                              offClickHandler(fieldKey, event.target.value, field.isCustom)
                            }
                            disabled={field.disabled}
                            value={get(data, `${fieldKey}`, '')}
                          >
                            {field.dropdownOptions.map(option => (
                              <MenuItem value={option.value ? option.value : option}>
                                {option.label ? option.label : option}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        {field.type === 'multiselect' && (
                          <div
                            style={{
                              margin: '8px 0px 4px',
                            }}
                          >
                            <ReactSelectField
                              id={`field-${fieldKey}`}
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              dropdownOptions={field.dropdownOptions}
                              column={field}
                              value={get(data, `${fieldKey}`) ?? []}
                              onCustomKeyChange={value => {
                                offClickHandler(fieldKey, value, field.isCustom);
                              }}
                              minHeight=""
                            />
                          </div>
                        )}
                      </Fragment>
                    );
                  }}
                />
              )}
          </Fragment>
        </Grid>
      </Grid>
    );
  });
};

export default CommonFieldList;
