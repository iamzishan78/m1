import React from "react";

import ReactApexChart from "react-apexcharts";

const StackedBarChart = ({ data, colors, height }) => {
  const series = [
    {
      name: "Marine Sprite",
      data: [44],
    },
    {
      name: "Striking Calf",
      data: [53],
    },
    {
      name: "Tank Picture",
      data: [12],
    },
  ];
  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: [2008],
      labels: {
        show: false
      }
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
        enabled: false,
    }
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={height}
      className="apex-charts"
    />
  );
};

export default StackedBarChart;
