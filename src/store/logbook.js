import { defineStore } from 'pinia'
import { seedData } from '../seedData.js'

export const useLogbookStore = defineStore('logbook', {
  state: () => ({
    // Reservation records - pre-loaded from Excel
    reservationRecords: initReservationRecords(),
    
    // Pre/Post Inspection records
    inspectionRecords: initInspectionRecords(),
    
    // POW records
    powRecords: initPowRecords(),
    
    // Fuel & Oil records
    fuelRecords: initFuelRecords(),
  }),

  getters: {
    allDrivers: (state) => {
      const drivers = new Set()
      state.reservationRecords.forEach(rec => {
        rec.vehicleSheets.forEach(sheet => {
          sheet.rows.forEach(row => {
            if (row[1] && row[1].trim()) drivers.add(row[1].trim())
          })
        })
      })
      return [...drivers].filter(d => d && !['ASSIGNED DRIVER', 'N/A'].includes(d))
    }
  },

  actions: {
    addReservationRecord(record) {
      this.reservationRecords.push(record)
    },
    updateReservationRecord(index, record) {
      this.reservationRecords[index] = record
    },
    addInspectionRecord(record) {
      this.inspectionRecords.push(record)
    },
    addPowRecord(record) {
      this.powRecords.push(record)
    },
    addFuelRecord(record) {
      this.fuelRecords.push(record)
    },
  }
})

function initReservationRecords() {
  const vehicles = Object.keys(seedData.reservation.vehicles)
  const headers = seedData.reservation.headers

  // Group by year/month from the data
  // Create one combined record per vehicle representing 2026 data
  const vehicleRecords = vehicles.map(vehicle => {
    const rows = seedData.reservation.vehicles[vehicle]
    return {
      id: `RES-2026-${vehicle.replace(/ /g, '_')}`,
      title: `2026 Reservation Log - ${vehicle}`,
      vehicle: vehicle,
      year: '2026',
      month: 'ALL',
      date: '2026-01-01',
      recordedBy: 'ACE',
      createdAt: '2026-01-01',
      headers: headers,
      rows: rows
    }
  })
  return vehicleRecords
}

function initInspectionRecords() {
  return [
    {
      id: 'INSP-PRE-2026',
      title: '2026 Pre-Inspection Logbook',
      type: 'pre',
      year: '2026',
      month: 'ALL',
      date: '2026-01-01',
      recordedBy: 'ACE',
      createdAt: '2026-01-01',
      headers: seedData.inspection.preHeaders,
      rows: seedData.inspection.preRecords
    },
    {
      id: 'INSP-POST-2026',
      title: '2026 Post-Inspection Logbook',
      type: 'post',
      year: '2026',
      month: 'ALL',
      date: '2026-01-01',
      recordedBy: 'ACE',
      createdAt: '2026-01-01',
      headers: seedData.inspection.postHeaders,
      rows: seedData.inspection.postRecords
    }
  ]
}

function initPowRecords() {
  const records = []
  for (const [year, rows] of Object.entries(seedData.pow.years)) {
    if (rows.length > 0) {
      records.push({
        id: `POW-${year}`,
        title: `${year} POW Monitoring Logbook`,
        year: year,
        month: 'ALL',
        date: `${year}-01-01`,
        recordedBy: 'ACE',
        createdAt: `${year}-01-01`,
        headers: seedData.pow.headers,
        rows: rows
      })
    }
  }
  return records
}

function initFuelRecords() {
  const records = []
  for (const [month, rows] of Object.entries(seedData.fuel.months)) {
    if (rows.length > 0) {
      const monthNum = {
        'JANAURY': '01', 'FEBRUARY': '02', 'MARCH': '03', 'APRIL': '04',
        'MAY': '05', 'JUNE': '06', 'JULY': '07', 'AUGUST': '08',
        'SEPTEMBER': '09', 'OCTOBER': '10', 'NOVEMBER': '11', 'DECEMBER': '12'
      }[month] || '01'
      records.push({
        id: `FUEL-2026-${month}`,
        title: `2026 ${month} - Fuel & Oil Withdrawal Log`,
        year: '2026',
        month: month,
        date: `2026-${monthNum}-01`,
        recordedBy: 'ACE',
        createdAt: `2026-${monthNum}-01`,
        headers: seedData.fuel.headers,
        rows: rows
      })
    }
  }
  return records
}
