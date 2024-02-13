const filterConsts = {
  state: {
    filterKey: 'level1Name.keyword',
    filterField: 'level1Type.keyword',
    dependencyArray: [],
    key: "originalProperties.State",
  },
  county: {
    filterKey: 'level2Name.keyword',
    filterField: 'level2Type.keyword',
    dependencyArray: ['state'],
    key: "originalProperties.County",
  },
  meridian: {
    filterKey: 'level3Name.keyword',
    filterField: 'level3Type.keyword',
    dependencyArray: ['state', 'county'],
    key: "originalProperties.Meridian",
  },
  township: {
    filterKey: 'level5Name.keyword',
    filterField: 'level5Type.keyword',
    dependencyArray: ['state', 'county', 'meridian'],
    key: "originalProperties.Township",
  },
  range: {
    filterKey: 'level5Name.keyword',
    filterField: 'level5Type.keyword',
    dependencyArray: ['state', 'county', 'meridian'],
    key: "originalProperties.Range",
  },

  section: {
    filterKey: 'level6Name.keyword',
    filterField: 'level6Type.keyword',
    dependencyArray: ['state', 'county', 'meridian', 'townshipRange'],
    key: "originalProperties.Section",
  },
  survey: {
    filterKey: 'level3Name.keyword',
    filterField: 'level3Type.keyword',
    dependencyArray: ['state', 'county'],
    key: "originalProperties.Survey",
  },
  block: {
    filterKey: 'level4Name.keyword',
    filterField: 'level4Type.keyword',
    dependencyArray: ['state', 'county', 'survey'],
    key: "originalProperties.Block",
  },
  sectiontx: {
    filterKey: 'level5Name.keyword',
    filterField: 'level5Type.keyword',
    dependencyArray: ['state', 'county', 'survey', 'block'],
    key: "originalProperties.Section",
  },

  abstract: {
    filterKey: 'level6Name.keyword',
    filterField: 'level6Type.keyword',
    dependencyArray: ['state', 'county', 'survey', 'block', 'section'],
    key: "originalProperties.AbstractName",
  },
  altSurvey: {
    filterKey: 'level6Name.keyword',
    filterField: 'level6Type.keyword',
    dependencyArray: ['state', 'county', 'survey', 'block', 'section'],
    key: "originalProperties.Grantee",
  }
}

export default filterConsts
