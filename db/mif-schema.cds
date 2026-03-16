namespace com.globalmobily.sfapps;

using {
    cuid,
    managed
} from '@sap/cds/common';

/**
 * Employment Movement Entity
 * Tracks employee movements, assignments, and related information
 */
entity EmploymentMovement : cuid, managed {
    // Basic Information
    employee                                   : String(100)              @mandatory;
    moveReferenceNumber                        : String(50)               @mandatory;
    status                                     : Association to StatusVH;
    movementType                               : Association to ValueHelp @mandatory;
    policy                                     : Association to ValueHelp @mandatory;
    attachBusinessCase                         : String(500); // File path or URL

    // Dates
    estimatedStartDate                         : Date                     @mandatory;
    realStartDate                              : Date;
    loaPYStartDate                             : Date; // LoA/PY Start Date
    estimatedEoADate                           : Date                     @mandatory; // End of Assignment
    realEoADate                                : Date;
    newEndDate                                 : Date                     @mandatory;
    desiredDepartureDate                       : Date                     @mandatory;
    // Program and Phase Information
    program                                    : Association to ValueHelp @mandatory;
    phase                                      : Association to ValueHelp @mandatory;
    requestDescription                         : String(2000)             @mandatory;
    // Tax and Compliance
    taxSensitiveRolesFormCompleted             : Boolean                  @mandatory default false;

    // Responsible Personnel
    hrResponsible                              : String(100)              @mandatory;
    employeeCanBeContactedByExternalProviders  : Boolean                  @mandatory default false;
    personResponsibleForCandidateInHostCompany : String(100)              @mandatory;
    personResponsibleForCandidateInFrance      : String(100)              @mandatory;

    // Personal Information
    dateOfBirth                                : Date                     @mandatory;
    countryOfBirth                             : Association to CountryVH @mandatory;
    nationality                                : String(100)              @mandatory;

    // Contact Details
    addressLine                                : String(200)              @mandatory;
    postCode                                   : String(20)               @mandatory;
    city                                       : String(100)              @mandatory;
    country                                    : Association to CountryVH @mandatory;
    phoneNumber                                : String(30)               @mandatory;

    // Identity Documents
    civiNumber                                 : String(50)               @mandatory; // CIVI Number
    socialSecurityNumber                       : String(50)               @mandatory;
    passportNumber                             : String(50)               @mandatory;

    // Assignment Duration
    duration                                   : Integer                  @mandatory; // in months or days

    // V.I.E (French International Internship) Specific
    purposeOfMissionFR                         : String(1000)             @mandatory; // in French
    positionNameFR                             : String(200)              @mandatory; // in French
    objectiveOfVIERequestFR                    : String(1000); // in French

    // Host Company Information
    hostCompanyAddress                         : String(500)              @mandatory;
    hostCompanyPhoneNumber                     : String(30)               @mandatory;

    // Purchase and Attachments
    purchaseOrder                              : String(50)               @mandatory;
    additionalDetails                          : String(2000);
    attachment                                 : String(500); // File path or URL

    // Family Information
    numberOfDependents                         : Integer                  @mandatory;
    numberOfChildren                           : Integer                  @mandatory;
    familyStatus                               : Association to ValueHelp @mandatory; // Single, Married, etc.
    partnerEmployment                          : Association to ValueHelp;
    partnerSyensqoUserId                       : String(50);

    // Home Location Details
    homeUserId                                 : String(50);
    homeCountry                                : Association to CountryVH;
    homePosition                               : String(100);
    homeCompany                                : String(100);
    homeSite                                   : String(100);
    homeBusinessUnit                           : String(100);
    homeCostCenter                             : String(50);
    homePayGrade                               : String(20);
    homeCompanyCar                             : Boolean                  @mandatory default false;

    // Host Location Details
    hostCountry                                : Association to CountryVH @mandatory;
    hostPosition                               : String(100);
    hostCompany                                : String(100)              @mandatory;
    hostSite                                   : String(100)              @mandatory;
    hostBusinessUnit                           : String(100)              @mandatory;
    hostCostCenter                             : String(50)               @mandatory;
    hostPayGrade                               : String(20)               @mandatory;
    hostCompanyCar                             : Boolean                  @mandatory default false;
    dateSubmitted                              : Date;
}


entity StatusVH {
    key code : String(10);
        name : String(50);
}


entity CountryVH {
    key code : String(10);
        name : String(100);
}


entity ValueHelp {
    key ID   : UUID;
        type : String(50); // movementType, policy, program, phase
        code : String(100);
        name : String(200);
}
