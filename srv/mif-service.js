const cds = require('@sap/cds')

const STATUS_VH = [
  { code: '1', name: 'Draft' },
  { code: '2', name: 'Submitted' },
  { code: '3', name: 'Cancelled' }
]

const COUNTRY_VH = [
  { code: 'AGO', name: 'Angola' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'AUS', name: 'Australia' },
  { code: 'AUT', name: 'Austria' },
  { code: 'BGD', name: 'Bangladesh' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'BGR', name: 'Bulgaria' },
  { code: 'CMR', name: 'Cameroon' },
  { code: 'CAN', name: 'Canada' },
  { code: 'CHL', name: 'Chile' },
  { code: 'CHN', name: 'China' },
  { code: 'COL', name: 'Colombia' },
  { code: 'COG', name: 'Congo' },
  { code: 'CRI', name: 'Costa Rica' },
  { code: 'HRV', name: 'Croatia' },
  { code: 'CZE', name: 'Czech Republic' },
  { code: 'DEU', name: 'Germany' },
  { code: 'DNK', name: 'Denmark' },
  { code: 'DOM', name: 'Dominican Republic' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'EST', name: 'Estonia' },
  { code: 'FIN', name: 'Finland' },
  { code: 'FRA', name: 'France' },
  { code: 'GAB', name: 'Gabon' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'GRC', name: 'Greece' },
  { code: 'GTM', name: 'Guatemala' },
  { code: 'HND', name: 'Honduras' },
  { code: 'HKG', name: 'Hong Kong' },
  { code: 'HUN', name: 'Hungary' },
  { code: 'ISL', name: 'Iceland' },
  { code: 'IND', name: 'India' },
  { code: 'IDN', name: 'Indonesia' },
  { code: 'IRL', name: 'Ireland' },
  { code: 'ISR', name: 'Israel' },
  { code: 'ITA', name: 'Italy' },
  { code: 'JPN', name: 'Japan' },
  { code: 'JOR', name: 'Jordan' },
  { code: 'KAZ', name: 'Kazakhstan' },
  { code: 'KEN', name: 'Kenya' },
  { code: 'KOR', name: 'Republic of Korea' },
  { code: 'LVA', name: 'Latvia' },
  { code: 'LBN', name: 'Lebanon' },
  { code: 'LTU', name: 'Lithuania' },
  { code: 'LUX', name: 'Luxembourg' },
  { code: 'MAC', name: 'Macau' },
  { code: 'MYS', name: 'Malaysia' },
  { code: 'MEX', name: 'Mexico' },
  { code: 'NLD', name: 'Netherlands' },
  { code: 'NZL', name: 'New Zealand' },
  { code: 'NIC', name: 'Nicaragua' },
  { code: 'NGA', name: 'Nigeria' },
  { code: 'NOR', name: 'Norway' },
  { code: 'PAK', name: 'Pakistan' },
  { code: 'PAN', name: 'Panama' },
  { code: 'PER', name: 'Peru' },
  { code: 'PHL', name: 'Philippines' },
  { code: 'POL', name: 'Poland' },
  { code: 'PRT', name: 'Portugal' },
  { code: 'ROU', name: 'Romania' },
  { code: 'RUS', name: 'Russian Federation' },
  { code: 'SAU', name: 'Saudi Arabia' },
  { code: 'SRB', name: 'Serbia' },
  { code: 'SGP', name: 'Singapore' },
  { code: 'ZAF', name: 'South Africa' },
  { code: 'ESP', name: 'Spain' },
  { code: 'LKA', name: 'Sri Lanka' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'CHE', name: 'Switzerland' },
  { code: 'TWN', name: 'Taiwan' },
  { code: 'THA', name: 'Thailand' },
  { code: 'TUR', name: 'Turkey' },
  { code: 'UKR', name: 'Ukraine' },
  { code: 'ARE', name: 'United Arab Emirates' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'USA', name: 'United States' },
  { code: 'URY', name: 'Uruguay' }
]

const VALUE_HELP = [
  { type: '1', code: '1', name: 'New Assignment' },
  { type: '1', code: '2', name: 'Assignment Extension' },
  { type: '1', code: '3', name: 'Repatriation' },
  { type: '1', code: '4', name: 'Localisation' },
  { type: '1', code: '5', name: 'One Way Transfer' },
  { type: '1', code: '6', name: 'Rotational Program' },
  { type: '1', code: '7', name: 'V.I.E' },
  { type: '1', code: '8', name: 'Ad Hoc' },
  { type: '1', code: '9', name: 'All' },
  { type: '2', code: '1', name: 'LTA Leader & Expert' },
  { type: '2', code: '2', name: 'LTA Developmental' },
  { type: '2', code: '3', name: 'LTA Managerial' },
  { type: '2', code: '4', name: 'LTA Opportunity' },
  { type: '2', code: '5', name: 'STA Explorer' },
  { type: '2', code: '6', name: 'New Assignment (EE Driven)' },
  { type: '2', code: '7', name: 'SIPA' },
  { type: '2', code: '8', name: 'STA' },
  { type: '2', code: '9', name: 'VIE' },
  { type: '2', code: '10', name: 'One Way Transfer' },
  { type: '2', code: '11', name: 'One Way Transfer (External Hire)' },
  { type: '2', code: '12', name: 'One way transfer (EE Driven)' },
  { type: '2', code: '13', name: 'FFF' },
  { type: '2', code: '14', name: 'STIP' },
  { type: '2', code: '15', name: 'Ad Hoc' },
  { type: '3', code: '1', name: 'Foundation for the Future' },
  { type: '3', code: '2', name: 'Syensqo Talent Immersion Program' },
  { type: '4', code: '1', name: '1st Rotation' },
  { type: '4', code: '2', name: '2nd Rotation' },
  { type: '4', code: '3', name: '3rd Rotation' },
  { type: '5', code: '1', name: 'Accompanying' },
  { type: '5', code: '2', name: 'Unaccompanied' },
  { type: '6', code: '1', name: 'Currently Unemployed' },
  { type: '6', code: '2', name: 'Currently Working' },
  { type: '6', code: '3', name: 'Plans to work at the new location (relevant only for LTA Leader & Expert)' },
  { type: '6', code: '4', name: 'Employed at Syensqo' },
  { type: '6', code: '5', name: 'Not Applicable' }
]

VALUE_HELP.forEach((row) => {
  row.ID = `${row.name} (${row.code})`
})

const EMPLOYMENT_MOVEMENTS = []

const EMPTY_EMPLOYMENT_MOVEMENT = {
  ID: null,
  employee: null,
  candidate: null,
  moveReferenceNumber: null,
  status_code: null,
  movementType_ID: null,
  policy_ID: null,
  formName: null,
  dateSubmitted: null,
  estimatedStartDate: null,
  realStartDate: null,
  loaPYStartDate: null,
  estimatedEoADate: null,
  realEoADate: null,
  newEndDate: null,
  desiredDepartureDate: null,
  program_ID: null,
  phase_ID: null,
  requestDescription: null,
  taxSensitiveRolesFormCompleted: false,
  hrResponsible: null,
  employeeCanBeContactedByExternalProviders: false,
  personResponsibleForCandidateInHostCompany: null,
  personResponsibleForCandidateInFrance: null,
  dateOfBirth: null,
  countryOfBirth_code: null,
  nationality: null,
  addressLine: null,
  postCode: null,
  city: null,
  country_code: null,
  phoneNumber: null,
  civiNumber: null,
  socialSecurityNumber: null,
  passportNumber: null,
  duration: null,
  purposeOfMissionFR: null,
  positionNameFR: null,
  objectiveOfVIERequestFR: null,
  hostCompanyAddress: null,
  hostCompanyPhoneNumber: null,
  purchaseOrder: null,
  additionalDetails: null,
  attachment: null,
  attachmentsPayload: null,
  numberOfDependents: null,
  numberOfChildren: null,
  familyStatus_ID: null,
  partnerEmployment_ID: null,
  partnerSyensqoUserId: null,
  homeUserId: null,
  homeCountry_code: null,
  homePosition: null,
  homeCompany: null,
  homeSite: null,
  homeBusinessUnit: null,
  homeCostCenter: null,
  homePayGrade: null,
  homeCompanyCar: false,
  hostCountry_code: null,
  hostPosition: null,
  hostCompany: null,
  hostSite: null,
  hostBusinessUnit: null,
  hostCostCenter: null,
  hostPayGrade: null,
  hostCompanyCar: false,
  hostAnnualSalary: null,
  cancellationReason: null,
  attachments: []
}

const _toLiteral = (part) => (part && typeof part === 'object' && 'val' in part ? part.val : part)
const _toRef = (part) => (part && typeof part === 'object' && Array.isArray(part.ref) ? part.ref[0] : null)

function _applyWhereFilter(rows, req) {
  const where = req.query && req.query.SELECT && req.query.SELECT.where
  if (!Array.isArray(where) || where.length < 3) {
    return rows
  }

  const clauses = []
  let i = 0
  while (i + 2 < where.length) {
    const left = where[i]
    const op = where[i + 1]
    const right = where[i + 2]

    if (left === '(' || left === ')' || op === '(' || op === ')' || right === '(' || right === ')') {
      i += 1
      continue
    }

    clauses.push({ left, op, right })
    i += 3

    if (where[i] === 'and' || where[i] === 'or') {
      if (where[i] === 'or') {
        // Value-help requests use AND predicates. Keep behavior deterministic for now.
        return rows
      }
      i += 1
    }
  }

  if (clauses.length === 0) {
    return rows
  }

  return rows.filter((row) => {
    return clauses.every(({ left, op, right }) => {
      const leftRef = _toRef(left)
      const rightRef = _toRef(right)
      let leftValue = leftRef ? row[leftRef] : _toLiteral(left)
      let rightValue = rightRef ? row[rightRef] : _toLiteral(right)

      if (op === '=') {
        return String(leftValue) === String(rightValue)
      }
      if (op === '!=') {
        return String(leftValue) !== String(rightValue)
      }
      return true
    })
  })
}

function _applyKeyFilter(rows, req) {
  const keyData = req.data || {}
  const keys = Object.keys(keyData).filter((key) => keyData[key] !== undefined && keyData[key] !== null)
  if (keys.length === 0) {
    return rows
  }

  return rows.filter((row) => keys.every((key) => String(row[key]) === String(keyData[key])))
}

function _readFromMemory(seedRows, req) {
  const keyFiltered = _applyKeyFilter(seedRows, req)
  const filtered = _applyWhereFilter(keyFiltered, req)

  // OData key reads must return a single object, not an array.
  const isSingleRead = Array.isArray(req.params) && req.params.length > 0
  if (isSingleRead) {
    return filtered[0] || null
  }

  return filtered
}

function _resolveMovementId(req) {
  const fromData = req.data && req.data.ID
  if (fromData) {
    return fromData
  }

  if (Array.isArray(req.params) && req.params.length > 0) {
    const first = req.params[0]
    if (first && typeof first === 'object' && first.ID) {
      return first.ID
    }
  }

  return null
}

function _findMovementIndexById(id) {
  return EMPLOYMENT_MOVEMENTS.findIndex((row) => row && row.ID === id)
}

function _clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function _getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function _findByCode(rows, code) {
  if (!code) return null
  return rows.find((row) => row.code === code) || null
}

function _findById(rows, id) {
  if (!id) return null
  return rows.find((row) => row.ID === id) || null
}

function _normalizeEmploymentMovement(row) {
  const normalized = {
    ...EMPTY_EMPLOYMENT_MOVEMENT,
    ...(row || {})
  }

  normalized.status = _findByCode(STATUS_VH, normalized.status_code)
  normalized.country = _findByCode(COUNTRY_VH, normalized.country_code)
  normalized.countryOfBirth = _findByCode(COUNTRY_VH, normalized.countryOfBirth_code)
  normalized.homeCountry = _findByCode(COUNTRY_VH, normalized.homeCountry_code)
  normalized.hostCountry = _findByCode(COUNTRY_VH, normalized.hostCountry_code)
  normalized.movementType = _findById(VALUE_HELP, normalized.movementType_ID)
  normalized.policy = _findById(VALUE_HELP, normalized.policy_ID)
  normalized.program = _findById(VALUE_HELP, normalized.program_ID)
  normalized.phase = _findById(VALUE_HELP, normalized.phase_ID)
  normalized.familyStatus = _findById(VALUE_HELP, normalized.familyStatus_ID)
  normalized.partnerEmployment = _findById(VALUE_HELP, normalized.partnerEmployment_ID)

  if (!Array.isArray(normalized.attachments)) {
    normalized.attachments = []
  }

  return normalized
}

module.exports = class syq_events_handler_srv extends cds.ApplicationService {
  init() {

    this.before('CREATE', 'EmploymentMovement', async (req) => {
      req.data.status_code = '1'
    })

    this.on('READ', 'StatusVH', async (req) => _readFromMemory(STATUS_VH, req))
    this.on('READ', 'CountryVH', async (req) => _readFromMemory(COUNTRY_VH, req))
    this.on('READ', 'ValueHelp', async (req) => _readFromMemory(VALUE_HELP, req))
    this.on('READ', 'EmploymentMovement', async (req) => {
      const rows = _readFromMemory(EMPLOYMENT_MOVEMENTS, req)
      const isSingleRead = Array.isArray(req.params) && req.params.length > 0

      if (isSingleRead && !rows) {
        const id = _resolveMovementId(req)
        return req.error(404, `Employment Movement with ID ${id || 'unknown'} not found`)
      }

      if (Array.isArray(rows)) {
        return rows.map(_normalizeEmploymentMovement)
      }
      return rows ? _normalizeEmploymentMovement(rows) : null
    })

    this.on('CREATE', 'EmploymentMovement', async (req) => {
      const newRow = {
        ..._clone(req.data || {}),
        ID: (req.data && req.data.ID) || cds.utils.uuid(),
        status_code: (req.data && req.data.status_code) || '1',
        dateSubmitted: (req.data && req.data.dateSubmitted) || _getTodayDateString()
      }

      EMPLOYMENT_MOVEMENTS.push(newRow)
      return newRow
    })

    this.on('UPDATE', 'EmploymentMovement', async (req) => {
      const id = _resolveMovementId(req)
      if (!id) {
        return req.error(400, 'Movement ID is required')
      }

      const index = _findMovementIndexById(id)
      if (index < 0) {
        return req.error(404, `Employment Movement with ID ${id} not found`)
      }

      const updatedData = _clone(req.data || {})
      if (!updatedData.dateSubmitted && !EMPLOYMENT_MOVEMENTS[index].dateSubmitted) {
        updatedData.dateSubmitted = _getTodayDateString()
      }

      const updated = {
        ...EMPLOYMENT_MOVEMENTS[index],
        ...updatedData,
        ID: id
      }

      EMPLOYMENT_MOVEMENTS[index] = updated
      return updated
    })

    this.on('DELETE', 'EmploymentMovement', async (req) => {
      const id = _resolveMovementId(req)
      if (!id) {
        return req.error(400, 'Movement ID is required')
      }

      const index = _findMovementIndexById(id)
      if (index < 0) {
        return req.error(404, `Employment Movement with ID ${id} not found`)
      }

      EMPLOYMENT_MOVEMENTS.splice(index, 1)
      return { success: true }
    })

    this.before('READ', 'EmploymentMovement', (req) => {
      const isListQuery = !req.params || req.params.length === 0;
      if (isListQuery) {
        req.query.where({ status_code: { '!=': null } });

        const columns = req.query && req.query.SELECT && req.query.SELECT.columns;
        if (Array.isArray(columns) && columns.length > 0) {
          const hasColumn = (name) => columns.some((col) => col && col.ref && col.ref[0] === name);
          if (hasColumn('employee') && !hasColumn('candidate')) {
            columns.push({ ref: ['candidate'] });
          }
        }
      }
    });

    this.after('READ', 'EmploymentMovement', (results, req) => {
      const isListQuery = !req.params || req.params.length === 0;
      if (!isListQuery) {
        return;
      }

      const rows = Array.isArray(results) ? results : (results ? [results] : []);

      rows.forEach((row) => {
        if (!row) {
          return;
        }

        const sEmployee = (row.employee || '').trim();
        const sCandidate = (row.candidate || '').trim();
        if (!sEmployee && sCandidate) {
          row.employee = sCandidate;
        }
      });
    });

    this.on('clearMyDrafts', async () => true)

    this.on('acceptMovement', async (req) => {
      const { ID } = req.data
      const index = _findMovementIndexById(ID)
      if (index < 0) {
        return req.error(404, `Employment Movement with ID ${ID} not found`)
      }

      EMPLOYMENT_MOVEMENTS[index] = {
        ...EMPLOYMENT_MOVEMENTS[index],
        status_code: '2'
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
      const index = _findMovementIndexById(ID)
      if (index < 0) return req.error(404, `Movement ${ID} not found`)

      const movement = EMPLOYMENT_MOVEMENTS[index]

      if (!['1', '2'].includes(movement.status_code)) {
        return req.error(409, `Only Draft or Submitted movements can be cancelled`)
      }

      EMPLOYMENT_MOVEMENTS[index] = {
        ...movement,
        status_code: '3',
        cancellationReason
      }

      return req.reply({ success: true, message: `Movement ${ID} cancelled` })
    })
    return super.init()
  }
}
