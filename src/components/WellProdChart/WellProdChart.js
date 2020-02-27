import React, { useEffect,useContext,useState } from 'react';
import {WellProdChartContext} from './WellProdChartContext';
import {AppContext} from '../../AppContext';
import useQueryWellProdHistory from '../../graphQL/useQueryProdHistory';
//material-ui components
import { makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton'


import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import { Typography } from '@material-ui/core';

am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_dark);



const useStyles = makeStyles(theme => ({
  root: {
    //width:'800px',
   // height:'400px',
   width:'auto',
   height:'350px',
   paddingTop: '2%',
  //  paddingRight: '8%',
   position: 'center'
  
    /* display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection:'column', 
    backgroundColor: '#30303d',
    color: '#fff'*/
  },
  paper:{
    background:'lightGrey',
    width:'100%',
    height:'100%'
  },
}));


export default function WellProdChart(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateWellProdChart,setStateWellProdChart] = useContext(WellProdChartContext);
  const [chart,setChart] = useState(null)
  const [chartData,setChartData] = useState(null)
  const [dataLoading,setDataLoading] = useState(false)
  const [dataError,setDataError] = useState(false)
  const classes = useStyles();
  
//graphQL
const {data,loading,error} = useQueryWellProdHistory(stateApp.selectedWellId)
//const {data,loading,error} = useQueryWellProdHistory(stateMap.selectedWellApi)


useEffect( () => {  
  
  if(stateWellProdChart.wellProdHistory) {

    //console.log('wellprodhistory',stateWellProdChart.wellProdHistory)
  let chart = am4core.create("chartDiv", am4charts.XYChart);

  chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
  
    chart.data = stateWellProdChart.wellProdHistory;

    
  // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //valueAxis.logarithmic = true;


    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "gas";
    series.dataFields.dateX = "reportDate";
    series.tooltipText = "Gas {Gas}"
    series.strokeWidth = 2;
    series.stroke = am4core.color("#e57373");
    series.minBulletDistance = 15;

    var seriesOil = chart.series.push(new am4charts.LineSeries());
    seriesOil.dataFields.valueY = "oil";
    seriesOil.dataFields.dateX = "reportDate";
    seriesOil.tooltipText = "Oil {Oil}"
    seriesOil.strokeWidth = 2;
    seriesOil.stroke = am4core.color("#81c784");
    seriesOil.minBulletDistance = 15;

    var seriesWater = chart.series.push(new am4charts.LineSeries());
    seriesWater.dataFields.valueY = "water";
    seriesWater.dataFields.dateX = "reportDate";
    seriesWater.tooltipText = "Water {Water}"
    seriesWater.strokeWidth = 2;
    seriesWater.stroke = am4core.color("#64b5f6");
    seriesWater.minBulletDistance = 15;
  
    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
   //  series.tooltip.background.fill = am4core.color("#e57373");
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    seriesOil.tooltip.background.cornerRadius = 20;
    seriesOil.tooltip.background.strokeOpacity = 0;
    //seriesOil.tooltip.label.fill = am4core.color("#81c784");
    seriesOil.tooltip.pointerOrientation = "vertical";
    seriesOil.tooltip.label.minWidth = 40;
    seriesOil.tooltip.label.minHeight = 40;
    seriesOil.tooltip.label.textAlign = "middle";
    seriesOil.tooltip.label.textValign = "middle";

    seriesWater.tooltip.background.cornerRadius = 20;
    seriesWater.tooltip.background.strokeOpacity = 0;
    //seriesWater.tooltip.label.fill = am4core.color("#64b5f6");
    seriesWater.tooltip.pointerOrientation = "vertical";
    seriesWater.tooltip.label.minWidth = 40;
    seriesWater.tooltip.label.minHeight = 40;
    seriesWater.tooltip.label.textAlign = "middle";
    seriesWater.tooltip.label.textValign = "middle";


    
    // Make bullets grow on hover
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 1;
    bullet.circle.radius = 3;
    bullet.circle.fill = am4core.color("#e57373");

    var bulletOil = seriesOil.bullets.push(new am4charts.CircleBullet());
    bulletOil.circle.strokeWidth = 1;
    bulletOil.circle.radius = 3;
    bulletOil.circle.fill = am4core.color("#81c784");

    var bulletWater = seriesWater.bullets.push(new am4charts.CircleBullet());
    bulletWater.circle.strokeWidth = 1;
    bulletWater.circle.radius = 3;
    bulletWater.circle.fill = am4core.color("#64b5f6");
    
    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    var bullethoverOil = bulletOil.states.create("hover");
    bullethoverOil.properties.scale = 1.3;

    var bullethoverWater = bulletWater.states.create("hover");
    bullethoverWater.properties.scale = 1.3;
    
    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
    
    // Create vertical scrollbar and place it before the value axis
    //chart.scrollbarY = new am4core.Scrollbar();
    //chart.scrollbarY.parent = chart.leftAxesContainer;
    //chart.scrollbarY.toBack();
    
    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.series.push(seriesOil);
    chart.scrollbarX.series.push(seriesWater);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    
    //dateAxis.start = 0.79;
    dateAxis.start = 0;
    dateAxis.keepSelection = true;

    setChart(chart);
  }
  else {
   
    if(data) {
     
        let wellProdHistory = data.wellProdHistory;
        setStateWellProdChart(state => ({...state,wellProdHistory:wellProdHistory}))
    }
    
  }
  return () => {
    console.log('will unmount');
    if(chart){
      //chart.dispose();
      am4core.disposeAllCharts();
    }
   
  }
},[stateWellProdChart.wellProdHistory,data])



  return (
    

    data && stateWellProdChart.wellProdHistory ? (
      <div id="chartDiv" className={classes.root} ></div>)
      : loading ? (<CircularProgress size={80} disableShrink color="secondary" />)
      :(<Skeleton variant="rect" height={300}><Typography variant="button">Not Available</Typography></Skeleton>)
    
   
 
  );
      
}