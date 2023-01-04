import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Button from "@material-ui/core/Button";

const data = {
  series: [
    {
      name: "",
      data: [],
    },
    {
      name: "",
      data: [],
    },
  ],
  options: {
    chart: {
      type: "bar",
      height: 440,
      stacked: true,
    },
    colors: ["#177B1E", "#F4273D"],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "80%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },

    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 0,
      labels: {
        formatter: function (val) {
          return val
        },
      },
    },
    tooltip: {
      shared: false,
      x: {
        formatter: function (val) {
          return val;
        },
      },
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    xaxis: {
      categories: [],
      labels: {
        formatter: function (val) {
          return val
        },
      },
    },
  },
};

const ApexChart = ({ productionData, checkData }) => {
  const [activeTab, setActiveTab] = useState('oil')
  const [myChartData, setMyChartData] = useState(data)

  useEffect(() => {
    if(checkData.length > 0){
      const myChart = JSON.parse(JSON.stringify(myChartData))
      const labels = []
      let min = 0
      let max = 0
      const chartData = [{ name: activeTab.toUpperCase(), data:[] }, { name: activeTab.toUpperCase(), data: []}]
      const activeCheckData = checkData.filter(d => d.product === activeTab.toUpperCase())
      for(let i=0; i<activeCheckData.length; i++){
        const pData = productionData.find(p => p.ReportDate === moment(activeCheckData[i].ReportDate).format('MM/yyyy'))
        if(pData){
          let label = moment(activeCheckData[i].ReportDate).format('MMM')
          if(moment(activeCheckData[i].ReportDate).month() === 0){
            label = moment(activeCheckData[i].ReportDate).format('MMM yyyy')
          }
          if(!labels.find(l => l === label))
            labels.push(label)
          const index = labels.findIndex(l => l === label)
          let d = activeCheckData[i][activeTab] - pData[`allocated${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`]
          d = parseFloat(parseFloat(d).toFixed(2))
          if(d > 0) {
            if(max < d) max = d
            chartData[0].data[index] = d
            chartData[1].data[index] = 0
          } else {
            if(min > d) min = d
            chartData[0].data[index] = 0
            chartData[1].data[index] = d
          }
        }
      }
      myChart.series = chartData
      myChart.options.xaxis.categories = labels
      myChart.options.yaxis.min = min
      myChart.options.yaxis.max = max
      setMyChartData(myChart)
    }
  },[productionData, checkData, activeTab])

  return (
    <div id="chart" style={{ paddingTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'end'}}>
        <Button variant="contained" onClick={() => setActiveTab('oil')} style={activeTab === 'oil' ? { background: '#18A9DD' , color: 'white'}: {}}>OIL</Button>
        <Button variant="contained" onClick={() => setActiveTab('gas')} style={activeTab === 'gas' ? { background: '#18A9DD' , color: 'white'}: {}}>GAS</Button>
      </div>
      <ReactApexChart
        options={myChartData.options}
        series={myChartData.series}
        type="bar"
        height={440}
      />
    </div>
  );
};

export default ApexChart;
