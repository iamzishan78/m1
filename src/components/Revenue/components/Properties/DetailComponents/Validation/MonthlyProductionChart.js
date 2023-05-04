import React, { useContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import get from "lodash/get";
import orderBy from 'lodash/orderBy'

import WellProdChart from "components/WellProdChart/WellProdChart";
import { WellCardContext } from "components/WellCard/WellCardContext";
import { WellProdChartContext } from "components/WellProdChart/WellProdChartContext";
import { GET_ASSOCIATED_WELL_PRODUCTION_DATA } from "graphQL/useQueryAssociatedWellProductionData";

const ValidationChart = ({ filter, setStartDate, propertyId, setAssociatedWellIds, wellProductionData, setWellProductionData }) => {
    const [, setStateWellCard] = useContext(WellCardContext);
    const [, setStateWellProdChart] = useContext(WellProdChartContext);
    const [getAssociatedWellProductionData, { data: associatedWells }] = useLazyQuery(GET_ASSOCIATED_WELL_PRODUCTION_DATA);
  
    useEffect(() => {
      setStateWellCard((state) => {
        return {
          ...state,
          wellProdHistory: JSON.parse(JSON.stringify(wellProductionData)),
        };
      });
      setStateWellProdChart((state) => ({
        ...state,
        wellProdHistory: JSON.parse(JSON.stringify(wellProductionData)),
      }));
    }, [wellProductionData]);
  
    useEffect(() => {
      if (associatedWells?.getAssociatedWellProductionData?.length > 0) {
        const wellData = JSON.parse(JSON.stringify(associatedWells.getAssociatedWellProductionData));
        const productionData = [];
        const wellIds = [];
        wellData.forEach((data) => {
          wellIds.push(data.well._id);
          if (data.well.productionData.length > 0) {
            let pData = JSON.parse(JSON.stringify(data.well.productionData));
            if (filter[0].value.range.date.lte) {
              pData = pData.filter((d) => moment(moment(d.data.ReportDate).format('MM/DD/yyyy')) <= moment(moment(filter[0].value.range.date.lte).format('MM/DD/yyyy')));
            }
            if (filter[0].value.range.date.gte) {
              pData = pData.filter((d) => moment(moment(d.data.ReportDate).format('MM/DD/yyyy')) >= moment(moment(filter[0].value.range.date.gte).format('MM/DD/yyyy')));
            }
  
            pData.forEach((production) => {
              production = JSON.parse(JSON.stringify(production.data));
              const date = moment(production.ReportDate).format("MM/yyyy");
              production.ReportDate = date;
              const index = productionData.findIndex((d) => d.ReportDate === date);
  
              if (index > -1) {
                productionData[index].allocatedGas = get(productionData[index], "allocatedGas", 0) + get(production, "allocatedGas", 0);
                productionData[index].allocatedOil = get(productionData[index], "allocatedOil", 0) + get(production, "allocatedOil", 0);
                productionData[index].allocatedWater = get(productionData[index], "allocatedWater", 0) + get(production, "allocatedWater", 0);
                productionData[index].gas = get(productionData[index], "gas", 0) + get(production, "gas", 0);
                productionData[index].oil = get(productionData[index], "oil", 0) + get(production, "oil", 0);
                productionData[index].water = get(productionData[index], "water", 0) + get(production, "water", 0);
              } else {
                production.allocatedGas = production.allocatedGas ? production.allocatedGas : 0;
                production.allocatedOil = production.allocatedOil ? production.allocatedOil : 0;
                production.allocatedWater = production.allocatedWater ? production.allocatedWater : 0;
                production.gas = production.gas ? production.gas : 0;
                production.oil = production.oil ? production.oil : 0;
                production.water = production.water ? production.water : 0;
                productionData.push(production);
              }
            });
          }
        });
  
        let data = productionData.map(p => {
          const d = p.ReportDate.split('/')
          return ({ ...p, ReportDate: new Date(d[0]+'/01/'+d[1])})
        })
        setAssociatedWellIds(wellIds);
        setWellProductionData(JSON.parse(JSON.stringify(orderBy(data, ['ReportDate'],['desc']).map(d=> ({ ...d, ReportDate: moment(d.ReportDate).format("MM/yyyy")})))));
      }
    }, [associatedWells, filter]);
  
    useEffect(() => {
      if (associatedWells?.getAssociatedWellProductionData) {
        let minDate = new Date();
        const wellData = JSON.parse(JSON.stringify(associatedWells.getAssociatedWellProductionData));
  
        wellData.forEach((data) => {
          let pData = data.well.productionData;
          const newMinDate = new Date(
            Math.min(
              ...pData.map((element) => {
                return new Date(element.data.ReportDate);
              })
            )
          );
          if (newMinDate < minDate) {
            minDate = newMinDate;
          }
        });
        setStartDate(minDate);
      }
    }, [associatedWells]);
  
  
    useEffect(() => {
      getAssociatedWellProductionData({
        variables: {
          relatedObject: propertyId,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
    <WellProdChart />
    );
  };

  export default ValidationChart