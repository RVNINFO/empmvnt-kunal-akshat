using com.globalmobily.sfapps as mif from '../db/mif-schema';

service syq_empglobalmobility_srv {
    entity EmploymentMovement as select from mif.EmploymentMovement;
    entity StatusVH           as select from mif.StatusVH;
    entity CountryVH          as select from mif.CountryVH;
    entity ValueHelp          as select from mif.ValueHelp;
    action acceptMovement(ID: UUID);

    action cancelMovement(ID: UUID) returns {
        success : Boolean;
        message : String;
    };
    action clearMyDrafts() returns Boolean;
}

annotate syq_empglobalmobility_srv.EmploymentMovement with @odata.draft.enabled;
// annotate syq_empglobalmobility_srv.EmploymentMovement with @odata.draft.bypass;
