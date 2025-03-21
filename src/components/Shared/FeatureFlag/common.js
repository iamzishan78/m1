export const FEATURES = {
	USER_MANAGEMENT: 'User Management',
	MEPLER: 'MEPLER',
	IDICORE: 'idiCORE',
	MAPSHAPEEXPORT: 'mapShapeExport',
	LANDMODULE: 'landModule',
	REVENUEMODULE: 'revenueModule',
	LANDPORTFOLIO: 'landPortfolio',
	LANDREPORTINGGROUPS: 'landReportingGroups',
	CONTACTSUBMENU: 'ContactsSubMenu',
	CALENDAR_OBLIGATIONS: 'CALENDAR_OBLIGATIONS',
	CALENDAR_EXPIRATIONS: 'CALENDAR_EXPIRATIONS',
	LANDGRIDSEARCH: 'landGridSearch',
	TRACTIMPORT: 'tractImport',
	UNITIMPORT: 'unitImport',
	SHAPEELASTIC: 'ShapeFileImport',
	USERSNAP: 'userSnap',
	CONTACTGRIDEXPORT: 'ContactGridExport',
	EDITABLE_WORKSPACE: 'editableWorkspaceName',
	SHOWUSERPRIVILEGES: 'showUserPrivileges',
	AGREEMENT_LAYER: 'AgreementLayer',
	ANALYTICS: 'analyticsModule',
	RECENTPERMITLAYER: 'showRecentPermitsLayer',
	TRACKEDWELLSLAYER: 'showTrackedWellsLayer',
	USERTAGSLAYER: 'showUserTagsLayer',
	SEARCHLAYER: 'showSearchLayer',
	DATA: 'dataModule',
	DASHBOARD: 'dashboardModule',
	MAP: 'mapModule',
	FLOW: 'flowModule',
	FILES: 'filesModule',
	CALENDAR: 'calendarModule',
	DIALPAD_INTEGRATION: 'DialPadIntegration',
};

export const ROUTES = {
	LANDMODULE: {
		module: 'landModule',
		route: {
			startsWith: ['/land'],
		},
	},
	REVENUEMODULE: {
		module: 'revenueModule',
		route: {
			startsWith: ['/revenue'],
		},
	},
	ANALYTICS: {
		module: 'analyticsModule',
		route: {
			startsWith: ['/analytics'],
		},
	},
	MAP: {
		module: 'MapModule',
		route: {
			startsWith: ['/map'],
			equals: ['/'],
		},
	},
	DASHBOARD: {
		module: 'Dashboard',
		route: {
			startsWith: ['/dashboard'],
		},
	},
	CONTACT: {
		module: 'Contacts',
		route: {
			startsWith: ['/contact'],
		},
	},
	CALENDER: {
		module: 'Calendar',
		route: {
			startsWith: ['/calendar'],
		},
	},
	FLOW: {
		module: 'Flow',
		route: {
			startsWith: ['/flow'],
		},
	},
	FILES: {
		module: 'Documents',
		route: {
			startsWith: ['/documents'],
		},
	},
	ADMIN_SETTINGS: {
		module: 'AdminSettings',
		route: {
			startsWith: ['/admin'],
		},
	},
	DATA: {
		module: 'dataModule',
		route: {
			startsWith: ['/data'],
		},
	},
};
