const cds = require('@sap/cds')

module.exports = class syq_events_handler_srv extends cds.ApplicationService {
  init() {

    const { EmploymentMovement } = cds.entities('syq_empglobalmobility_srv')

    this.before('CREATE', EmploymentMovement, async (req) => {
      //  let formattedNumber;
      //  const db = await cds.connect.to('db');
      //   const result = await db.run(
      //     `SELECT MOVEREFERENCENUMBER.NEXTVAL AS number FROM DUMMY`
      //   );
      //   console.log(`got referencenumber ${result[0].NUMBER}`);
      //   if(result && result[0] && result[0].NUMBER){
      //    formattedNumber = String(result[0].NUMBER).padStart(8,0);
      //   }else{
      //     formattedNumber ='0000000'
      //   }

      // req.data.moveReferenceNumber = `MRN-${formattedNumber}`

    })

    this.before('CREATE', EmploymentMovement, async (req) => {
      req.data.status_code = '1'
    })

    this.before('READ', 'EmploymentMovement', (req) => {
      const isListQuery = !req.params || req.params.length === 0;
      if (isListQuery) {
        req.query.where({ status_code: { '!=': null } });
      }
    });

    this.on('clearMyDrafts', async (req) => {
      const { EmploymentMovement } = this.entities;
      const user = req.user.id;

      // get DraftUUIDs belonging to current user
      const adminData = await SELECT
        .from('DRAFT.DraftAdministrativeData')
        .where({ CreatedByUser: user });

      if (adminData.length === 0) return true;

      const draftUUIDs = adminData.map(d => d.DraftUUID);

      await DELETE
        .from(EmploymentMovement.drafts)
        .where({ DraftAdministrativeData_DraftUUID: { in: draftUUIDs } });

      return true;
    });

    this.on('acceptMovement', async (req) => {
      const { ID } = req.data
      const affected = await UPDATE(EmploymentMovement)
        .set({ status_code: '2' })
        .where({ ID })
      if (!affected) {
        return req.error(404, `Employment Movement with ID ${ID} not found`)
      }
      return req.reply({ success: true, message: `Movement ${ID} accepted successfully` })
    })


    this.on('cancelMovement', async (req) => {
      const { ID } = req.data
      const cancellationReason = typeof req.data.cancellationReason === 'string'
        ? req.data.cancellationReason.trim()
        : ''

      if (!cancellationReason) {
        return req.error(400, 'Cancellation reason is required')
      }

      // Business rule: only Draft(1) or Submitted(2) can be cancelled
      const movement = await SELECT.one(EmploymentMovement).where({ ID })
      if (!movement) return req.error(404, `Movement ${ID} not found`)

      if (!['1', '2'].includes(movement.status_code)) {
        return req.error(409, `Only Draft or Submitted movements can be cancelled`)
      }

      const affected = await UPDATE(EmploymentMovement)
        .set({ status_code: '3', cancellationReason })
        .where({ ID })

      if (!affected) return req.error(500, `Failed to cancel movement`)

      return req.reply({ success: true, message: `Movement ${ID} cancelled` })
    })
    return super.init()
  }
}
