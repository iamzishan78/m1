
import { useMutation } from "@apollo/client";
import { REINVITEUSER } from "../../graphQL/useMutationReinviteUser";

const ReinviteUser = (handleClose, userId) => {
    const [reinviteUser] = useMutation(REINVITEUSER);
    // reinviteUser({variables: {userId}})
    alert(userId);
    // handleClose();
}

export default ReinviteUser;