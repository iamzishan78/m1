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
          "dateRange": "12m",
          "showChart": true,
          "locale": "en",
          "largeChartUrl": "",
          "isTransparent": false,
          "width": "100%",
          "height": "450",
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
                  "s": "FOREXCOM:SPXUSD",
                  "d": "S&P 500"
                },
                {
                  "s": "FOREXCOM:NSXUSD",
                  "d": "Nasdaq 100"
                },
                {
                  "s": "FOREXCOM:DJI",
                  "d": "Dow 30"
                },
                {
                  "s": "INDEX:NKY",
                  "d": "Nikkei 225"
                },
                {
                  "s": "INDEX:DEU30",
                  "d": "DAX Index"
                },
                {
                  "s": "FOREXCOM:UKXGBP",
                  "d": "FTSE 100"
                }
              ],
              "originalTitle": "Indices"
            },
            {
              "title": "Commodities",
              "symbols": [
                {
                  "s": "CME_MINI:ES1!",
                  "d": "E-Mini S&P"
                },
                {
                  "s": "CME:6E1!",
                  "d": "Euro"
                },
                {
                  "s": "COMEX:GC1!",
                  "d": "Gold"
                },
                {
                  "s": "NYMEX:CL1!",
                  "d": "Crude Oil"
                },
                {
                  "s": "NYMEX:NG1!",
                  "d": "Natural Gas"
                },
                {
                  "s": "CBOT:ZC1!",
                  "d": "Corn"
                }
              ],
              "originalTitle": "Commodities"
            },
            {
              "title": "Futures",
              "symbols": []
            },
            {
              "title": "M1 Watchlist",
              "symbols": [
                {
                  "s": "BITSTAMP:BTCUSD"
                },
                {
                  "s": "FX:EURUSD"
                }
              ]
            }
          ]
        }


    )


    document.getElementById("parentID").appendChild(script);
  
    return () => {
      document.getElementById("parentID").removeChild(script);
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
