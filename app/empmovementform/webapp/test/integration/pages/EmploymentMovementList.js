sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.syensqo.hr.empmovementform',
            componentId: 'EmploymentMovementList',
            contextPath: '/EmploymentMovement'
        },
        CustomPageDefinitions
    );
});