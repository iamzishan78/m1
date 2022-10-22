const CommentUploader = [
    {
        label: "Contact Id",
        mapped_key: "",
        required: false,
        actual_key: "_id",
    },
    {
        label: "Full Name",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.name",
    },
    {
        label: "First Name",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.firstName",
    },
    {
        label: "Last Name",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.lastName",
    },
    {
        label: "Middle Name",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.middleName",
    },
    {
        label: "Primary Address 1",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.address1",
    },
    {
        label: "Primary Address 2",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.address2",
    },
    {
        label: "City",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.city",
    },
    {
        label: "AddressState",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.state",
    },
    {
        label: "Zip",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.zip",
    },
    {
        label: "Country",
        mapped_key: "",
        required: false,
        actual_key: "entityDetail.country",
    },
    {
        label: "Comment Type",
        mapped_key: "",
        required: true,
        actual_key: "contact.commentType",
    },
    {
        label: "Comment Date",
        mapped_key: "",
        required: true,
        actual_key: "contact.commentDate",
    },
    {
        label: "Comment Text",
        mapped_key: "",
        required: true,
        actual_key: "contact.comment",
    },

];
export default CommentUploader;