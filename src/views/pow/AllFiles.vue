<template>
  <div>

    <!-- ══════════════════════════════════════
         SCREEN VIEW
    ══════════════════════════════════════ -->
    <div class="page-header no-print">
      <div>
        <h1>POW Monitoring — All Files Record</h1>
        <div class="breadcrumb">POW Monitoring → All Files</div>
      </div>
      <router-link to="/pow/create" class="btn btn-primary">+ Create New Record</router-link>
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
              <span>{{ rec.year }}</span>
              <span>{{ rec.rows.length }} rows</span>
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
            :model-value="editingId[rec.id] ? draftRows[rec.id] : rec.rows"
            :editable="!!editingId[rec.id]"
            @update:model-value="val => draftRows[rec.id] = val"
          />
          <div v-if="editingId[rec.id]" class="edit-notice">
            Editing mode — make your changes then click <strong>Save</strong>.
          </div>
        </div>
        <div class="signature-block">
          <div class="sig-item">
            <div class="sig-line"></div>
            <div class="sig-name">ACE-ME CASIÑO</div>
            <div class="sig-role">Prepared By</div>
          </div>
          <div class="sig-item">
            <div class="sig-line"></div>
            <div class="sig-name">ENGR. MARIA M. DELO</div>
            <div class="sig-role">Approved By</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         PRINT VIEW  (portrait, long bond)
    ══════════════════════════════════════ -->
    <div
      v-for="rec in filteredRecords"
      :key="'p-' + rec.id"
      class="pow-print-doc"
    >
      <!-- Letterhead -->
      <div class="pow-letterhead">
        <img src="/1.png" alt="CSU Logo" class="pow-logo" />
        
        <img src="/2.png" alt="Bagong Pilipinas" class="pow-logo" />
      </div>

      <div class="pow-doc-title-bar">
        PROGRAM OF WORKS (POW) MONITORING LOGBOOK
      </div>

      <!-- Record summary header -->
      <table class="pow-summary-table">
        <tr>
          <td class="pst-label">Logbook Title</td>
          <td class="pst-value" colspan="3">{{ rec.title }}</td>
        </tr>
        <tr>
          <td class="pst-label">Year</td>
          <td class="pst-value">{{ rec.year }}</td>
          <td class="pst-label">Total Entries</td>
          <td class="pst-value">{{ nonEmptyRows(rec).length }}</td>
        </tr>
        <tr>
          <td class="pst-label">Recorded By</td>
          <td class="pst-value">{{ rec.recordedBy }}</td>
          <td class="pst-label">Date Printed</td>
          <td class="pst-value">{{ today }}</td>
        </tr>
      </table>

      <!-- ── Entry cards ── -->
      <div
        v-for="(row, ri) in nonEmptyRows(rec)"
        :key="ri"
        class="pow-entry"
      >
        <!-- Entry title bar -->
        <div class="pow-entry-titlebar">
          <span class="pow-entry-num">No. {{ ri + 1 }}</span>
          <span class="pow-entry-tab">Tabbing: {{ row[0] || '—' }}</span>
          <span class="pow-entry-powno">POW No.: {{ row[1] || '—' }}</span>
        </div>

        <!-- POW Title (full width, can be long) -->
        <div class="pow-entry-fullrow" v-if="row[10]">
          <span class="pow-fl">POW Title</span>
          <span class="pow-fv">{{ row[10] }}</span>
        </div>
        <div class="pow-entry-fullrow" v-if="row[8]">
          <span class="pow-fl">Specifics</span>
          <span class="pow-fv">{{ row[8] }}</span>
        </div>

        <!-- Two-column detail grid -->
        <div class="pow-entry-grid">
          <!-- LEFT column -->
          <div class="pow-col">
            <div class="pow-field">
              <span class="pow-fl">Online Request No.</span>
              <span class="pow-fv">{{ row[2] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">QR Code</span>
              <span class="pow-fv">{{ row[3] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Date Request</span>
              <span class="pow-fv">{{ row[4] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Requisitioner</span>
              <span class="pow-fv">{{ row[5] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Contact No.</span>
              <span class="pow-fv">{{ row[6] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">College / Dept / Unit</span>
              <span class="pow-fv">{{ row[7] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Type of Requisitioner</span>
              <span class="pow-fv">{{ row[19] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Prepared By</span>
              <span class="pow-fv">{{ row[9] || '—' }}</span>
            </div>
          </div>

          <!-- RIGHT column -->
          <div class="pow-col">
            <div class="pow-field">
              <span class="pow-fl">Revision No.</span>
              <span class="pow-fv">{{ row[16] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Source of Fund</span>
              <span class="pow-fv">{{ row[17] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Account Code</span>
              <span class="pow-fv">{{ row[18] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Date Started</span>
              <span class="pow-fv">{{ row[20] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Date Completed</span>
              <span class="pow-fv">{{ row[21] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Date Returned</span>
              <span class="pow-fv">{{ row[22] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Received By</span>
              <span class="pow-fv">{{ row[23] || '—' }}</span>
            </div>
            <div class="pow-field">
              <span class="pow-fl">Date Approved</span>
              <span class="pow-fv">{{ row[24] || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Cost breakdown (full width) -->
        <div class="pow-cost-bar">
          <div class="pow-cost-item">
            <span class="pow-cost-label">Equipment</span>
            <span class="pow-cost-value">{{ formatAmt(row[11]) }}</span>
          </div>
          <div class="pow-cost-item">
            <span class="pow-cost-label">Labor</span>
            <span class="pow-cost-value">{{ formatAmt(row[12]) }}</span>
          </div>
          <div class="pow-cost-item">
            <span class="pow-cost-label">Materials</span>
            <span class="pow-cost-value">{{ formatAmt(row[13]) }}</span>
          </div>
          <div class="pow-cost-item">
            <span class="pow-cost-label">Sub-Total Indirect</span>
            <span class="pow-cost-value">{{ formatAmt(row[14]) }}</span>
          </div>
          <div class="pow-cost-item pow-cost-total">
            <span class="pow-cost-label">Appropriation Cost</span>
            <span class="pow-cost-value">{{ formatAmt(row[15]) }}</span>
          </div>
        </div>
      </div><!-- /entry -->

      <!-- Signature block -->
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

const today = new Date().toLocaleDateString('en-PH', {
  year: 'numeric', month: 'long', day: 'numeric'
})

const years = computed(() =>
  [...new Set(store.powRecords.map(r => r.year))].sort()
)

const filteredRecords = computed(() =>
  store.powRecords.filter(rec => {
    const s = search.value.toLowerCase()
    const matchSearch = !s || rec.title.toLowerCase().includes(s) ||
      rec.rows.some(row => row.some(cell => String(cell).toLowerCase().includes(s)))
    const matchYear = !filterYear.value || rec.year === filterYear.value
    return matchSearch && matchYear && rec.rows.length > 0
  })
)

// Only rows that have at least one non-empty cell
function nonEmptyRows(rec) {
  return rec.rows.filter(row => row.some(cell => String(cell).trim() !== ''))
}

function formatAmt(val) {
  if (!val || String(val).trim() === '') return '—'
  const n = parseFloat(String(val).replace(/,/g, ''))
  if (isNaN(n)) return val
  return '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function toggleRecord(id) { openRecords[id] = !openRecords[id] }

function startEdit(rec) {
  draftRows[rec.id]   = rec.rows.map(r => [...r])
  editingId[rec.id]   = true
  openRecords[rec.id] = true
}

function saveEdit(rec) {
  const idx = store.powRecords.findIndex(r => r.id === rec.id)
  if (idx !== -1) store.updatePowRecord(idx, { ...store.powRecords[idx], rows: draftRows[rec.id] })
  editingId[rec.id] = false
}

function cancelEdit(rec) {
  delete draftRows[rec.id]
  editingId[rec.id] = false
}

function confirmDelete(rec) { deleteTarget.value = rec }
function doDelete() {
  const idx = store.powRecords.findIndex(r => r.id === deleteTarget.value.id)
  if (idx !== -1) store.deletePowRecord(idx)
  deleteTarget.value = null
}

function printRecord(id) {
  openRecords[id] = true
  setTimeout(() => window.print(), 300)
}
</script>

<style scoped>
/* ── Screen ── */
.edit-notice {
  margin-top: 8px; padding: 8px 14px;
  background: #fffbeb; border: 1px solid #fde68a;
  border-radius: 6px; font-size: 12px; color: #92400e;
}
.btn-warning { background: #9dc5a7; color: #000; border: 1.5px solid #a4cfb2; }
.btn-warning:hover { background: #77b892; border-color: #accfaf; }
.btn-danger  { background: #ef4444; color: #fff; border: 1.5px solid #dc2626; }
.btn-danger:hover  { background: #dc2626; border-color: #b91c1c; }
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-box {
  background: #fff; border-radius: 12px; padding: 32px 28px 24px;
  max-width: 380px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.22); text-align: center;
}
.modal-icon  { font-size: 36px; margin-bottom: 10px; }
.modal-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.modal-body  { font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 22px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }

/* ── Hide print doc on screen ── */
.pow-print-doc { display: none; }

/* ════════════════════════════════════════
   PRINT STYLES
   Portrait long bond — 4 entries/page
════════════════════════════════════════ */
@media print {

  /* ①  Page size: portrait long bond */
  @page {
    size: 8.5in 13in;
    margin: 8mm 10mm 10mm 10mm;
  }

  /* ②  Hide all screen-only elements */
  .no-print,
  .page-header,
  .page-content,
  .sidebar,
  .record-card,
  .filter-bar,
  .modal-backdrop,
  .app-layout > aside,
  .main-content > *:not(.pow-print-doc) {
    display: none !important;
  }

  /* Layout wrappers must be block so print-docs flow */
  .app-layout,
  .main-content {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* ③  Show print documents */
  .pow-print-doc {
    display: block !important;
    page-break-before: always;
    break-before: page;
    font-family: Arial, sans-serif;
    font-size: 7pt;
    color: #000;
    background: #fff;
    width: 100%;
  }

  .pow-print-doc:first-of-type {
    page-break-before: avoid;
    break-before: avoid;
  }

  /* ── Letterhead ── */
  .pow-letterhead {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 3pt;
    border-bottom: 1.5pt solid #2d6127;
    margin-bottom: 3pt;
  }

  .pow-logo { height: 36pt; width: auto; object-fit: contain; }

  /* ── Document title bar ── */
  .pow-doc-title-bar {
    background: #2d6127 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color: #fff !important;
    font-size: 8pt;
    font-weight: 700;
    text-align: center;
    padding: 2pt 6pt;
    text-transform: uppercase;
    margin-bottom: 3pt;
  }

  /* ── Record summary table ── */
  .pow-summary-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4pt;
    font-size: 6.5pt;
  }

  .pow-summary-table td { border: 0.4pt solid #aaa; padding: 1.5pt 4pt; }

  .pst-label {
    background: #e8f5e9 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    font-weight: 600;
    width: 18%;
    color: #1a3d18;
  }

  .pst-value { width: 32%; }

  /* ════════════════════════════════════
     ENTRY CARD — 4 per portrait page
  ════════════════════════════════════ */
  .pow-entry {
    border: 0.5pt solid #2d6127;
    margin-bottom: 4pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pow-entry-titlebar {
    display: flex !important;
    align-items: center;
    gap: 8pt;
    background: #3b8132 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color: #fff !important;
    padding: 2pt 5pt;
    font-size: 7pt;
    font-weight: 700;
  }

  .pow-entry-num  { font-size: 6.5pt; opacity: 0.85; }
  .pow-entry-tab  { font-size: 7pt; }
  .pow-entry-powno { font-size: 7pt; margin-left: auto; }

  .pow-entry-fullrow {
    display: flex !important;
    border-bottom: 0.4pt solid #ccc;
  }

  .pow-fl {
    width: 18%;
    min-width: 18%;
    padding: 1.5pt 4pt;
    font-weight: 600;
    font-size: 6pt;
    color: #1a3d18;
    background: #f0f7ee !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    border-right: 0.4pt solid #ccc;
  }

  .pow-fv {
    flex: 1;
    padding: 1.5pt 4pt;
    font-size: 6.5pt;
    word-break: break-word;
  }

  .pow-entry-grid {
    display: flex !important;
    border-bottom: 0.4pt solid #ccc;
  }

  .pow-col { flex: 1; border-right: 0.4pt solid #ccc; }
  .pow-col:last-child { border-right: none; }

  .pow-field {
    display: flex !important;
    border-bottom: 0.4pt solid #eee;
  }

  .pow-field:last-child { border-bottom: none; }

  .pow-entry-grid .pow-fl { width: 46%; min-width: 46%; font-size: 5.5pt; }
  .pow-entry-grid .pow-fv { font-size: 6pt; }

  .pow-cost-bar {
    display: flex !important;
    background: #f0f7ee !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    padding: 1.5pt 3pt;
  }

  .pow-cost-item {
    flex: 1;
    padding: 1pt 3pt;
    text-align: center;
    border-right: 0.4pt solid #ccc;
  }

  .pow-cost-item:last-child { border-right: none; }

  .pow-cost-total {
    font-weight: 700;
    background: #d4edda !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .pow-cost-label { display: block; font-size: 5pt; color: #555; text-transform: uppercase; }
  .pow-cost-value { display: block; font-size: 6.5pt; font-weight: 600; color: #1a3d18; }

  /* ── Signature block ── */
  .pow-sig-block {
    display: flex !important;
    justify-content: space-around;
    margin-top: 10pt;
    padding-top: 4pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pow-sig-item { text-align: center; width: 38%; }
  .pow-sig-line { border-top: 0.75pt solid #000; margin-bottom: 2pt; }
  .pow-sig-name { font-size: 7.5pt; font-weight: 700; }
  .pow-sig-role { font-size: 6.5pt; color: #555; }
}
</style>