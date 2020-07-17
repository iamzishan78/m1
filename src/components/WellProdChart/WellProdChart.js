import React, { useEffect,useContext,useState } from 'react';
import {WellProdChartContext} from './WellProdChartContext';
import {WellCardContext} from '../WellCard/WellCardContext';

import {AppContext} from '../../AppContext';
import useQueryWellProdHistory from '../../graphQL/useQueryProdHistory';
//material-ui components
import { makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton'


import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";import * as am4plugins_annotation from "@amcharts/amcharts4/plugins/annotation"; 

import { Typography } from '@material-ui/core';

am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_dark);



const useStyles = makeStyles(theme => ({
  root: {
    //width:'800px',
   // height:'400px',
   width:'auto',
   height:'600px',
   paddingTop: '2%',
  //  paddingRight: '8%',
   position: 'relative'
  
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
  const [stateWellCard ,setStateWellCard] = useContext(WellCardContext);



//graphQL
const {data,loading,error} = useQueryWellProdHistory(stateApp.selectedWell.id)
//const {data,loading,error} = useQueryWellProdHistory(stateApp.selectedWellApi)


useEffect( () => {  
  
  if(stateWellProdChart.wellProdHistory) {

    //console.log('wellprodhistory',stateWellProdChart.wellProdHistory)
  let chart = am4core.create("chartDiv", am4charts.XYChart);

  chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
  chart.data = stateWellProdChart.wellProdHistory;

    
  // Create common x-asix
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  // if(!stateWellCard.chartToggleMultiAxis){
  //   var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //   //valueAxis.logarithmic = true;
  // }


  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());


  // Add legend
  chart.legend = new am4charts.Legend();

  // Add cursor
  chart.cursor = new am4charts.XYCursor();





    
    // Create gas series 
    if(stateWellCard.chartToggleGas){

    if(stateWellCard.chartToggleMultiAxis){
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    if(chart.yAxes.indexOf(valueAxis) != 0){
      valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
    }
    }

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "gas";
    series.dataFields.dateX = "reportDate";
    series.strokeWidth = 2;
    series.connect = true;
    series.tensionX = 0.8;
    series.fillOpacity = 0;
    series.stroke = am4core.color("#e57373");
    series.minBulletDistance = 15;
    series.showOnInit = true;
    series.name = 'Gas';
    series.tooltipText = "Gas: [bold]{valueY}[/]";
    
    if(stateWellCard.chartToggleMultiAxis){
    series.yAxis = valueAxis;
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 1;
    valueAxis.renderer.line.stroke = series.stroke;
    valueAxis.renderer.labels.template.fill = series.stroke;
    valueAxis.renderer.opposite = true;
    }

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.stroke = new am4core.InterfaceColorSet().getFor("background");
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#e57373");

    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color("#e57373");


  }


  if(stateWellCard.chartToggleOil){

    if(stateWellCard.chartToggleMultiAxis){
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    if(chart.yAxes.indexOf(valueAxis) != 0){
      valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
    }
    }

    var seriesOil = chart.series.push(new am4charts.LineSeries());
    seriesOil.dataFields.valueY = "oil";
    seriesOil.dataFields.dateX = "reportDate";
    seriesOil.strokeWidth = 2;
    seriesOil.connect = true;
    seriesOil.tensionX = 0.8;
    seriesOil.fillOpacity = 0;
    seriesOil.stroke = am4core.color("#81c784");
    seriesOil.minBulletDistance = 15;
    seriesOil.showOnInit = true;
    seriesOil.name = 'Oil';
    seriesOil.tooltipText = "Oil: [bold]{valueY}[/]";

    if(stateWellCard.chartToggleMultiAxis){
    seriesOil.yAxis = valueAxis;
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 1;
    valueAxis.renderer.line.stroke = seriesOil.stroke;
    valueAxis.renderer.labels.template.fill = seriesOil.stroke;
    valueAxis.renderer.opposite = true;
    }

    var bulletOil = seriesOil.bullets.push(new am4charts.CircleBullet());
    bulletOil.stroke = new am4core.InterfaceColorSet().getFor("background");
    bulletOil.circle.strokeWidth = 2;
    bulletOil.circle.radius = 4;
    bulletOil.circle.fill = am4core.color("#81c784");

    var bullethoverOil = bulletOil.states.create("hover");
    bullethoverOil.properties.scale = 1.3;

    seriesOil.tooltip.getFillFromObject = false;
    seriesOil.tooltip.background.fill = am4core.color("#81c784");
  }



  if(stateWellCard.chartToggleWater){

    if(stateWellCard.chartToggleMultiAxis){
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    if(chart.yAxes.indexOf(valueAxis) != 0){
      valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
    }
    }

    var seriesWater = chart.series.push(new am4charts.LineSeries());
    seriesWater.dataFields.valueY = "water";
    seriesWater.dataFields.dateX = "reportDate";
    seriesWater.strokeWidth = 2;
    seriesWater.connect = true;
    seriesWater.tensionX = 0.8;
    seriesWater.fillOpacity = 0;
    seriesWater.stroke = am4core.color("#64b5f6");
    seriesWater.minBulletDistance = 15;
    seriesWater.showOnInit = true;
    seriesWater.name = 'Water';
    seriesWater.tooltipText = "Water: [bold]{valueY}[/]";

    if(stateWellCard.chartToggleMultiAxis){
    seriesWater.yAxis = valueAxis;
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 1;
    valueAxis.renderer.line.stroke = seriesWater.stroke;
    valueAxis.renderer.labels.template.fill = seriesWater.stroke;
    valueAxis.renderer.opposite = true;
    }

    var bulletWater = seriesWater.bullets.push(new am4charts.CircleBullet());
    bulletWater.stroke = new am4core.InterfaceColorSet().getFor("background");
    bulletWater.circle.strokeWidth = 2;
    bulletWater.circle.radius = 4;
    bulletWater.circle.fill = am4core.color("#64b5f6");

    var bullethoverWater = bulletWater.states.create("hover");
    bullethoverWater.properties.scale = 1.3;

    seriesWater.tooltip.getFillFromObject = false;
    seriesWater.tooltip.background.fill = am4core.color("#64b5f6");

  }




    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();
    
    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    if(stateWellCard.chartToggleGas){chart.scrollbarX.series.push(series)};
    if(stateWellCard.chartToggleOil){chart.scrollbarX.series.push(seriesOil)};
    if(stateWellCard.chartToggleWater){chart.scrollbarX.series.push(seriesWater)};
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    
    dateAxis.start = 0;
    dateAxis.keepSelection = true;


    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    var annotation = chart.plugins.push(new am4plugins_annotation.Annotation());
    setChart(chart);
        // Enable export

    
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
      am4core.disposeAllCharts();
    }
   
  }
},[stateWellProdChart.wellProdHistory,
    data,
    stateWellCard.chartToggleOil,
    stateWellCard.chartToggleGas,
    stateWellCard.chartToggleWater,
    stateWellCard.chartToggleMultiAxis])



  return (
    

    data && stateWellProdChart.wellProdHistory ? (
      <div id="chartDiv" className={classes.root} ></div>)
      : loading ? (<CircularProgress size={80} disableShrink color="secondary" />)
      :(<Skeleton variant="rect" height={300}><Typography variant="button">Not Available</Typography></Skeleton>)
    
   
 
  );
      
}