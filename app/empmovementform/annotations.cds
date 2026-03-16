using syq_empglobalmobility_srv as service from '../../srv/mif-service';

annotate service.EmploymentMovement with @Capabilities.DeleteRestrictions: {Deletable: false};

annotate service.EmploymentMovement with @(
    UI.FieldGroup #GeneratedGroup    : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: '{i18n>EstimatedStartDate}',
                Value: estimatedStartDate,
            },
            {
                $Type: 'UI.DataField',
                Label: '{i18n>RealStartDate}',
                Value: realStartDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Loa PY Start Date',
                Value: loaPYStartDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Estimated EoA Date',
                Value: estimatedEoADate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Real EoA Date',
                Value: realEoADate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'New End Date',
                Value: newEndDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Desired Departure Date',
                Value: desiredDepartureDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Program',
                Value: program.name,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Phase',
                Value: phase.name,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Request Description',
                Value: requestDescription,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Tax Sensitive Roles Form Completed',
                Value: taxSensitiveRolesFormCompleted,
            },
            {
                $Type: 'UI.DataField',
                Label: 'HR Responsible',
                Value: hrResponsible,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Employee Can Be Contacted By External Providers',
                Value: employeeCanBeContactedByExternalProviders,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Person Responsible For Candidate In Host Company',
                Value: personResponsibleForCandidateInHostCompany,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Person Responsible For Candidate In France',
                Value: personResponsibleForCandidateInFrance,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Date Of Birth',
                Value: dateOfBirth,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Country Of Birth',
                Value: countryOfBirth.name,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Nationality',
                Value: nationality,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Address Line',
                Value: addressLine,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Post Code',
                Value: postCode,
            },
            {
                $Type: 'UI.DataField',
                Label: 'City',
                Value: city,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Country',
                Value: country.name,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Phone Number',
                Value: phoneNumber,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Civi Number',
                Value: civiNumber,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Social Security Number',
                Value: socialSecurityNumber,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Passport Number',
                Value: passportNumber,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Duration',
                Value: duration,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Purpose Of Mission FR',
                Value: purposeOfMissionFR,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Position Name FR',
                Value: positionNameFR,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Objective Of VIE Request FR',
                Value: objectiveOfVIERequestFR,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Host Company Address',
                Value: hostCompanyAddress,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Host Company Phone Number',
                Value: hostCompanyPhoneNumber,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Purchase Order',
                Value: purchaseOrder,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Additional Details',
                Value: additionalDetails,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Attachment',
                Value: attachment,
            }
        ],
    },
    UI.Facets                        : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            ID    : 'GeneralInformation',
            Target: '@UI.FieldGroup#GeneralInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Target: '@UI.FieldGroup#GeneratedGroup',
            Label : 'Movement Type Details',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Family Situation',
            ID    : 'FamilySituation1',
            Target: '@UI.FieldGroup#FamilySituation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Home Country Details',
            ID    : 'HomeCountryDetails',
            Target: '@UI.FieldGroup#HomeCountryDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Host Country Details',
            ID    : 'HostCountryDetails',
            Target: '@UI.FieldGroup#HostCountryDetails',
        },
    ],
    UI.LineItem                      : [
        {
            $Type: 'UI.DataField',
            Label: '{i18n>EmployeeName}',
            Value: employee,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>MoveReferenceNumber}',
            Value: moveReferenceNumber,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>Status}',
            Value: status.name,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>MovementType}',
            Value: movementType.name,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>Policy}',
            Value: policy.name,
        },
    ],
    UI.SelectionFields               : [
        status_code,
        policy_ID,
        movementType_ID,
    ],
    UI.FieldGroup #FamilySituation   : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: numberOfDependents,
                Label: 'Number Of Dependents',
            },
            {
                $Type: 'UI.DataField',
                Value: numberOfChildren,
                Label: 'Number Of Children',
            },
            {
                $Type: 'UI.DataField',
                Value: familyStatus.name,
                Label: 'Family Status',
            },
            {
                $Type: 'UI.DataField',
                Value: partnerEmployment.name,
                Label: 'Partner Employment',
            },
            {
                $Type: 'UI.DataField',
                Value: partnerSyensqoUserId,
                Label: 'Partner Syensqo UserId',
            },
        ],
    },
    UI.FieldGroup #HomeCountryDetails: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: homeUserId,
                Label: 'Home User Id',
            },
            {
                $Type: 'UI.DataField',
                Value: homeCountry.name,
                Label: 'Home Country',
            },
            {
                $Type: 'UI.DataField',
                Value: homePosition,
                Label: 'Home Position',
            },
            {
                $Type: 'UI.DataField',
                Value: homeCompany,
                Label: 'Home Company',
            },
            {
                $Type: 'UI.DataField',
                Value: homeSite,
                Label: 'Home Site',
            },
            {
                $Type: 'UI.DataField',
                Value: homeBusinessUnit,
                Label: 'Home Business Unit',
            },
            {
                $Type: 'UI.DataField',
                Value: homeCostCenter,
                Label: 'Home Cost Center',
            },
            {
                $Type: 'UI.DataField',
                Value: homePayGrade,
                Label: 'Home Pay Grade',
            },
            {
                $Type: 'UI.DataField',
                Value: homeCompanyCar,
                Label: 'Home Company Car',
            },
        ],
    },
    UI.FieldGroup #HostCountryDetails: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: hostCountry.name,
                Label: 'Host Country',
            },
            {
                $Type: 'UI.DataField',
                Value: hostPosition,
                Label: 'Host Position',
            },
            {
                $Type: 'UI.DataField',
                Value: hostCompany,
                Label: 'Host Company',
            },
            {
                $Type: 'UI.DataField',
                Value: hostSite,
                Label: 'Host Site',
            },
            {
                $Type: 'UI.DataField',
                Value: hostBusinessUnit,
                Label: 'Host Business Unit',
            },
            {
                $Type: 'UI.DataField',
                Value: hostCostCenter,
                Label: 'Host Cost Center',
            },
            {
                $Type: 'UI.DataField',
                Value: hostPayGrade,
                Label: 'Host Pay Grade',
            },
            {
                $Type: 'UI.DataField',
                Value: hostCompanyCar,
                Label: 'Host Company Car',
            },
            {
                $Type: 'UI.DataField',
                Value: hostCompanyPhoneNumber,
                Label: 'Host Company Phone Number',
            },
            {
                $Type: 'UI.DataField',
                Value: hostCompanyAddress,
                Label: 'Host Company Address',
            },
        ],
    },
    UI.FieldGroup #GeneralInformation: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: employee,
                Label: 'Employee Name',
            },
            {
                $Type: 'UI.DataField',
                Value: moveReferenceNumber,
                Label: 'Move Reference Number',
            },
            {
                $Type: 'UI.DataField',
                Value: movementType.name,
            },
            {
                $Type: 'UI.DataField',
                Value: status.name,
            },
            {
                $Type: 'UI.DataField',
                Value: policy.name,
            },
            {
                $Type: 'UI.DataField',
                Value: attachBusinessCase,
                Label: '{i18n>AttachBusinessCase}',
            },
        ],
    },
    UI.HeaderInfo                    : {
        Title         : {
            $Type: 'UI.DataField',
            Value: employee,
        },
        TypeName      : '',
        TypeNamePlural: '',
        Description   : {
            $Type: 'UI.DataField',
            Value: moveReferenceNumber,
        },
        ImageUrl      : employee,
    },
);

annotate service.EmploymentMovement with {
    moveReferenceNumber @Common.FieldControl: #ReadOnly;

    status              @(
        Common.Label          : '{i18n>Status}',
        Common.Text           : status.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'StatusVH',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: status_code,
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    );

    movementType        @(
        Common.Label          : '{i18n>MovementType}',
        Common.Text           : movementType.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'ValueHelp',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: movementType_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                },
                {
                    $Type            : 'Common.ValueListParameterConstant',
                    ValueListProperty: 'type',
                    Constant         : 'cust_movementtype'
                }
            ]
        }
    );

    policy              @(
        Common.Label          : '{i18n>Policy}',
        Common.Text           : policy.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'ValueHelp',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: policy_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                },
                {
                    $Type            : 'Common.ValueListParameterConstant',
                    ValueListProperty: 'type',
                    Constant         : 'cust_policy'
                }
            ]
        }
    );

    program             @(
        Common.Label          : 'Program',
        Common.Text           : program.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'ValueHelp',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: program_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                },
                {
                    $Type            : 'Common.ValueListParameterConstant',
                    ValueListProperty: 'type',
                    Constant         : 'cust_program'
                }
            ]
        }
    );

    phase               @(
        Common.Label          : 'Phase',
        Common.Text           : phase.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'ValueHelp',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: phase_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                },
                {
                    $Type            : 'Common.ValueListParameterConstant',
                    ValueListProperty: 'type',
                    Constant         : 'cust_phase'
                }
            ]
        }
    );

    countryOfBirth      @(
        Common.Label          : 'Country Of Birth',
        Common.Text           : countryOfBirth.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'CountryVH',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: countryOfBirth_code,
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    );

    country             @(
        Common.Label          : 'Country',
        Common.Text           : country.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'CountryVH',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: country_code,
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    );

    homeCountry         @(
        Common.Label          : 'Home Country',
        Common.Text           : homeCountry.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'CountryVH',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: homeCountry_code,
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    );

    hostCountry         @(
        Common.Label          : 'Host Country',
        Common.Text           : hostCountry.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'CountryVH',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: hostCountry_code,
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    );

    familyStatus        @(
        Common.Label          : 'Family Status',
        Common.Text           : familyStatus.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'ValueHelp',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: familyStatus_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                },
                {
                    $Type            : 'Common.ValueListParameterConstant',
                    ValueListProperty: 'type',
                    Constant         : 'cust_depfamilystatus'
                }
            ]
        }
    );

    partnerEmployment   @(
        Common.Label          : 'Partner Employment',
        Common.Text           : partnerEmployment.name,
        Common.TextArrangement: #TextFirst,
        Common.ValueList      : {
            CollectionPath : 'ValueHelp',
            SearchSupported: true,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: partnerEmployment_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                },
                {
                    $Type            : 'Common.ValueListParameterConstant',
                    ValueListProperty: 'type',
                    Constant         : 'cust_deppartneremployment'
                }
            ]
        }
    );
};
