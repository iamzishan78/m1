import ESAutoCompleteFilter from 'components/MRTTable/Common/ESAutoCompleteFilter';
import {
  customFilterOptions,
  dateFilterOptions,
  numberFilterOptions,
  stringFilterOptions,
} from 'components/MRTTable/utils/data';
import filterModeMenu from 'components/MRTTable/utils/filterModeMenu';
import _ from 'lodash';
import React from 'react';

export const handleVisiblityMenu = () => {
  const interval2 = setInterval(() => {
    const elements = document.querySelectorAll(
      'ul[role="menu"] .MuiFormControlLabel-label'
    );
    // || element?.className.includes('Mui-disabled')
    if (elements) {
      elements.forEach(element => {
        if (
          ['Select', 'Row Numbers'].includes(element.outerText) ||
          element.outerText === ''
        )
          while (element !== null) {
            if (element.tagName === 'LI') {
              element.style.display = 'none';
              break;
            }
            element = element.parentNode;
          }
      });
      clearInterval(interval2);
    }
  }, 0);
};

export const handleVisiblityMenuClick = () => {
  const interval = setInterval(() => {
    const element = document.querySelector('[aria-label="Show/Hide columns"]');
    if (element) {
      element.addEventListener('click', () => {
        handleVisiblityMenu();
      });
      clearInterval(interval);
    }
  }, 1000);
};

export const handleColumnMenuClick = () => {
  setInterval(() => {
    const elements = document.querySelectorAll('[aria-label="Column Actions"]');
    if (elements) {
      elements.forEach(element => {
        const clickListner = () => {
          const interval2 = setInterval(() => {
            const ulElement = document.querySelector(
              '.MuiPaper-elevation1 ul[role="menu"]'
            ); // Replace "your-ul-id" with the actual ID of your <ul> element
            if (ulElement) {
              const liElements = ulElement.getElementsByTagName('li');
              for (let i = 0; i < liElements.length; i++) {
                const li = liElements[i];
                const divElement = li.querySelector('div');
                if (
                  divElement &&
                  (divElement.textContent.includes('Pin to right') ||
                    divElement.textContent.includes('Show all columns'))
                ) {
                  li.style.display = 'none';
                  // break;
                }
              }
              clearInterval(interval2);
            }
          }, 0);
        };
        element.removeEventListener('click', clickListner);
        element.addEventListener('click', clickListner);
      });
    }
  }, 300);
};

export const handleMRTSchema = ({
  _Schema,
  tableKey,
  esIndex,
  defaultFlterMode,
  search,
  columnVirtualization,
}) => {
  _Schema = _.uniqBy(_Schema, item => item.accessorKey || item.id);

  const _TableSchema = _Schema.map(schemaColumn => {
    if (schemaColumn.filter && !schemaColumn.Filter) {
      schemaColumn.SingleSelect = function Comp({ column }) {
        return (
          <div>
            <ESAutoCompleteFilter
              tableKey={tableKey}
              esIndex={esIndex}
              column={{
                field: column.columnDef.name,
                isComposite: column.columnDef.isComposite,
                label: column.columnDef.header,
                type: column.columnDef.type,
                defaultFilterOptions: column.columnDef.defaultFilterOptions,
                setFilterValue: column.setFilterValue,
                filterSelectOptions: column.columnDef.filterSelectOptions,
                filterValue: column?.getFilterValue() || '',
              }}
              multiple={false}
            />
            <span
              style={{ fontSize: '0.7rem', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 400 }}
            >
              Filter Mode: Single Select
            </span>
          </div>
        );
      };

      schemaColumn.MultiSelect = function Comp({ column }) {
        const getValue = () => {
          const selectedValues = column?.getFilterValue() || [];
          const selectedLabels = column.columnDef.filterSelectOptions
            .filter(option => selectedValues.includes(option.value))
            .map(option => option.label);
          return selectedLabels
        }
        return (
          <div>
            <ESAutoCompleteFilter
              tableKey={tableKey}
              esIndex={esIndex}
              column={{
                field: column.columnDef.name,
                label: column.columnDef.header,
                type: column.columnDef.type,
                defaultFilterOptions: column.columnDef.defaultFilterOptions,
                setFilterValue: column.setFilterValue,
                filterSelectOptions: column.columnDef.filterSelectOptions,
                filterValue: (column.columnDef.filterSelectOptions ? getValue() : column?.getFilterValue() || []),
              }}
              multiple
            />
            <span
              style={{ fontSize: '0.7rem', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 400 }}
            >
              {' '}
              Filter Mode: Multi Select
            </span>
          </div>
        );
      };

      schemaColumn.Filter =
        defaultFlterMode === 'multiselect'
          ? schemaColumn.MultiSelect
          : schemaColumn.SingleSelect;
    }
    if (schemaColumn.filter) {
      let options;
      switch (schemaColumn.type) {
        case 'string':
          options = stringFilterOptions;
          break;

        case 'number':
          options = numberFilterOptions;
          break;

        case 'date':
          options = dateFilterOptions;
          break;

        default:
          options = customFilterOptions;
          break;
      }

      if (schemaColumn.isComposite)
        options = options.filter(option => option !== 'multiselect');

      schemaColumn.columnFilterModeOptions = options;
      schemaColumn.renderColumnFilterModeMenuItems = filterModeMenu({
        options,
        tableKey,
        name: schemaColumn.accessorKey || schemaColumn.id,
      });
    }

    return schemaColumn;
  });

  const searchFields = search
    ? search?.fields
    : _TableSchema
      .filter(column => column.isSearchField !== false)
      .map(column => column.name || column.id || column.accessorKey);

  const ExternalFilter = _TableSchema
    .filter(column => column.isExternalFilter === true)
    .map(column => column.name);

  const pinnedColumns = _TableSchema.filter(column => column.isPinned);
  const pinnedFields = pinnedColumns.map(column => {
    column.enableResizing = false;
    column.enableColumnDragging = false;
    column.enableColumnOrdering = false;
    return column.id || column.accessorKey;
  });

  const columnOrder = _TableSchema.map(column => {
    let col = column.accessorKey || column.id;
    if (Array.isArray(col)) col = col[0];
    return col;
  });

  const tableCss = {
    '& .MuiDialog-root': {
      zIndex: '99999',
    },
    '& .MuiToolbar-root': {
      backgroundColor: '#F2F2F2',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
    '& th.MuiToolbar-root, .MuiTableRow-head, th.MuiTableCell-head': {
      backgroundColor: '#F2F2F2',
    },
    '& .Mui-TableHeadCell-Content-Labels': {
      width: '100%',
    },
    '& .Mui-selected': {
      '&:hover': {
        '& td': {
          backgroundColor: '##cdd4de !important',
        },
      },
      '& td': {
        backgroundColor: '#e6ecf5 !important',
      },
    },
     // Add hover effect for cells
    '& td:hover': {
      border: '3px solid rgb(23, 170, 221)' // Add blue border on hover
    },
  };
  handleVisiblityMenuClick();
  handleColumnMenuClick();

  if (pinnedColumns.length > 0 && columnVirtualization) {
    let size = 60;
    pinnedColumns.forEach(column => {
      size += column.size;
    });
    tableCss['& .MuiTableRow-root>:nth-child(2)'] = {
      marginLeft: `-${size}px !important`,
    };
    tableCss['& .MuiTableRow-root>:nth-child(1)'] = { // set width of first hidden column
      width: `${size}px !important`,
    };
  }
  const groupedField =
    _TableSchema.find(column => column.isGrouped)?.accessorKey ||
    _TableSchema.find(column => column.isGrouped)?.id;

  const columnVisibility = _TableSchema.reduce(
    (acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }),
    {}
  );
  const filterModes = _TableSchema
    .filter(column => column.filter)
    .reduce((acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: 'custom' }), {});

  return {
    _TableSchema,
    tableCss,
    searchFields,
    groupedField,
    ExternalFilter,
    columnVisibility,
    filterModes,
    columnOrder,
    pinnedFields,
  };
};

export const getLayerKey = (identifier, array) => {
  // Find the key in LayerMeta that matches the prefix of the identifier
  const key = Object.keys(array).find(metaKey => identifier?.startsWith(metaKey));

  // Return the corresponding value or undefined if no match is found
  return key ? key : undefined;
}