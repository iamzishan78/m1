export function getParcelOriginalProperties(parcel) {
  let originalProperty = {
    county: '',
    state: '',
    survey: '',
    block: '',
    section: '',
    abstract: '',
    altSurvey: ''
  };

  let originalProperties = parcel && parcel.originalProperties;
  if (originalProperties && (typeof originalProperties === 'string' || originalProperties instanceof String)) {
    originalProperties = JSON.parse(originalProperties);
  }

  // Continue PLSS Data
  // console.log("---------------------------------------");
  // console.log(originalProperties[0]);
  // console.log("---------------------------------------");


  if (originalProperties && originalProperties.length > 0) {
    originalProperty.county = originalProperties[0].County;
    if ("State" in originalProperties[0]) {
      originalProperty.state = originalProperties[0].State;
    } else {
      originalProperty.state = originalProperties[0].StateAbbreviation;
    }
    originalProperty.survey = originalProperties[0].Survey;
    originalProperty.block = originalProperties[0].Block;
    originalProperty.section = originalProperties[0].Section;
    originalProperty.abstract = originalProperties[0].AbstractName;
    originalProperty.altSurvey = originalProperties[0].Grantee;
  }
  return originalProperty;
}