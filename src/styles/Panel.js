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
  }
}));

export { PanelTheme, PanelGeneralStyle }