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
    backgroundColor:'#FFFFF',
    color: 'black'
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#808080"/>
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
        "isTransparent": true,
        "width": "100%",
        "height": "700",
        "plotLineColorGrowing": "rgba(33, 150, 243, 1)",
        "plotLineColorFalling": "rgba(33, 150, 243, 1)",
        "gridLineColor": "rgba(240, 243, 250, 1)",
        "scaleFontColor": "rgba(120, 123, 134, 1)",
        "belowLineFillColorGrowing": "rgba(33, 150, 243, 0.12)",
        "belowLineFillColorFalling": "rgba(33, 150, 243, 0.12)",
        "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
        "showFloatingTooltip":true,
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              {
                "s": "FOREXCOM:DJI",
                "d": "DOW JONES INDUSTRIAL"
              },
              {
                "s": "FOREXCOM:NSXUSD",
                "d": "NASDAQ 100"
              },
              {
                "s": "FOREXCOM:SPXUSD",
                "d": "S&P 500"
              },
              {
                "s": "FOREXCOM:UK100",
                "d": "FTSE 100"
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
              },
              {
                "s": "TVC:GOLD",
                "d": "GOLD"
              },
              {
                "s": "BITSTAMP:BTCUSD",
                "d": "BITCOIN"
              },
              {
                "s": "BITSTAMP:ETHUSD",
                "d": "ETHEREUM"
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
              //remove as PXD no longer exists
              // {
              //   "s": "NYSE:PXD",
              //   "d": "PIONEER NATURAL RESOURCES"
              // },
              {
                "s": "NASDAQ:FANG",
                "d": "DIAMONDBACK ENERGY"
              },
              {
                "s": "NYSE:DVN",
                "d": "DEVON ENERGY"
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
                "s": "NYSE:STR",
                "d": "SITIO ROYALTIES"
              },
              {
                "s": "NYSE:BSM",
                "d": "BLACK STONE MINERALS"
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
      //action={<DragHandle />}
      style={{ margin: "8px" }}
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
