
import parcelOwnerForm from 'components/Shared/FormsFieldsData/FormsJson/ParcelDetailInterestOwner/parcel_interest_owner_form_schema';

const contactSubForm = ({ getValues, setValue, tenantName, state }) => {
  const formFields = [
    {
      label: "First Name",
      name: "firstName"
    },
    {
      label: "Middle Name",
      name: "middleName"
    },
    {
      label: "Last Name",
      name: "lastName"
    },
    parcelOwnerForm({
      getValues,
      setValue,
      tenantName,
      state
    })[0],
    {
      label: "Home phone",
      name: "homePhone"
    },
    {
      label: "Mobile Phone",
      name: "mobilePhone"
    },
    {
      label: "Email",
      name: "email"
    },
    {
      label: "Address #1",
      name: "address1"
    },
    {
      label: "Address #2",
      name: "address2"
    },
    {
      label: "City",
      name: "city"
    },
    {
      label: "State",
      name: "state"
    },
    {
      label: "Zip Code",
      name: "zipCode"
    },
    ...parcelOwnerForm({
      getValues,
      setValue,
      tenantName,
      state
    }).slice(1)
  ]

  return formFields
};

export default contactSubForm;