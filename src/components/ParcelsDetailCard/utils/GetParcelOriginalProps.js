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
    originalProperty.survey = originalProperties[0].level1_sur;
    originalProperty.block = originalProperties[0].level2_blo;
    originalProperty.section = originalProperties[0].level3_sur;
    originalProperty.abstract = originalProperties[0].abstract_l;
  }
  return originalProperty;
}