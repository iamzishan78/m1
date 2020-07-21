import { Box, Grid, Paper } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import WbSunnyOutlinedIcon from "@material-ui/icons/WbSunnyOutlined";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import Iframe from 'react-iframe';


const useStyles = makeStyles(() => ({
  root:  {
    flexgrow: 1
  },
  weather: {
    justifyContent: "space-between",
    textAlign: "center",
  },
  dateCard: {
    alignSelf: "center",
    fontWeight: "bold",
  },
  wpaper: {
    padding: "16px",
  },
  ldate: {
    fontWeight: "bold",
  },
  wicon: {
    alignSelf: "center",
  },
  temp: {
    alignSelf: "center",
  },
  openweather: {
    color: "#d9530b",
  },
  wdescription: {
    textTransform: "capitalize",
  },
}));

const toFahr = (temp) =>
  parseInt(((parseFloat(temp) - 273.15) * 9) / 5 + 32);

const getIconUrl = (wicon) =>
  wicon && `http://openweathermap.org/img/wn/${wicon}@2x.png`;

const WeatherCard = () => {
  const [weatherkey,] = useState(process.env.REACT_APP_OPENWEATHER_KEY);
  const classes = useStyles();
  const [date, setDate] = useState("");
  const [location, setLocation] = useState({ long: -95.3698, lat: 29.7604 });
  const [currWeather, setCurrWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  useEffect(() => setDate(moment().format("dddd; MMMM Do, YYYY")), []);

  /////////// Get user location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const {
              coords: { longitude, latitude },
            } = pos;
            return setLocation({ long: longitude, lat: latitude });
          },
          (e) => {
            console.log("Error", e.message);
          }
        );
      } else {
        console.log("Location not supported");
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.long}&appid=${weatherkey}`
        );
        const data = await res.json();
        const fdata = {
          country: data.sys.country,
          name: data.name,
          icon: data.weather[0].icon,
          temp: data.main.temp,
          main: data.weather[0].main,
          description: data.weather[0].description,
        };
        return setCurrWeather(fdata);
      } catch (e) {
        console.log(e);
      }
    };
    getWeather();
  }, [location,weatherkey]);

  useEffect(() => {
    const getForecast = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.long}&exclude="current,minutely,hourly"&appid=${weatherkey}`
        );
        const data = await res.json();
        const fdata = data.daily.map((f) => ({
          temp: toFahr(f.temp.max),
          icon: f.weather[0].icon,
          name: moment.unix(f.dt).format("ddd"),
        }));
        return setForecast(fdata);
      } catch (e) {
        console.log(e);
      }
    };
    getForecast();
    console.log('forecast',forecast)
  }, [location,weatherkey]);

  return (
    <Fragment styles={{width: "100%"}}>
      <Grid item container spacing={2}>
        <Grid item xs={6} sm={8} md={8} lg={9} xl={9} className={classes.dateCard}>
          <Box>
            <Typography variant="h6" align="left">
              {date?.split(";")[0]}
            </Typography>
            <Typography variant="h4" align="left" className={classes.ldate}>
              {date?.split(";")[1]}
            </Typography>
          </Box>
        </Grid>

        {/* <Grid item sm={4}>
          <Box>
            <Iframe 
              frameborder="0" 
              width="300" 
              height="250" 
              scrolling="no" 
              marginwidth="0" 
              marginheight="0"
              url="https://app.drillinginfo.com/drc/?widget=true" 
              /> 
          </Box>
        </Grid> */}

        <Grid styles={{width: "100%"}} item xs={6} sm={4} md={4} lg={3} xl={3}>
          <Paper elevation={1} className={classes.wpaper}>
            <Grid item container direction="column">
              <Grid item container direction="row">
                <Grid item sm={2} className={classes.wicon}>
                  {(currWeather && (
                    <Avatar alt="Weather" src={getIconUrl(currWeather.icon)} />
                  )) || <WbSunnyOutlinedIcon fontSize="large" />}
                </Grid>
                <Grid item sm={8}>
                  <Typography variant="body1">{`${
                    currWeather?.name || "N/A"
                  }, ${currWeather?.country || "N/A"}`}</Typography>
                  <Typography
                    className={classes.wdescription}
                    variant="body2"
                  >{`${currWeather?.description || "N/A"}`}</Typography>
                  {/* <Typography variant="caption">
                    Powered By{" "}
                    <Typography
                      variant="caption"
                      className={classes.openweather}
                    >
                      OpenWeatherMap
                    </Typography>
                  </Typography> */}
                </Grid>
                <Grid item sm={2}>
                  <Typography variant="h4" className={classes.temp}>
                    {`${toFahr(currWeather.temp) || 0}`}&deg;
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" className={classes.weather}>
                {forecast.map((day, index) => (
                  <Typography component={"span"} key={index}>
                    <Grid item container direction="column">
                      <Typography component={"span"}>{day.name}</Typography>
                      {<Avatar alt="Weather" src={getIconUrl(day.icon)} /> || (
                        <WbSunnyOutlinedIcon fontSize="large" />
                      )}
                      <Typography component={"span"}>
                        {day.temp}&deg;
                      </Typography>
                    </Grid>
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default WeatherCard;
