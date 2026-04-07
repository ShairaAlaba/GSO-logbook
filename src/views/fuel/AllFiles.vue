<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1>Fuel &amp; Oil Withdrawal — All Files Record</h1>
        <div class="breadcrumb">Vehicle Records → Fuel &amp; Oil → All Files</div>
      </div>
      <router-link to="/fuel/create" class="btn btn-primary">+ Create New Record</router-link>
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
        <div class="card-body" style="text-align:center;padding:40px;color:#9ca3af;">No records found.</div>
      </div>
      <div v-for="rec in filteredRecords" :key="rec.id" class="record-card">
        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span>{{ rec.month }}</span><span>{{ rec.year }}</span>
              <span>{{ nonEmptyRows(rec).length }} entries</span><span>{{ rec.recordedBy }}</span>
            </div>
          </div>
          <div class="record-card-actions">
            <button v-if="!editingId[rec.id]" class="btn btn-warning btn-sm" @click.stop="startEdit(rec)">Edit</button>
            <button v-else class="btn btn-success btn-sm" @click.stop="saveEdit(rec)">Save</button>
            <button v-if="editingId[rec.id]" class="btn btn-secondary btn-sm" @click.stop="cancelEdit(rec)">Cancel</button>
            <button v-if="!editingId[rec.id]" class="btn btn-danger btn-sm" @click.stop="confirmDelete(rec)">Delete</button>
            <button class="btn btn-success btn-sm" @click.stop="printRecord(rec.id)">Print</button>
            <button class="btn btn-secondary btn-sm" @click.stop="toggleRecord(rec.id)">{{ openRecords[rec.id] ? '▲ Collapse' : '▼ Expand' }}</button>
          </div>
        </div>
        <div class="record-card-body" :class="{ open: openRecords[rec.id] }">
          <ExcelTable :headers="rec.headers" :model-value="editingId[rec.id] ? draftRows[rec.id] : rec.rows" :editable="!!editingId[rec.id]" @update:model-value="val => draftRows[rec.id] = val" />
        </div>
      </div>
    </div>

    <!-- PRINT VIEW -->
    <div v-for="rec in filteredRecords" :key="'p-' + rec.id" class="pow-print-doc">
      <div class="pow-letterhead">
        <img src="/1.png" alt="CSU Logo" class="pow-logo" />
        
        <img src="/2.png" alt="Bagong Pilipinas" class="pow-logo" />
      </div>
      <div class="pow-doc-title-bar">FUEL &amp; OIL WITHDRAWAL LOG BOOK</div>

      <table class="pow-summary-table">
        <tr><td class="pst-label">Logbook Title</td><td class="pst-value" colspan="3">{{ rec.title }}</td></tr>
        <tr>
          <td class="pst-label">Month</td><td class="pst-value">{{ rec.month }}</td>
          <td class="pst-label">Year</td><td class="pst-value">{{ rec.year }}</td>
        </tr>
        <tr>
          <td class="pst-label">Recorded By</td><td class="pst-value">{{ rec.recordedBy }}</td>
          <td class="pst-label">Date Printed</td><td class="pst-value">{{ today }}</td>
        </tr>
      </table>

      <div class="sum-section-title">RECORD SUMMARY</div>

      <div class="sum-stat-bar">
        <div class="sum-stat"><div class="sum-stat-num">{{ nonEmptyRows(rec).length }}</div><div class="sum-stat-lbl">Total Entries</div></div>
        <div class="sum-stat"><div class="sum-stat-num">{{ totalFuel(rec) }}</div><div class="sum-stat-lbl">Total Liters</div></div>
        <div class="sum-stat"><div class="sum-stat-num">{{ uniqueVehicles(rec).length }}</div><div class="sum-stat-lbl">Vehicles</div></div>
        <div class="sum-stat"><div class="sum-stat-num">{{ uniqueDrivers(rec).length }}</div><div class="sum-stat-lbl">Drivers</div></div>
      </div>

      <div class="sum-two-col">
        <div>
          <div class="sum-col-title">Fuel by Vehicle</div>
          <table class="sum-breakdown-table">
            <thead><tr><th>Vehicle / Plate</th><th>Entries</th><th>Liters</th></tr></thead>
            <tbody>
              <tr v-for="v in vehicleBreakdown(rec)" :key="v.name">
                <td>{{ v.name || '—' }}</td>
                <td style="text-align:center">{{ v.entries }}</td>
                <td style="text-align:center">{{ v.liters }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="sum-col-title">Fuel by Driver</div>
          <table class="sum-breakdown-table">
            <thead><tr><th>Driver</th><th>Entries</th><th>Liters</th></tr></thead>
            <tbody>
              <tr v-for="d in driverFuelBreakdown(rec)" :key="d.name">
                <td>{{ d.name || '—' }}</td>
                <td style="text-align:center">{{ d.entries }}</td>
                <td style="text-align:center">{{ d.liters }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sum-section-title" style="margin-top:6pt;">COMPLETE FUEL &amp; OIL RECORDS</div>

      <table class="sum-data-table">
        <thead><tr><th v-for="(h,hi) in rec.headers" :key="hi">{{ h }}</th></tr></thead>
        <tbody>
          <tr v-for="(row,ri) in nonEmptyRows(rec)" :key="ri">
            <td v-for="(cell,ci) in row" :key="ci">{{ cell }}</td>
          </tr>
        </tbody>
      </table>

      <div class="pow-sig-block">
        <div class="pow-sig-item"><div class="pow-sig-line"></div><div class="pow-sig-name">ACE-ME CASIÑO</div><div class="pow-sig-role">Prepared By</div></div>
        <div class="pow-sig-item"><div class="pow-sig-line"></div><div class="pow-sig-name">ENGR. MARIA M. DELO</div><div class="pow-sig-role">Approved By</div></div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <div class="modal-box">
          <div class="modal-icon">⚠️</div>
          <div class="modal-title">Delete Record?</div>
          <div class="modal-body">You are about to permanently delete:<br><strong>{{ deleteTarget.title }}</strong><br><br>This cannot be undone.</div>
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

const store = useLogbookStore()
const search = ref(''); const filterYear = ref('')
const openRecords = reactive({}); const editingId = reactive({}); const draftRows = reactive({})
const deleteTarget = ref(null)
const today = new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' })
const years = computed(() => [...new Set(store.fuelRecords.map(r => r.year))].sort())
const filteredRecords = computed(() => store.fuelRecords.filter(rec => {
  const s = search.value.toLowerCase()
  return (!s || rec.title.toLowerCase().includes(s) || rec.rows.some(row => row.some(cell => String(cell).toLowerCase().includes(s))))
    && (!filterYear.value || rec.year === filterYear.value)
    && rec.rows.length > 0
}))

function nonEmptyRows(rec) { return rec.rows.filter(row => row.some(cell => String(cell).trim() !== '')) }

// Fuel headers from seedData: check actual column positions
// Typical: Date, Vehicle/Plate, Driver, Quantity(liters), etc.
// We'll do a best-effort: look for numeric columns for liters
function parseNum(v) { const n=parseFloat(String(v).replace(/,/g,'')); return isNaN(n)?0:n }

// Vehicle typically col 1 or 2, driver col 2 or 3, liters col 3 or 4
// We scan for the highest numeric column as "liters"
function fuelLitersCol(rec) {
  // Try to find a column named with "liter" or "qty" or "quantity"
  const hi = rec.headers.findIndex(h => /liter|qty|quantity|volume/i.test(h))
  return hi >= 0 ? hi : 3
}
function vehicleCol(rec) {
  const hi = rec.headers.findIndex(h => /vehicle|plate|unit/i.test(h))
  return hi >= 0 ? hi : 1
}
function driverColFuel(rec) {
  const hi = rec.headers.findIndex(h => /driver|operator/i.test(h))
  return hi >= 0 ? hi : 2
}

function totalFuel(rec) {
  const col = fuelLitersCol(rec)
  return nonEmptyRows(rec).reduce((s,r) => s + parseNum(r[col]), 0).toFixed(1)
}

function uniqueVehicles(rec) { return [...new Set(nonEmptyRows(rec).map(r=>r[vehicleCol(rec)]).filter(Boolean))] }
function uniqueDrivers(rec) { return [...new Set(nonEmptyRows(rec).map(r=>r[driverColFuel(rec)]).filter(Boolean))] }

function vehicleBreakdown(rec) {
  const lCol = fuelLitersCol(rec); const vCol = vehicleCol(rec)
  const m={}
  nonEmptyRows(rec).forEach(r => {
    const v=r[vCol]||''; if(!m[v]) m[v]={name:v,entries:0,liters:0}
    m[v].entries++; m[v].liters+=parseNum(r[lCol])
  })
  return Object.values(m).sort((a,b)=>b.liters-a.liters).map(x=>({...x,liters:x.liters.toFixed(1)}))
}

function driverFuelBreakdown(rec) {
  const lCol = fuelLitersCol(rec); const dCol = driverColFuel(rec)
  const m={}
  nonEmptyRows(rec).forEach(r => {
    const d=r[dCol]||''; if(!m[d]) m[d]={name:d,entries:0,liters:0}
    m[d].entries++; m[d].liters+=parseNum(r[lCol])
  })
  return Object.values(m).sort((a,b)=>b.liters-a.liters).map(x=>({...x,liters:x.liters.toFixed(1)}))
}

function toggleRecord(id) { openRecords[id]=!openRecords[id] }
function startEdit(rec) { draftRows[rec.id]=rec.rows.map(r=>[...r]); editingId[rec.id]=true; openRecords[rec.id]=true }
function saveEdit(rec) {
  const idx=store.fuelRecords.findIndex(r=>r.id===rec.id)
  if(idx!==-1) store.updateFuelRecord(idx,{...store.fuelRecords[idx],rows:draftRows[rec.id]})
  editingId[rec.id]=false
}
function cancelEdit(rec) { delete draftRows[rec.id]; editingId[rec.id]=false }
function confirmDelete(rec) { deleteTarget.value=rec }
function doDelete() {
  const idx=store.fuelRecords.findIndex(r=>r.id===deleteTarget.value.id)
  if(idx!==-1) store.deleteFuelRecord(idx)
  deleteTarget.value=null
}
function printRecord(id) { openRecords[id]=true; setTimeout(()=>window.print(),300) }
</script>

<style scoped>
.edit-notice{margin-top:8px;padding:8px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;font-size:12px;color:#92400e;}
.btn-warning{background:#9dc5a7;color:#000;border:1.5px solid #a4cfb2;}.btn-warning:hover{background:#77b892;}
.btn-danger{background:#ef4444;color:#fff;border:1.5px solid #dc2626;}.btn-danger:hover{background:#dc2626;}
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999;}
.modal-box{background:#fff;border-radius:12px;padding:32px 28px 24px;max-width:380px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.22);text-align:center;}
.modal-icon{font-size:36px;margin-bottom:10px;}.modal-title{font-size:17px;font-weight:700;color:#111827;margin-bottom:10px;}
.modal-body{font-size:13px;color:#4b5563;line-height:1.6;margin-bottom:22px;}.modal-actions{display:flex;gap:10px;justify-content:center;}
.pow-print-doc{display:none;}
@media print{
  @page{size:8.5in 13in;margin:8mm 10mm 10mm 10mm;}
  .no-print,.page-header,.page-content,.sidebar,.main-content>*:not(.pow-print-doc),.app-layout>aside,.record-card,.filter-bar,.modal-backdrop{display:none!important;}
  .app-layout,.main-content{display:block!important;width:100%!important;height:auto!important;overflow:visible!important;margin:0!important;padding:0!important;}
  .pow-print-doc{display:block!important;page-break-before:always;break-before:page;font-family:Arial,sans-serif;font-size:7pt;color:#000;background:#fff;width:100%;}
  .pow-print-doc:first-of-type{page-break-before:avoid;break-before:avoid;}
  .pow-letterhead{display:flex!important;align-items:center;justify-content:space-between;padding-bottom:3pt;border-bottom:1.5pt solid #2d6127;margin-bottom:3pt;}
  .pow-logo{height:36pt;width:auto;object-fit:contain;}
  .pow-lh-center{flex:1;text-align:center;}.pow-lh-university{font-size:11pt;font-weight:700;color:#1a3d18;text-transform:uppercase;}
  .pow-lh-office{font-size:8pt;color:#2d6127;font-weight:600;}
  .pow-doc-title-bar{background:#2d6127!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color:#fff!important;font-size:8pt;font-weight:700;text-align:center;padding:2pt 6pt;text-transform:uppercase;margin-bottom:3pt;}
  .pow-summary-table{width:100%;border-collapse:collapse;margin-bottom:4pt;font-size:6.5pt;}
  .pow-summary-table td{border:0.4pt solid #aaa;padding:1.5pt 4pt;}
  .pst-label{background:#e8f5e9!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;font-weight:600;width:18%;color:#1a3d18;}
  .pst-value{width:32%;}
  .sum-section-title{background:#3b8132!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color:#fff!important;font-size:7pt;font-weight:700;padding:2pt 5pt;margin:4pt 0 3pt;text-transform:uppercase;letter-spacing:0.5px;}
  .sum-stat-bar{display:flex!important;margin-bottom:4pt;border:0.4pt solid #ccc;}
  .sum-stat{flex:1;text-align:center;padding:3pt 2pt;border-right:0.4pt solid #ccc;}.sum-stat:last-child{border-right:none;}
  .sum-stat-num{font-size:12pt;font-weight:700;color:#2d6127;}.sum-stat-lbl{font-size:5.5pt;color:#555;text-transform:uppercase;}
  .sum-two-col{display:flex!important;gap:6pt;margin-bottom:3pt;}.sum-two-col>div{flex:1;}
  .sum-col-title{font-size:6.5pt;font-weight:700;color:#1a3d18;text-transform:uppercase;margin-bottom:2pt;border-bottom:0.5pt solid #2d6127;padding-bottom:1pt;}
  .sum-breakdown-table{width:100%;border-collapse:collapse;font-size:6pt;}
  .sum-breakdown-table th{background:#e8f5e9!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color:#1a3d18;font-weight:600;padding:1.5pt 3pt;border:0.4pt solid #ccc;}
  .sum-breakdown-table td{padding:1.5pt 3pt;border:0.4pt solid #ddd;}
  .sum-data-table{width:100%;border-collapse:collapse;font-size:5.5pt;margin-top:2pt;}
  .sum-data-table th{background:#3b8132!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color:#fff!important;font-weight:600;padding:2pt 3pt;border:0.4pt solid #2d6127;text-align:center;white-space:nowrap;}
  .sum-data-table td{padding:1.5pt 3pt;border:0.4pt solid #ddd;vertical-align:top;word-break:break-word;}
  .sum-data-table tbody tr:nth-child(even) td{background:#f0f7ee!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
  .sum-data-table tbody tr{page-break-inside:avoid!important;break-inside:avoid!important;}
  .pow-sig-block{display:flex!important;justify-content:space-around;margin-top:10pt;padding-top:4pt;page-break-inside:avoid;break-inside:avoid;}
  .pow-sig-item{text-align:center;width:38%;}.pow-sig-line{border-top:0.75pt solid #000;margin-bottom:2pt;}
  .pow-sig-name{font-size:7.5pt;font-weight:700;}.pow-sig-role{font-size:6.5pt;color:#555;}
}
</style>