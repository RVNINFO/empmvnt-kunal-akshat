using {
    cuid,
    managed
} from '@sap/cds/common';

@Core.IsMediaType: true
type MediaType        : String(100);

@Core.MediaType: 'application/octet-stream'
type AttachmentStream : LargeBinary;

service syq_empglobalmobility_srv {
    @cds.persistence.skip
    entity EmploymentMovement : cuid, managed {
        employee                                   : String(100);
        candidate                                  : String;
        moveReferenceNumber                        : String(50);
        status                                     : Association to StatusVH;
        movementType                               : Association to ValueHelp;
        policy                                     : Association to ValueHelp;
        formName                                   : String;
        dateSubmitted                              : Date;

        estimatedStartDate                         : Date;
        realStartDate                              : Date;
        loaPYStartDate                             : Date;
        estimatedEoADate                           : Date;
        realEoADate                                : Date;
        newEndDate                                 : Date;
        desiredDepartureDate                       : Date;

        program                                    : Association to ValueHelp;
        phase                                      : Association to ValueHelp;
        requestDescription                         : String(2000);
        taxSensitiveRolesFormCompleted             : Boolean default false;

        hrResponsible                              : String(100);
        employeeCanBeContactedByExternalProviders  : Boolean default false;
        personResponsibleForCandidateInHostCompany : String(100);
        personResponsibleForCandidateInFrance      : String(100);

        dateOfBirth                                : Date;
        countryOfBirth                             : Association to CountryVH;
        nationality                                : String(100);

        addressLine                                : String(200);
        postCode                                   : String(20);
        city                                       : String(100);
        country                                    : Association to CountryVH;
        phoneNumber                                : String(30);

        civiNumber                                 : String(50);
        socialSecurityNumber                       : String(50);
        passportNumber                             : String(50);

        duration                                   : Integer;
        purposeOfMissionFR                         : String(1000);
        positionNameFR                             : String(200);
        objectiveOfVIERequestFR                    : String(1000);

        hostCompanyAddress                         : String(500);
        hostCompanyPhoneNumber                     : String(30);

        purchaseOrder                              : String(50);
        additionalDetails                          : String(2000);
        attachment                                 : String(500);
        attachmentsPayload                         : LargeString;
        attachments                                : Composition of many EmploymentMovementAttachment
                                                         on attachments.parent = $self;

        numberOfDependents                         : Integer;
        numberOfChildren                           : Integer;
        familyStatus                               : Association to ValueHelp;
        partnerEmployment                          : Association to ValueHelp;
        partnerSyensqoUserId                       : String(50);

        homeUserId                                 : String(50);
        homeCountry                                : Association to CountryVH;
        homePosition                               : String(100);
        homeCompany                                : String(100);
        homeSite                                   : String(100);
        homeBusinessUnit                           : String(100);
        homeCostCenter                             : String(50);
        homePayGrade                               : String(20);
        homeCompanyCar                             : Boolean default false;

        hostCountry                                : Association to CountryVH;
        hostPosition                               : String(100);
        hostCompany                                : String(100);
        hostSite                                   : String(100);
        hostBusinessUnit                           : String(100);
        hostCostCenter                             : String(50);
        hostPayGrade                               : String(20);
        hostCompanyCar                             : Boolean default false;
        hostAnnualSalary                           : Double;

        cancellationReason                         : String;
    }

    @cds.persistence.skip
    entity EmploymentMovementAttachment : cuid, managed {
        parent   : Association to EmploymentMovement;
        fileName : String(255);
        fileType : MediaType;
        file     : AttachmentStream;
    }

    @cds.persistence.skip
    entity StatusVH {
        key code : String(10);
            name : String(50);
    }

    @cds.persistence.skip
    entity CountryVH {
        key code : String(10);
            name : String(100);
    }

    @cds.persistence.skip
    entity ValueHelp {
        key ID   : UUID;
            type : String(50);
            code : String(100);
            name : String(200);
    }

    action acceptMovement(ID: UUID)                                  returns {
        success : Boolean;
        message : String;
    };

    action cancelMovement(ID: UUID, cancellationReason: LargeString) returns {
        success : Boolean;
        message : String;
    };

    action clearMyDrafts()                                           returns Boolean;
}
