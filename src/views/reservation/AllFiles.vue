<template>
  <div>
    <!-- ══ SCREEN VIEW ══ -->
    <div class="page-header no-print">
      <div>
        <h1>Vehicle Reservation — All Files Record</h1>
        <div class="breadcrumb">Vehicle Records → Reservation → All Files</div>
      </div>
      <router-link to="/reservation/create" class="btn btn-primary">+ Create New Record</router-link>
    </div>

    <div class="page-content no-print">
      <div class="filter-bar">
        <input class="form-control search-input" v-model="search" placeholder="Search records..." />
        <select class="form-control" v-model="filterYear">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <div v-if="filteredRecords.length === 0" class="card">
        <div class="card-body" style="text-align:center;padding:40px;color:#9ca3af;">
          No records found matching your search.
        </div>
      </div>

      <div v-for="rec in filteredRecords" :key="rec.id" class="record-card">
        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span>{{ rec.vehicle }}</span>
              <span>{{ rec.year }}</span>
              <span>{{ nonEmptyRows(rec).length }} trips</span>
              <span>{{ rec.recordedBy }}</span>
            </div>
          </div>
          <div class="record-card-actions">
            <button v-if="!editingId[rec.id]" class="btn btn-warning btn-sm" @click.stop="startEdit(rec)">Edit</button>
            <button v-else class="btn btn-success btn-sm" @click.stop="saveEdit(rec)">Save</button>
            <button v-if="editingId[rec.id]" class="btn btn-secondary btn-sm" @click.stop="cancelEdit(rec)">Cancel</button>
            <button v-if="!editingId[rec.id]" class="btn btn-danger btn-sm" @click.stop="confirmDelete(rec)">Delete</button>
            <button class="btn btn-success btn-sm" @click.stop="printRecord(rec.id)">Print</button>
            <button class="btn btn-secondary btn-sm" @click.stop="toggleRecord(rec.id)">
              {{ openRecords[rec.id] ? '▲ Collapse' : '▼ Expand' }}
            </button>
          </div>
        </div>
        <div class="record-card-body" :class="{ open: openRecords[rec.id] }">
          <ExcelTable
            :headers="rec.headers"
            :groups="rec.groups || defaultGroups"
            :model-value="editingId[rec.id] ? draftRows[rec.id] : rec.rows"
            :editable="!!editingId[rec.id]"
            @update:model-value="val => draftRows[rec.id] = val"
          />
        </div>
      </div>
    </div>

    <!-- ══ PRINT VIEW ══ -->
    <div v-for="rec in filteredRecords" :key="'p-' + rec.id" class="pow-print-doc">

      <!-- Letterhead -->
      <div class="pow-letterhead">
        <img src="/1.png" alt="CSU Logo" class="pow-logo" />
        <div class="pow-lh-center">
          <div class="pow-lh-republic">Republic of the Philippines</div>
          <div class="pow-lh-university">CARAGA STATE UNIVERSITY</div>
          <div class="pow-lh-office">General Services Office</div>
          <div class="pow-lh-address">Ampayon, Butuan City 8600, Caraga</div>
        </div>
        <img src="/2.png" alt="Bagong Pilipinas" class="pow-logo" />
      </div>

      <div class="pow-doc-title-bar">VEHICLE RESERVATION LOGBOOK</div>

      <!-- Record info -->
      <table class="pow-summary-table">
        <tr>
          <td class="pst-label">Logbook Title</td>
          <td class="pst-value" colspan="3">{{ rec.title }}</td>
        </tr>
        <tr>
          <td class="pst-label">Vehicle</td>
          <td class="pst-value">{{ rec.vehicle }}</td>
          <td class="pst-label">Year</td>
          <td class="pst-value">{{ rec.year }}</td>
        </tr>
        <tr>
          <td class="pst-label">Recorded By</td>
          <td class="pst-value">{{ rec.recordedBy }}</td>
          <td class="pst-label">Date Printed</td>
          <td class="pst-value">{{ today }}</td>
        </tr>
      </table>

      <!-- Summary stats -->
      <div class="sum-section-title">RECORD SUMMARY</div>
      <div class="sum-stat-bar">
        <div class="sum-stat">
          <div class="sum-stat-num">{{ nonEmptyRows(rec).length }}</div>
          <div class="sum-stat-lbl">Total Trips</div>
        </div>
        <div class="sum-stat">
          <div class="sum-stat-num">{{ countStatus(rec, 'Completed') }}</div>
          <div class="sum-stat-lbl">Completed</div>
        </div>
        <div class="sum-stat">
          <div class="sum-stat-num">{{ countStatus(rec, 'Pending') }}</div>
          <div class="sum-stat-lbl">Pending</div>
        </div>
        <div class="sum-stat">
          <div class="sum-stat-num">{{ countStatus(rec, 'Cancel') }}</div>
          <div class="sum-stat-lbl">Cancelled</div>
        </div>
        <div class="sum-stat">
          <div class="sum-stat-num">{{ uniqueDrivers(rec).length }}</div>
          <div class="sum-stat-lbl">Drivers</div>
        </div>
        <div class="sum-stat">
          <div class="sum-stat-num">{{ uniqueOffices(rec).length }}</div>
          <div class="sum-stat-lbl">Offices</div>
        </div>
      </div>

      <!-- Driver + Office breakdown -->
      <div class="sum-two-col">
        <div>
          <div class="sum-col-title">Trips by Driver</div>
          <table class="sum-breakdown-table">
            <thead><tr><th>Driver</th><th>Trips</th><th>Completed</th></tr></thead>
            <tbody>
              <tr v-for="d in driverBreakdown(rec)" :key="d.name">
                <td>{{ d.name || '(unassigned)' }}</td>
                <td style="text-align:center">{{ d.total }}</td>
                <td style="text-align:center">{{ d.completed }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="sum-col-title">Trips by Requesting Office</div>
          <table class="sum-breakdown-table">
            <thead><tr><th>Office</th><th>Trips</th></tr></thead>
            <tbody>
              <tr v-for="o in officeBreakdown(rec)" :key="o.name">
                <td>{{ o.name || '—' }}</td>
                <td style="text-align:center">{{ o.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Monthly breakdown -->
      <div class="sum-col-title" style="margin-top:5pt;">Monthly Trip Count</div>
      <table class="sum-breakdown-table" style="width:100%">
        <thead>
          <tr><th v-for="m in monthNames" :key="m">{{ m }}</th></tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="m in monthNames" :key="m" style="text-align:center">
              {{ monthCount(rec, m) || '—' }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="sum-section-title" style="margin-top:6pt;">COMPLETE TRIP RECORDS</div>

      <!-- Full data table with grouped COST CENTER header -->
      <table class="sum-data-table">
        <thead>
          <!-- Row 1: grouped headers -->
          <tr>
            <th v-for="(g, gi) in (rec.groups || defaultGroups)" :key="gi"
              :colspan="g.children ? g.children.length : 1"
              :rowspan="g.children ? 1 : 2"
              :class="g.children ? 'cost-center-th' : ''"
            >{{ g.label }}</th>
          </tr>
          <!-- Row 2: sub-headers for groups that have children -->
          <tr>
            <template v-for="g in (rec.groups || defaultGroups)" :key="'s'+g.label">
              <th v-for="child in (g.children || [])" :key="child" class="cost-child-th">
                {{ child }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in nonEmptyRows(rec)" :key="ri">
            <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Signature -->
      <div class="pow-sig-block">
        <div class="pow-sig-item">
          <div class="pow-sig-line"></div>
          <div class="pow-sig-name">ACE-ME CASIÑO</div>
          <div class="pow-sig-role">Prepared By</div>
        </div>
        <div class="pow-sig-item">
          <div class="pow-sig-line"></div>
          <div class="pow-sig-name">ENGR. MARIA M. DELO</div>
          <div class="pow-sig-role">Approved By</div>
        </div>
      </div>
    </div><!-- /pow-print-doc -->

    <!-- Delete modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <div class="modal-box">
          <div class="modal-icon">⚠️</div>
          <div class="modal-title">Delete Record?</div>
          <div class="modal-body">
            You are about to permanently delete:<br>
            <strong>{{ deleteTarget.title }}</strong><br><br>
            This cannot be undone.
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary btn-sm" @click="deleteTarget = null">Cancel</button>
            <button class="btn btn-danger btn-sm" @click="doDelete">Yes, Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'
import ExcelTable from '../../components/ExcelTable.vue'

const store       = useLogbookStore()
const search      = ref('')
const filterYear  = ref('')
const openRecords = reactive({})
const editingId   = reactive({})
const draftRows   = reactive({})
const deleteTarget = ref(null)

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const today = new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' })

// Default groups config — used for seeded records that don't have groups stored yet
// Seeded records have 13 cols (CHARGING OF FUEL/PER DIEM as single col at index 9)
// New records have 14 cols (PER DIEM at 9, FUEL at 10)
const defaultGroups = [
  { label: 'TRIP TICKET NO.' },
  { label: 'ASSIGNED DRIVER' },
  { label: 'MONTH & DATE/S' },
  { label: 'TIME' },
  { label: 'DESTINATION' },
  { label: 'PURPOSE' },
  { label: "REQUESTER'S CONTACT NO." },
  { label: 'REQUESTING OFFICE' },
  { label: 'REMARKS' },
  { label: 'COST CENTER', children: ['PER DIEM', 'FUEL'] },
  { label: 'STATUS' },
  { label: 'RECORDED BY' },
  { label: 'UPDATED BY' },
]

const years = computed(() => [...new Set(store.reservationRecords.map(r => r.year))].sort())

const filteredRecords = computed(() =>
  store.reservationRecords.filter(rec => {
    const s = search.value.toLowerCase()
    const matchSearch = !s || rec.title.toLowerCase().includes(s) ||
      (rec.vehicle || '').toLowerCase().includes(s) ||
      rec.rows.some(row => row.some(cell => String(cell).toLowerCase().includes(s)))
    const matchYear = !filterYear.value || rec.year === filterYear.value
    return matchSearch && matchYear && rec.rows.length > 0
  })
)

function nonEmptyRows(rec) {
  return rec.rows.filter(row => row.some(cell => String(cell).trim() !== ''))
}

// STATUS col: new records have 14 cols (STATUS at 11), old seeded have 13 (STATUS at 10)
function statusCol(rec) {
  return rec.headers && rec.headers.length >= 14 ? 11 : 10
}

function countStatus(rec, status) {
  const col = statusCol(rec)
  return nonEmptyRows(rec).filter(row =>
    String(row[col] || '').toLowerCase().includes(status.toLowerCase())
  ).length
}

// DRIVER: col 1
function uniqueDrivers(rec) {
  return [...new Set(nonEmptyRows(rec).map(r => r[1]).filter(Boolean))]
}

function driverBreakdown(rec) {
  const col = statusCol(rec)
  const map = {}
  nonEmptyRows(rec).forEach(row => {
    const d = row[1] || ''
    if (!map[d]) map[d] = { name: d, total: 0, completed: 0 }
    map[d].total++
    if (String(row[col] || '').toLowerCase().includes('completed')) map[d].completed++
  })
  return Object.values(map).sort((a, b) => b.total - a.total)
}

// OFFICE: col 7
function uniqueOffices(rec) {
  return [...new Set(nonEmptyRows(rec).map(r => r[7]).filter(Boolean))]
}

function officeBreakdown(rec) {
  const map = {}
  nonEmptyRows(rec).forEach(row => {
    const o = row[7] || ''
    if (!map[o]) map[o] = { name: o, total: 0 }
    map[o].total++
  })
  return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 15)
}

// DATE: col 2
function monthCount(rec, abbr) {
  const idx = monthNames.indexOf(abbr)
  return nonEmptyRows(rec).filter(row => {
    const d = String(row[2] || '')
    const m = new Date(d).getMonth()
    return m === idx
  }).length
}

function toggleRecord(id) { openRecords[id] = !openRecords[id] }

function startEdit(rec) {
  draftRows[rec.id] = rec.rows.map(r => [...r])
  editingId[rec.id] = true
  openRecords[rec.id] = true
}

function saveEdit(rec) {
  const idx = store.reservationRecords.findIndex(r => r.id === rec.id)
  if (idx !== -1) store.updateReservationRecord(idx, { ...store.reservationRecords[idx], rows: draftRows[rec.id] })
  editingId[rec.id] = false
}

function cancelEdit(rec) {
  delete draftRows[rec.id]
  editingId[rec.id] = false
}

function confirmDelete(rec) { deleteTarget.value = rec }
function doDelete() {
  const idx = store.reservationRecords.findIndex(r => r.id === deleteTarget.value.id)
  if (idx !== -1) store.deleteReservationRecord(idx)
  deleteTarget.value = null
}

function printRecord(id) {
  openRecords[id] = true
  setTimeout(() => window.print(), 300)
}
</script>

<style scoped>
.edit-notice { margin-top:8px; padding:8px 14px; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; font-size:12px; color:#92400e; }
.btn-warning { background:#9dc5a7; color:#000; border:1.5px solid #a4cfb2; }
.btn-warning:hover { background:#77b892; }
.btn-danger  { background:#ef4444; color:#fff; border:1.5px solid #dc2626; }
.btn-danger:hover  { background:#dc2626; }
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:9999; }
.modal-box { background:#fff; border-radius:12px; padding:32px 28px 24px; max-width:380px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,0.22); text-align:center; }
.modal-icon { font-size:36px; margin-bottom:10px; }
.modal-title { font-size:17px; font-weight:700; color:#111827; margin-bottom:10px; }
.modal-body  { font-size:13px; color:#4b5563; line-height:1.6; margin-bottom:22px; }
.modal-actions { display:flex; gap:10px; justify-content:center; }

.pow-print-doc { display: none; }

/* ════ PRINT ════ */
@media print {
  @page { size: 8.5in 13in landscape; margin: 8mm 10mm 10mm 10mm; }

  .no-print, .page-header, .page-content, .sidebar,
  .main-content > *:not(.pow-print-doc), .app-layout > aside,
  .record-card, .filter-bar, .modal-backdrop {
    display: none !important;
  }
  .app-layout, .main-content {
    display: block !important; width: 100% !important;
    height: auto !important; overflow: visible !important;
    margin: 0 !important; padding: 0 !important;
  }

  .pow-print-doc {
    display: block !important;
    page-break-before: always; break-before: page;
    font-family: Arial, sans-serif; font-size: 7pt;
    color: #000; background: #fff; width: 100%;
  }
  .pow-print-doc:first-of-type { page-break-before: avoid; break-before: avoid; }

  /* Letterhead */
  .pow-letterhead { display: flex !important; align-items: center; justify-content: space-between; padding-bottom: 3pt; border-bottom: 1.5pt solid #2d6127; margin-bottom: 3pt; }
  .pow-logo { height: 36pt; width: auto; object-fit: contain; }
  .pow-lh-center { flex: 1; text-align: center; }
  .pow-lh-republic { font-size: 7pt; color: #555; }
  .pow-lh-university { font-size: 11pt; font-weight: 700; color: #1a3d18; text-transform: uppercase; }
  .pow-lh-office { font-size: 8pt; color: #2d6127; font-weight: 600; }
  .pow-lh-address { font-size: 6.5pt; color: #666; }

  .pow-doc-title-bar {
    background: #2d6127 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
    color: #fff !important; font-size: 8pt; font-weight: 700; text-align: center;
    padding: 2pt 6pt; text-transform: uppercase; margin-bottom: 3pt;
  }

  .pow-summary-table { width: 100%; border-collapse: collapse; margin-bottom: 4pt; font-size: 6.5pt; }
  .pow-summary-table td { border: 0.4pt solid #aaa; padding: 1.5pt 4pt; }
  .pst-label { background: #e8f5e9 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-weight: 600; width: 18%; color: #1a3d18; }
  .pst-value { width: 32%; }

  .sum-section-title {
    background: #3b8132 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
    color: #fff !important; font-size: 7pt; font-weight: 700;
    padding: 2pt 5pt; margin: 4pt 0 3pt; text-transform: uppercase; letter-spacing: 0.5px;
  }

  .sum-stat-bar { display: flex !important; gap: 0; margin-bottom: 4pt; border: 0.4pt solid #ccc; }
  .sum-stat { flex: 1; text-align: center; padding: 3pt 2pt; border-right: 0.4pt solid #ccc; }
  .sum-stat:last-child { border-right: none; }
  .sum-stat-num { font-size: 12pt; font-weight: 700; color: #2d6127; }
  .sum-stat-lbl { font-size: 5.5pt; color: #555; text-transform: uppercase; }

  .sum-two-col { display: flex !important; gap: 6pt; margin-bottom: 3pt; }
  .sum-two-col > div { flex: 1; }
  .sum-col-title { font-size: 6.5pt; font-weight: 700; color: #1a3d18; text-transform: uppercase; margin-bottom: 2pt; border-bottom: 0.5pt solid #2d6127; padding-bottom: 1pt; }

  .sum-breakdown-table { width: 100%; border-collapse: collapse; font-size: 6pt; }
  .sum-breakdown-table th { background: #e8f5e9 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color: #1a3d18; font-weight: 600; padding: 1.5pt 3pt; border: 0.4pt solid #ccc; }
  .sum-breakdown-table td { padding: 1.5pt 3pt; border: 0.4pt solid #ddd; }

  /* Full data table */
  .sum-data-table { width: 100%; border-collapse: collapse; font-size: 5.5pt; margin-top: 2pt; }
  .sum-data-table th {
    background: #3b8132 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
    color: #fff !important; font-weight: 600; padding: 2pt 3pt;
    border: 0.4pt solid #2d6127; text-align: center; white-space: nowrap;
  }
  /* COST CENTER parent header */
  .cost-center-th {
    background: #2d6127 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    letter-spacing: 0.5px;
  }
  /* PER DIEM / FUEL child headers */
  .cost-child-th {
    background: #4a9e40 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    font-size: 5pt !important;
  }
  .sum-data-table td { padding: 1.5pt 3pt; border: 0.4pt solid #ddd; vertical-align: top; word-break: break-word; }
  .sum-data-table tbody tr:nth-child(even) td { background: #f0f7ee !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .sum-data-table tbody tr { page-break-inside: avoid !important; break-inside: avoid !important; }

  /* Signature */
  .pow-sig-block { display: flex !important; justify-content: space-around; margin-top: 10pt; padding-top: 4pt; page-break-inside: avoid; break-inside: avoid; }
  .pow-sig-item { text-align: center; width: 38%; }
  .pow-sig-line { border-top: 0.75pt solid #000; margin-bottom: 2pt; }
  .pow-sig-name { font-size: 7.5pt; font-weight: 700; }
  .pow-sig-role { font-size: 6.5pt; color: #555; }
}
</style>