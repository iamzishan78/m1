import { Link } from 'react-router-dom';
import { memo, useState, useEffect } from "react";
import { tableController, tableGlobalController } from "hookstate/tableController";
import { IconButton, Tooltip } from "@material-ui/core";
import Convert_contact from 'components/Shared/svgIcons/convert_contact';
import Contact_card from 'components/Shared/svgIcons/contact_card';

function IsContactCell({ id: ownerId, selectedRow: singleRow }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const Controller = tableController("TaxOwnerTable");
    const { stateValues } = Controller.useState(['ownersWhoAreContact']);
    const { stateValues: tableStateValues } = Controller.useState(['rowSelection', 'data']);
    const ownerContacts = stateValues.ownersWhoAreContact;

    const contact = ownerContacts?.find(contact => contact?.globalOwner === ownerId);

    useEffect(() => {
        if (selectedRows?.length) {
            tableGlobalController.updateState({
                dialog: {
                    type: 'convertContactSlideout',
                    selectedRows: selectedRows,
                    onRemoveRows,
                }
            });
        }
    }, [selectedRows]);

    const onRemoveRows = (rowsToRemove, removeAll = false) => {
        if (removeAll) { setSelectedRows([]) }
        else {
            setSelectedRows(selectedRows.filter(row => row.id !== rowsToRemove[0].id));
        };
    }

    return <Tooltip title={contact ? "Contact Detail" : "Convert To Contact"} placement="top">
        <IconButton
            size='small'
            color="primary"
            onClick={(e) => {
                e.stopPropagation();
                if (!contact) {

                    let rows = tableStateValues?.data?.rows.filter((_, i) => {
                        return tableStateValues?.rowSelection.hasOwnProperty(i.toString());
                    });

                    const ifAlreadyPresent = rows.find(row => row.id === singleRow.id);
                    if (!ifAlreadyPresent) rows = [...rows, singleRow];

                    rows = rows.filter((row) => {
                        const notFound = !ownerContacts.find(contact => contact.globalOwner === row.id);
                        if (notFound) return true;
                        return false;
                    });

                    setSelectedRows(rows);
                }
            }}
            aria-label="show contact"
        >
            {!contact ? (
                <Convert_contact />
            ) : (
                <Link
                    to={
                        `/contact/details/${contact?.isContact}/?tenant=${window.sessionStorage.getItem("tenantName")}`
                    }
                >
                    <Contact_card />
                </Link>
            )}
        </IconButton>
    </Tooltip>
}

export default memo(IsContactCell);

