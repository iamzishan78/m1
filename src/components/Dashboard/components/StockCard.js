import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { sortableHandle } from "react-sortable-hoc";
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Iframe from 'react-iframe';


const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
    backgroundColor:'#011133',
    color: 'white'
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#fff"/>
  </IconButton>
));


const StockCard = ({ title }) => {


  const classes = useStyles();

  useEffect(() => {
    const script = document.createElement('script');

    script.type="text/javascript";
    script.src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify(
      {
        "colorTheme": "light",
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": false,
        "width": "100%",
        "height": "700",
        "plotLineColorGrowing": "rgba(33, 150, 243, 1)",
        "plotLineColorFalling": "rgba(33, 150, 243, 1)",
        "gridLineColor": "rgba(240, 243, 250, 1)",
        "scaleFontColor": "rgba(120, 123, 134, 1)",
        "belowLineFillColorGrowing": "rgba(33, 150, 243, 0.12)",
        "belowLineFillColorFalling": "rgba(33, 150, 243, 0.12)",
        "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              {
                "s": "CURRENCYCOM:US30",
                "d": "DOW 30"
              },
              {
                "s": "CURRENCYCOM:US100",
                "d": "NASDAQ 100"
              },
              {
                "s": "CURRENCYCOM:US500",
                "d": "S&P 500"
              },
              {
                "s": "CURRENCYCOM:UK100",
                "d": "FTSE 100"
              },
              {
                "s": "CURRENCYCOM:DE30",
                "d": "DAX 30"
              },
              {
                "s": "INDEX:NKY",
                "d": "NIKKEI 225"
              }
            ],
            "originalTitle": "Indices"
          },
          {
            "title": "Commodities",
            "symbols": [
              {
                "s": "NYMEX:CL1!",
                "d": "WTI CRUDE"
              },
              {
                "s": "NYMEX:BB1!",
                "d": "BRENT CRUDE"
              },
              {
                "s": "NYMEX:NG1!",
                "d": "NATURAL GAS"
              }
            ],
            "originalTitle": "Commodities"
          },
          {
            "title": "M1 Watchlist",
            "symbols": [
              {
                "s": "NYSE:XOM",
                "d": "EXXON MOBIL"
              },
              {
                "s": "NYSE:CVX",
                "d": "CHEVRON"
              },
              {
                "s": "NYSE:COP",
                "d": "CONOCOPHILLIPS"
              },
              {
                "s": "NYSE:EOG",
                "d": "EOG RESOURCES"
              },
              {
                "s": "NYSE:OXY",
                "d": "OCCIDENTAL PETROLEUM"
              },
              {
                "s": "NYSE:PXD",
                "d": "PIONEER NATURAL RESOURCES"
              },
              {
                "s": "NYSE:PE",
                "d": "PARSLEY ENERGY"
              },
              {
                "s": "NASDAQ:FANG",
                "d": "DIAMONDBACK ENERGY"
              },
              {
                "s": "NYSE:DVN",
                "d": "DEVON ENERGY"
              },
              {
                "s": "NYSE:CLR",
                "d": "CONTINENTAL RESOURCES"
              },
              {
                "s": "NYSE:EQT",
                "d": "EQT CORPORATION"
              },
              {
                "s": "NYSE:OVV",
                "d": "OVINTIV"
              },
              {
                "s": "NYSE:MNRL",
                "d": "BRIGHAM MINERALS"
              },
              {
                "s": "NYSE:BSM",
                "d": "BLACK STONE MINERALS"
              },
              {
                "s": "NASDAQ:FLMN",
                "d": "FALCON MINERALS"
              },
              {
                "s": "NASDAQ:VNOM",
                "d": "VIPER ENERGY PARTNERS"
              },
              {
                "s": "NYSE:KRP",
                "d": "KIMBELL ROYALTY PARTNERS"
              }
            ]
          }
        ]
      }


    )


    document.getElementById("parentID").appendChild(script);
  
    return () => {
      //document.getElementById("parentID").removeChild(script);
    }
  }, []);



  return (
    <div>
    <CardHeader
      action={<DragHandle />}
      title={`Market Pulse`}
      className={classes.header}
    />


    <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget" id="parentID"></div>
    {/* <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>

    </script> */}
    </div>


    </div>



  );
};
export default StockCard;
