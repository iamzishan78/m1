import { useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GETUSERS } from "../../graphQL/useQueryGetUsers";
import { UserManagementContext } from "./UserManagementContext";

export default function InitializeUserManagement(){
    const [stateUsers, setStateUsers] = useContext(UserManagementContext);
    const { data } = useQuery(GETUSERS);

    useEffect(()=> {
        if (data?.allUsers) {
            setStateUsers({
                users: data?.allUsers,
                isImageModalOpen: false,
                isSaving:false,
            });
        }
    }, [data]);

    return null;
};  