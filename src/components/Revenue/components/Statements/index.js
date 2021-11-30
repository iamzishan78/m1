import React, { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import RevenueStatementTable from "components/Table/Revenue/RevenueStatementTable";

import { useLazyQuery } from "@apollo/client";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";


export default function RevenueStatements() {

  const [rows, setRows] = useState([]);
  const [approvedCount, setApprovedCount] = useState([]);
  const [unapprovedCount, setUnapprovedCount] = useState([]);
  const [loading, setLoading] = useState(true);

  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, { fetchPolicy: "no-cache" });
  const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    // get checks list from checkdetails_flat table
    getESPaginatedList({
      variables: {
        esIndex: "checkdetails_flat",
        pagination: {
          first: 50,
          keep_alive: "1micros"
        },
      }
    });

    // Filter approved checks list from checkdetails_flat table
    getFilters({
      variables: {
        esIndex: "checkdetails_flat",
        filterKey: "check.status.keyword",
        search: "APPROVED",
        size: 50,
      },
    });

  }, []);

  useEffect(() => {
    if (elasticData?.getESPaginatedList?.hits?.length > 0) {
      let hits = elasticData?.getESPaginatedList?.hits;
      setRows(hits);
    } else if (elasticData?.getESPaginatedList?.hits?.length === 0) {
      setRows([]);
    }
  }, [elasticData]);


  useEffect(() => {
    if (filtersData?.getESFilterList?.hits?.length > 0) {
      const approved = filtersData?.getESFilterList?.hits[0]?.doc_count;
      setApprovedCount(approved);
    } else {
      setApprovedCount(0);
    }
  }, [filtersData]);

  useEffect(() => {
    if (elasticData?.getESPaginatedList?.hits?.length > 0 && filtersData?.getESFilterList?.hits?.length > 0) {
      const checks = elasticData?.getESPaginatedList?.total;
      const approved = filtersData?.getESFilterList?.hits[0]?.doc_count;
      setUnapprovedCount(Number(checks) - Number(approved));
      setLoading(false);
    } else {
      setUnapprovedCount(0);
    }
  }, [filtersData, elasticData]);



  return (rows.length > 0 ? (
    <div style={{ padding: "75px" }}>
      <AnalyticsCards checks={rows.length} approvedCount={approvedCount} unapprovedCount={unapprovedCount} />
      <div style={{ marginTop: 40 }}>
        <RevenueStatementTable datasource={rows} />
      </div>
    </div>) : (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            translate: "transform(-50%, -50%)",
          }}
        >
          <CircularProgress size={56} disableShrink color="secondary" />
        </div>
      )}
    </>
  )
  );
}