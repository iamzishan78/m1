import gql from "graphql-tag";

export const GETPROFILE = gql`
    query getProfilebyemail($email: String) {
        profileByEmail(userEmail: $email){
            success
            profile {
                fullname
                email
                phone
                profileImage
                displayname
                _id
                timezone
                activity
                ts
                firstname
                middlename
                lastname
                sss_tax_id
                dateOfBirth
                address
                city
                state
                mobilephone
                workphone
                company
                jobTitle
                industry
                isAccreditedInvestor,
                investingExperience, 
                CREexperience,
                emailNotifications,
                employer,
                isSameFromAbove,
                employerAddress,
                investingEntities {
                    entityInformation
                    accountType
                    accredited
                    taxIDSSN
                    entityMembers {
                        firstName
                        lastName
                        Role
                        Signatory
                        Email
                    }
                    mailingInformation {
                        address
                        city
                        state
                        postalCode
                        country
                    }
                    distributionBankingInformation
                },
                investingPreferences {
                    assetType
                    basin
                }
            }
        }
    }
`
export const GET_PROFILE_IMAGE = gql`
    query getProfileImage($email: String) {
        profileByEmail(userEmail: $email){
            success
            profile {
                fullname
                email
                profileImage             
            }
        }
    }
`

export const GET_PROFILES_IMAGES = gql`
    query getProfilesImages($email: String, $emails: [String]) {
        profileByEmail(userEmail: $email, usersEmails: $emails){
            success
            profiles
        }
    }
`