// Importing necessary dependencies and components
import React from "react";
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import { copy } from "components/Shared/functions";
import { formatDate } from 'components/Shared/functions';
import ExhibitaToolBar from 'components/MRTTable/TablesOverride/ExhibitaTable/ExhibitaToolbar'
// Elasticsearch index for properties
const esIndex = 'shapetracts_flat';

// Metadata for the Properties table
const ExhibitAMeta = {
    esIndex, //  Elasticsearch search index
    pageSize: 50,
    pagination: {
        pageIndex: 0,
        pageSize: 50,
    },
    defaultSort: { field: "_ts", order: "asc" },
    maxTableHeight: 'calc(100vh - 360px)',
    isNotBreadcrumbView: true, // Flag to determine whether to display a simple Typography or a Breadcrumbs component. If true, Typography is rendered; if false, Breadcrumbs is rendered.
    // CustomToolBar: AcreageToolbar,
    isDeleteDisabled: true,
    isInFiniteScroll: true,
    columnVirtualization: true,
    CustomToolBar: ExhibitaToolBar,
    gridViewSettings: {
        label: 'Exhibit A',
        Icon: "none",
        cssOverride: {
          top: '461px',
          left: '40px',
          marginLeft: '-25px',
          maxHeight: '445px'
        },
      },
    // Definition of table schema
    TableSchema: [
        // Hidden columns
        {
            ...CommonSchema.HIDDEN,
            name: 'id',
            accessorKey: 'id',
        },
        // Allow M1neral System ID to export in Grid
        {
            ...CommonSchema.MONGO_ID,
            name: '_id',
            accessorKey: '_id',
        },
        {
            ...CommonSchema.INITAIL_PINNED,
            name: 'shape.shapeJson.properties.agreementNumber.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties.agreementNumber,
            id: 'shape.shapeJson.properties.agreementNumber',
            header: 'Agreement #',
            Cell: ({ renderedCellValue, row }) => {
                row = copy(row)
                let value = row?.original?.shape?.shapeJson?.properties.agreementNumber
                value = value?.toString();
                const splitNumber = value?.split("_");
                
                return (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink   
                    value={splitNumber?.[0] 
                    ? `${splitNumber?.[0].trim()} - ${row?.original?.shape?.shapeJson?.properties?.agreementName}`
                    : row?.original?.shape?.shapeJson?.properties.agreementName} 
                    link={`/land/agreement/details/${row?.original?.shape?._id}`} />
				</div>
			)},
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.agreementName.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.agreementName,
            id: 'shape.shapeJson.properties.agreementName',
            header: 'Agreement Name',
            isHiddenFieldExport: true,
			hidden: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.layerSubType.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.layerSubType,
            id: 'shape.shapeJson.properties.layerSubType',
            header: 'Type',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.grantor.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.grantor,
            id: 'shape.shapeJson.properties.grantor',
            header: 'Lessor/Grantor',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.grantee.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.grantee,
            id: 'shape.shapeJson.properties.grantee',
            header: 'Lessee/Grantee',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.agreementDate',
            accessorKey: 'shape.shapeJson.properties.agreementDate',
            type: 'date',
            header: 'Agmt Date',
            isSearchField: false,
            Cell: ({ row }) => {
              const value = row?.original?.shape?.shapeJson?.properties?.agreementDate
              return <>{formatDate(value)}</>
            }
          },
      
          {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shapeJson.properties.effectiveDate.keyword',
            accessorKey: 'shapeJson.properties.effectiveDate',
            header: 'Efftv Date',
            isSearchField: false,
            type: 'date',
            Cell: ({ row }) => {
              return <>{formatDate(row?.original?.shapeJson?.properties?.effectiveDate)}</>
            },
          },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.agreementStatus.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.agreementStatus,
            id: 'shape.shapeJson.properties.agreementStatus',
            header: 'Agreement Status',
        },
        // Columns for last check details
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'parcel.name.keyword',
            accessorFn: row => row?.parcel?.name,
            id: 'parcel.name',
            header: 'Tract Name',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'parcel.shapeJson.properties.State.keyword',
            accessorFn: row => row?.parcel?.shapeJson?.properties?.State,
            id: 'parcel.shapeJson.properties.State',
            header: 'State',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'parcel.shapeJson.properties.County.keyword',
            accessorFn: row => row?.parcel?.shapeJson?.properties?.County,
            id: 'parcel.shapeJson.properties.County',
            header: 'County',
        },
        // Columns for additional property details
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'parcel.shapeJson.properties.originalProperties.Block.keyword',
            accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.Block,
            id: 'parcel.shapeJson.properties.originalProperties.Block',
            header: 'Block/Twsp',
            isSearchField: false,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'parcel.shapeJson.properties.originalProperties.Section.keyword',
            accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.Section,
            id: 'parcel.shapeJson.properties.originalProperties.Section',
            header: 'Sec/Range',
            isSearchField: false,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'parcel.shapeJson.properties.originalProperties.AbstractName',
            accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.AbstractName,
            id: 'parcel.shapeJson.properties.originalProperties.AbstractName',
            header: 'Abstract/Sec',
            isSearchField: false,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.legalDesctiption.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.legalDesctiption,
            id: 'shape.shapeJson.properties.legalDesctiption',
            header: 'Legal Description',
        },
      
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.internalCompany.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.internalCompany,
            id: 'internalCompany',
            header: 'Internal Company',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.prospectID.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.prospectID,
            id: 'shape.shapeJson.properties?.prospectID',
            header: 'Prospect',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.acquisitionID.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.acquisitionID,
            id: 'shape.shapeJson.properties.acquisitionID',
            header: 'Acquisition',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.recordedDate.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.recordedDate,
            header: 'Rec Date',
            id: 'shape.shapeJson.properties.recordedDate',
            isSearchField: false,
            type: 'date',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.recordedBook.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.recordedBook,
            id: 'shape.shapeJson.properties.recordedBook',
            header: 'Book',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.recordedPage.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.recordedPage,
            id: 'shape.shapeJson.properties.recordedPage',
            header: 'Page',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'shape.shapeJson.properties.recordedInstrumentNumber.keyword',
            accessorFn: row => row?.shape?.shapeJson?.properties?.recordedInstrumentNumber,
            id: 'shape.shapeJson.properties.recordedInstrumentNumber',
            header: 'Instrument #',
        },
     
    ],
};

export default ExhibitAMeta;
