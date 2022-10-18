import React, { useEffect, useState } from "react";
import { deepEqualObjects } from "components/Shared/functions";
import { Container } from "@material-ui/core";
import get from "lodash/get";

import Table from "components/Shared/M1nTable/components/Table";
import { useLazyQuery, useApolloClient } from "@apollo/client";
import { GET_WELL_DESCRIPTORS } from "graphQL/useQueryWellDescriptors";
import { PRODUCTIONDETAILQUERY } from "graphQL/useQueryProductionDetail";
import TableHeader from 'components/Table/constants/property-well-production-schema';
import { usetableStyles } from "../Styles";

function PropertyRevenueDetailsTable(props) {
    const classes = usetableStyles();
    const client = useApolloClient();
    const [rows, setRows] = useState([]);
    const [getWellsDescriptors, { data: associatedWells }] = useLazyQuery(GET_WELL_DESCRIPTORS);

    useEffect(() => {
        const wells = get(associatedWells, "getWellsDescriptors.wellDescriptors");
        fetchWellProduction(wells)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [associatedWells]);

    useEffect(() => {
        getWellsDescriptors({
          variables: {
            relatedObject: props.propertyId,
          },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const fetchWellProduction = async (wells) => {
          if(wells){
              const wellProduction = []
              for(let i = 0; i <wells.length; i++){
                const { data } = await client.query({
                    query: PRODUCTIONDETAILQUERY,
                    variables: { id:wells[i]?.descriptorObject?.apiNumber, pageSize: "1000" },
                  })
                  if(data?.externalProductionDetail?.length>0) {
                      for(let j=0; j<data?.externalProductionDetail.length; j++){
                        wellProduction.push({
                            ...data?.externalProductionDetail[j],
                            apiNumber: wells[i]?.descriptorObject?.apiNumber,
                            wellName: wells[i]?.descriptorObject?.wellName
                        })
                      }
                  }
              }
              setRows(wellProduction)
          }
      }
      return (
        <Container
            maxWidth={false}
            className={classes.container}
            id={props.id ? props.id : props.parent}
        >
            <Table
                style={{ backgroundColor: "#fff" }}
                header={props.header}
                columns={TableHeader}
                rows={rows}
                total={false}
                loading={props.loading}
                targetLabel={props.targetLabel}
                uploadIcon={null}
                dense={props.dense ? props.dense : undefined}
                orderByTracks={false}
                startPaginationAt={null}
                onTableChange={props.onTableChange}
                options={props.options}
                addAble={{ type: 'propertyWellProduction' }}
                parent={props.parent}
                setColumnsBase={[]}
            />
        </Container>
    );

}

export default React.memo(PropertyRevenueDetailsTable, deepEqualObjects);
