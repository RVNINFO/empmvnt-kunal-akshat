sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/syensqo/hr/empmovementform/test/integration/pages/EmploymentMovementList",
	"com/syensqo/hr/empmovementform/test/integration/pages/EmploymentMovementObjectPage"
], function (JourneyRunner, EmploymentMovementList, EmploymentMovementObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/syensqo/hr/empmovementform') + '/test/flp.html#app-preview',
        pages: {
			onTheEmploymentMovementList: EmploymentMovementList,
			onTheEmploymentMovementObjectPage: EmploymentMovementObjectPage
        },
        async: true
    });

    return runner;
});

