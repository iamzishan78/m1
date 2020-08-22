import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
const PanelTheme = createMuiTheme({
    overrides: {
      MuiAccordionSummary: {
        root: {
            "&$expanded": {
                borderBottom: 'solid',
                borderBottomWidth: '2px',
                borderBottomColor: '#8c8c8c',    
            }
        }
      },
      MuiAccordion: {
        root: {
            border: 'solid',
            borderWidth: '2px',
            borderColor: '#8c8c8c',
            boxShadow: '0px 0px 0px 0px'
        }
      },
      MuiFormLabel: {
        root: {
          fontWeight: 'bold',
          fontColor: '#8c8c8c',
          paddingTop: 5,
          paddingBottom: 5
        }
      },
      MuiFormControlLabel: {
        label: {
          color: '#8c8c8c',
        },
      }
    }
});

const PanelGeneralStyle = makeStyles((theme) => ({
  root: {
    padding: '25px'
  },
  button: {
      width: '100%',
      backgroundColor: '#92d8f0',
      color: '#fff'
  },
  heading: {
      color: '#727272',
      fontWeight: 'bold'
  },
  formControl: {
    width: '100%'
  },
  autocompleteOption: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  }
}));

export { PanelTheme, PanelGeneralStyle }