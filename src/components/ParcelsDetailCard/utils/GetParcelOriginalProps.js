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
  if (originalProperties && originalProperties.length > 0) {
    originalProperty.county = originalProperties[0].County;
    originalProperty.state = originalProperties[0].State;
    originalProperty.survey = originalProperties[0].Survey;
    originalProperty.block = originalProperties[0].Block;
    originalProperty.section = originalProperties[0].Section;
    originalProperty.abstract = originalProperties[0].AbstractName;
    originalProperty.altSurvey = originalProperties[0].Grantee;
  }
  return originalProperty;
}