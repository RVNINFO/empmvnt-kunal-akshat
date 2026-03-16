sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.syensqo.hr.empmovementform',
            componentId: 'EmploymentMovementObjectPage',
            contextPath: '/EmploymentMovement'
        },
        CustomPageDefinitions
    );
});