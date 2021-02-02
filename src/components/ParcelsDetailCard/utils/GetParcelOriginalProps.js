export function getParcelOriginalProperties(parcel) {
  let originalProperty = {
    county: '',
    state: '',
    survey: '',
    block: '',
    section: '',
    abstract: '',
    altSurvey: '',

    meridian: '',
    township: '',
    range: '',
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
    if ("Section" in originalProperties[0]){
      originalProperty.section = originalProperties[0].Section;
    } else {
      originalProperty.section = originalProperties[0].ShortName;
    }
    originalProperty.survey = originalProperties[0].Survey;
    originalProperty.block = originalProperties[0].Block;
    originalProperty.abstract = originalProperties[0].AbstractName;
    originalProperty.altSurvey = originalProperties[0].Grantee;
    originalProperty.meridian = originalProperties[0].PrincipalMeridian;
    originalProperty.range = originalProperties[0].Range;
    originalProperty.township = originalProperties[0].Township;
  }
  return originalProperty;
}