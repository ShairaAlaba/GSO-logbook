// FUEL & OIL — All Files Record

<template>
  <div>

    <!-- ══ PAGE HEADER ══ -->
    <div class="page-header no-print">
      <div>
        <h1>Fuel &amp; Oil — All Files Record</h1>
        <div class="breadcrumb">Fuel &amp; Oil Withdrawal → All Files</div>
      </div>
      <router-link to="/fuel/create" class="btn btn-primary">+ Create New Record</router-link>
    </div>

    <!-- ══ TAB BAR ══ -->
    <div class="tab-bar no-print">
      <button :class="['tab-btn', activeTab==='logbook'?'tab-active':'']" @click="activeTab='logbook'">📋 Fuel Logbook</button>
      <button :class="['tab-btn', activeTab==='withdrawal'?'tab-active':'']" @click="activeTab='withdrawal'">📄 Withdrawal Slip</button>
    </div>

    <!-- ════════════════════════════════════════
         TAB 1 — FUEL LOGBOOK
    ════════════════════════════════════════ -->
    <div v-show="activeTab==='logbook'" class="page-content no-print">
      <div class="filter-bar">
        <input class="form-control search-input" v-model="search" placeholder="Search records..." @keyup.enter="doSearch" />
        <select class="form-control" v-model="filterYear">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <select class="form-control" v-model="filterMonth">
          <option value="">All Months</option>
          <option v-for="m in monthOptions" :key="m" :value="m">{{ m }}</option>
        </select>
        <button class="btn btn-primary" @click="doSearch">Display</button>
        <button v-if="search||filterYear||filterMonth" class="btn btn-secondary" @click="clearSearch">Clear</button>
      </div>

      <div v-if="filteredRecords.length===0" class="card">
        <div class="card-body" style="text-align:center;padding:40px;color:#9ca3af;">No records found.</div>
      </div>

      <div v-for="rec in filteredRecords" :key="rec.id" class="record-card">
        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span>{{ rec.month }}</span><span>{{ rec.year }}</span>
              <span>{{ nonEmptyRows(rec).length }} entries</span>
              <span>{{ rec.recordedBy }}</span>
            </div>
          </div>
          <div class="record-card-actions">
            <button v-if="!editingId[rec.id]" class="btn btn-warning btn-sm" @click.stop="startEdit(rec)">Edit</button>
            <button v-else class="btn btn-success btn-sm" @click.stop="saveEdit(rec)">Save</button>
            <button v-if="editingId[rec.id]" class="btn btn-secondary btn-sm" @click.stop="cancelEdit(rec)">Cancel</button>
            <button v-if="!editingId[rec.id]" class="btn btn-danger btn-sm" @click.stop="confirmDelete(rec)">Delete</button>
            <button class="btn btn-success btn-sm" @click.stop="printLogbook(rec.id)">🖨 Print Logbook</button>
            <button class="btn btn-secondary btn-sm" @click.stop="toggleRecord(rec.id)">{{ openRecords[rec.id]?'▲ Collapse':'▼ Expand' }}</button>
          </div>
        </div>
        <div class="record-card-body" :class="{open:openRecords[rec.id]}">
          <ExcelTable
            :headers="rec.headers"
            :model-value="editingId[rec.id]?draftRows[rec.id]:rec.rows"
            :editable="!!editingId[rec.id]"
            @update:model-value="val=>draftRows[rec.id]=val"
          />
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════
         TAB 2 — WITHDRAWAL SLIP
    ════════════════════════════════════════ -->
    <div v-show="activeTab==='withdrawal'" class="page-content no-print">

      <!-- FORM -->
      <div class="ws-card">
        <div class="ws-card-header">
          <div class="ws-card-title">📄 Withdrawal Slip Entry</div>
          <div class="ws-card-sub">Fill in the details below. The live preview updates as you type.</div>
        </div>
        <div class="ws-card-body">
          <div class="ws-grid3">
            <div class="form-group">
              <label class="form-label">Control No. *</label>
              <input class="form-control" v-model="slip.controlNo" placeholder="e.g. 635" />
            </div>
            <div class="form-group">
              <label class="form-label">Date *</label>
              <input type="date" class="form-control" v-model="slip.date" />
            </div>
            <div class="form-group">
              <label class="form-label">Charge Against *</label>
              <input class="form-control" v-model="slip.chargeAgainst" placeholder="e.g. IGF-OTHER INCOME" />
            </div>
          </div>
          <div class="ws-grid3">
            <div class="form-group">
              <label class="form-label">QTY *</label>
              <input class="form-control" v-model="slip.qty" placeholder="e.g. 20 or FULL TANK" />
            </div>
            <div class="form-group">
              <label class="form-label">Unit</label>
              <select class="form-control" v-model="slip.unit">
                <option value="">— none —</option>
                <option>LTRS.</option><option>LITERS</option><option>GALLONS</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Particular *</label>
              <select class="form-control" v-model="slip.particular">
                <option value="">— select —</option>
                <option>DIESEL</option><option>GASOLINE</option>
                <option>MOTOR OIL</option><option>BRAKE FLUID</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Purpose *</label>
            <textarea class="form-control" v-model="slip.purpose" rows="2" placeholder="e.g. Fetch and ferry of CSU personnel for the Family Day"></textarea>
          </div>
          <div class="ws-sig-section">
            <div class="ws-sig-label">Signatories</div>
            <div class="ws-grid2">
              <div class="form-group">
                <label class="form-label">University President</label>
                <input class="form-control" v-model="slip.president" placeholder="e.g. DR. ROLYN C. DAGUIL" />
              </div>
              <div class="form-group">
                <label class="form-label">Approving Officer</label>
                <input class="form-control" v-model="slip.approvingOfficer" placeholder="e.g. ENGR. MARIEL M. DELO" />
              </div>
              <div class="form-group">
                <label class="form-label">Requisitioner</label>
                <input class="form-control" v-model="slip.requisitioner" placeholder="e.g. RODRIGO P. VILLA" />
              </div>
              <div class="form-group">
                <label class="form-label">Issuing Officer</label>
                <input class="form-control" v-model="slip.issuingOfficer" placeholder="e.g. ESMERALDO C. CATIPAN" />
              </div>
            </div>
          </div>
        </div>
        <div class="ws-card-footer">
          <button class="btn btn-secondary" @click="clearSlip">🗑 Clear</button>
        </div>
      </div>

      <!-- LIVE PREVIEW — matches print output exactly -->
      <div class="preview-label">Live Preview</div>
      <div class="preview-wrap">
        <div class="preview-inner">
          <div class="slip-doc">

            <!-- LETTERHEAD -->
            <div class="sd-letterhead">
              <div class="sd-lh-left">
                <img src="/1.png" alt="CSU Logo" class="sd-lh-img-left" />
              </div>
              <div class="sd-lh-right">
                <img src="/2.png" alt="Accreditation Logos" class="sd-lh-img-right" />
              </div>
            </div>

            <div class="sd-title">WITHDRAWAL SLIP</div>
            <div class="sd-subtitle">Gasoline / Crude Fuel / Motor Oil / Brake Fluid</div>
            <div class="sd-meta-row">
              <div class="sd-meta-left"><span class="sd-meta-label">Date:</span> <span class="sd-underline">{{ formatDate(slip.date) }}</span></div>
              <div class="sd-meta-right"><span class="sd-meta-label">Control No.:</span> <span class="sd-val">{{ slip.controlNo || '___' }}</span></div>
            </div>
            <div class="sd-charge-row"><span class="sd-meta-label">Charge Against:</span> <span class="sd-underline sd-underline-wide">{{ slip.chargeAgainst || '_______________' }}</span></div>
            <table class="sd-table">
              <thead><tr><th class="sd-qty">QTY</th><th class="sd-unit">UNIT</th><th class="sd-part">PARTICULAR</th><th class="sd-purp">PURPOSE</th></tr></thead>
              <tbody><tr>
                <td class="sd-qty sd-center sd-bold">{{ slip.qty }}</td>
                <td class="sd-unit sd-center sd-bold">{{ slip.unit }}</td>
                <td class="sd-part sd-center sd-bold">{{ slip.particular }}</td>
                <td class="sd-purp sd-bold">{{ slip.purpose }}</td>
              </tr></tbody>
            </table>
            <div class="sd-note">*No. of Liters withdrawn should be reflected in the account charge receipt.</div>

            <!-- Signature block: professional centered layout -->
            <div class="sd-sig-section">

              <!-- Row A: Authorized by (centered) -->
              <div class="sd-sig-auth-row">
                <div class="sd-sig-auth-block">
                  <div class="sd-sig-label-line">Authorized by:</div>
                  <div class="sd-sig-space"></div>
                  <div class="sd-sig-name sd-sig-name-underline">{{ slip.president || 'DR. _______________' }}</div>
                  <div class="sd-sig-role">University President</div>
                </div>
              </div>

              <!-- Row B: For and in behalf label + Approving Officer (centered) -->
              <div class="sd-sig-behalf-row">
                <div class="sd-sig-auth-block">
                  <div class="sd-sig-label-line">For and in behalf of the President:</div>
                  <div class="sd-sig-space"></div>
                  <div class="sd-sig-name sd-sig-name-underline">{{ slip.approvingOfficer || '_______________' }}</div>
                  <div class="sd-sig-role">Approving Officer</div>
                </div>
              </div>

              <!-- Divider -->
              <div class="sd-sig-divider"></div>

              <!-- Row C: Requisitioner | (gap) | Issuing Officer -->
              <div class="sd-sig-bottom-row">
                <div class="sd-sig-col sd-sig-col-center-all">
                  <div class="sd-sig-space"></div>
                  <div class="sd-sig-name sd-sig-name-underline">{{ slip.requisitioner || '_______________' }}</div>
                  <div class="sd-sig-role">Requisitioner</div>
                </div>
                <div class="sd-sig-col sd-sig-col-center-all">
                  <div class="sd-sig-space"></div>
                  <div class="sd-sig-name sd-sig-name-underline">{{ slip.issuingOfficer || '_______________' }}</div>
                  <div class="sd-sig-role">Issuing Officer</div>
                </div>
              </div>
            </div>

            <!-- Print button inside the preview card -->
            <div class="sd-print-btn-row no-print">
              <button class="btn btn-primary sd-print-btn" @click="printSlip">🖨 Print</button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget=null">
      <div class="modal-box">
        <div class="modal-icon">🗑️</div>
        <div class="modal-title">Delete Record?</div>
        <div class="modal-body">This will permanently delete <strong>{{ deleteTarget.title }}</strong>.</div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="deleteTarget=null">Cancel</button>
          <button class="btn btn-danger" @click="doDelete">Delete</button>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════
         PRINT ONLY: FUEL LOGBOOK
    ════════════════════════════════════════ -->
    <div v-for="rec in filteredRecords" :key="'p-'+rec.id" class="fuel-print-logbook" :data-print-id="rec.id">
      <div class="pow-letterhead">
        <div class="pow-lh-republic">Republic of the Philippines</div>
        <div class="pow-lh-university">Caraga State University</div>
        <div class="pow-lh-office">General Services Office</div>
        <div class="pow-lh-address">Ampayon, Butuan City, Caraga Region</div>
      </div>
      <div class="pow-doc-title-bar">Fuel &amp; Oil Withdrawal Log — {{ rec.title }}</div>
      <table class="pow-summary-table">
        <tr>
          <td class="pst-label">Year</td><td class="pst-value">{{ rec.year }}</td>
          <td class="pst-label">Month</td><td class="pst-value">{{ rec.month }}</td>
          <td class="pst-label">Entries</td><td class="pst-value">{{ nonEmptyRows(rec).length }}</td>
          <td class="pst-label">Recorded By</td><td class="pst-value">{{ rec.recordedBy }}</td>
        </tr>
      </table>
      <div class="sum-section-title">Full Withdrawal Log</div>
      <table class="fuel-data-table">
        <thead><tr><th v-for="h in rec.headers" :key="h">{{ h }}</th></tr></thead>
        <tbody>
          <tr v-for="(row,ri) in nonEmptyRows(rec)" :key="ri">
            <td v-for="(cell,ci) in row" :key="ci">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'
import ExcelTable from '../../components/ExcelTable.vue'

const store = useLogbookStore()
const activeTab = ref('logbook')

// ── Logbook ──
const search = ref(''), filterYear = ref(''), filterMonth = ref('')
const openRecords = reactive({}), editingId = reactive({}), draftRows = reactive({})
const deleteTarget = ref(null)
const activeSearch = ref(''), activeYear = ref(''), activeMonth = ref('')
const monthOptions = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
const years = computed(() => [...new Set(store.fuelRecords.map(r => r.year))].sort())

function doSearch() {
  activeSearch.value = search.value; activeYear.value = filterYear.value; activeMonth.value = filterMonth.value
  filteredRecords.value.forEach(rec => { openRecords[rec.id] = true })
}
function clearSearch() {
  search.value=''; filterYear.value=''; filterMonth.value=''
  activeSearch.value=''; activeYear.value=''; activeMonth.value=''
}
const filteredRecords = computed(() =>
  store.fuelRecords.filter(rec => {
    const s = activeSearch.value.toLowerCase()
    const matchS = !s || rec.title.toLowerCase().includes(s) || rec.rows.some(r => r.some(c => String(c).toLowerCase().includes(s)))
    return matchS && (!activeYear.value||rec.year===activeYear.value) && (!activeMonth.value||rec.month===activeMonth.value) && rec.rows.length>0
  })
)
function nonEmptyRows(rec) { return rec.rows.filter(row => row.some(c => String(c).trim()!=='')) }
function toggleRecord(id) { openRecords[id] = !openRecords[id] }
function startEdit(rec) { draftRows[rec.id]=rec.rows.map(r=>[...r]); editingId[rec.id]=true; openRecords[rec.id]=true }
function saveEdit(rec) { const i=store.fuelRecords.findIndex(r=>r.id===rec.id); if(i!==-1) store.updateFuelRecord(i,{...store.fuelRecords[i],rows:draftRows[rec.id]}); editingId[rec.id]=false }
function cancelEdit(rec) { delete draftRows[rec.id]; editingId[rec.id]=false }
function confirmDelete(rec) { deleteTarget.value=rec }
function doDelete() { const i=store.fuelRecords.findIndex(r=>r.id===deleteTarget.value.id); if(i!==-1) store.deleteFuelRecord(i); deleteTarget.value=null }

function printLogbook(id) {
  openRecords[id]=true
  const s=document.createElement('style'); s.id='__pts__'
  s.textContent=`@media print{.fuel-print-logbook:not([data-print-id="${id}"]){display:none!important}.withdrawal-slip-print{display:none!important}}`
  document.head.appendChild(s)
  setTimeout(()=>{ window.print(); setTimeout(()=>document.getElementById('__pts__')?.remove(),500) },300)
}

// ── Withdrawal Slip ──
const slip = reactive({
  controlNo:'', date: new Date().toISOString().split('T')[0],
  chargeAgainst:'', qty:'', unit:'', particular:'', purpose:'',
  president:'DR. ROLYN C. DAGUIL', approvingOfficer:'', requisitioner:'', issuingOfficer:''
})
function clearSlip() {
  Object.assign(slip,{ controlNo:'', date:new Date().toISOString().split('T')[0],
    chargeAgainst:'', qty:'', unit:'', particular:'', purpose:'',
    president:'DR. ROLYN C. DAGUIL', approvingOfficer:'', requisitioner:'', issuingOfficer:'' })
}
function formatDate(d) {
  if(!d) return '___________'
  return new Date(d+'T00:00:00').toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})
}
function printSlip() {
  if(!slip.controlNo||!slip.qty||!slip.particular||!slip.purpose) {
    alert('Please fill in Control No., QTY, Particular, and Purpose before printing.'); return
  }

  const date = formatDate(slip.date)
  const slipHtml = (copy) => `
    <div class="slip-doc">
      <div class="sd-letterhead">
        <div class="sd-lh-left"><img src="/1.png" class="sd-lh-img-left" /></div>
        <div class="sd-lh-right"><img src="/2.png" class="sd-lh-img-right" /></div>
      </div>
      <div class="sd-title">WITHDRAWAL SLIP</div>
      <div class="sd-subtitle">Gasoline / Crude Fuel / Motor Oil / Brake Fluid</div>
      <div class="sd-meta-row">
        <div class="sd-meta-left"><span class="sd-meta-label">Date:</span> <span class="sd-underline">${date}</span></div>
        <div class="sd-meta-right"><span class="sd-meta-label">Control No.:</span> <span class="sd-val">${slip.controlNo}</span></div>
      </div>
      <div class="sd-charge-row"><span class="sd-meta-label">Charge Against:</span> <span class="sd-underline sd-underline-wide">${slip.chargeAgainst}</span></div>
      <table class="sd-table">
        <thead><tr><th class="sd-qty">QTY</th><th class="sd-unit">UNIT</th><th class="sd-part">PARTICULAR</th><th class="sd-purp">PURPOSE</th></tr></thead>
        <tbody><tr>
          <td class="sd-qty sd-center sd-bold">${slip.qty}</td>
          <td class="sd-unit sd-center sd-bold">${slip.unit}</td>
          <td class="sd-part sd-center sd-bold">${slip.particular}</td>
          <td class="sd-purp sd-bold">${slip.purpose}</td>
        </tr></tbody>
      </table>
      <div class="sd-note">*No. of Liters withdrawn should be reflected in the account charge receipt.</div>
      <div class="sd-sig-section">
        <div class="sd-sig-auth-row">
          <div class="sd-sig-auth-block">
            <div class="sd-sig-label-line">Authorized by:</div>
            <div class="sd-sig-space"></div>
            <div class="sd-sig-name sd-sig-name-underline">${slip.president}</div>
            <div class="sd-sig-role">University President</div>
          </div>
        </div>
        <div class="sd-sig-behalf-row">
          <div class="sd-sig-auth-block">
            <div class="sd-sig-label-line">For and in behalf of the President:</div>
            <div class="sd-sig-space"></div>
            <div class="sd-sig-name sd-sig-name-underline">${slip.approvingOfficer}</div>
            <div class="sd-sig-role">Approving Officer</div>
          </div>
        </div>
        <div class="sd-sig-divider"></div>
        <div class="sd-sig-bottom-row">
          <div class="sd-sig-col sd-sig-col-center-all">
            <div class="sd-sig-space"></div>
            <div class="sd-sig-name sd-sig-name-underline">${slip.requisitioner}</div>
            <div class="sd-sig-role">Requisitioner</div>
          </div>
          <div class="sd-sig-col sd-sig-col-center-all">
            <div class="sd-sig-space"></div>
            <div class="sd-sig-name sd-sig-name-underline">${slip.issuingOfficer}</div>
            <div class="sd-sig-role">Issuing Officer</div>
          </div>
        </div>
      </div>
    </div>
  `

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Withdrawal Slip</title>
  <style>
    @page { size: 8.5in 13in portrait; margin: 6mm 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; background: #fff; }

    .slip-doc { width: 100%; padding: 4pt 0 4pt; }

    /* Letterhead */
    .sd-letterhead { display: flex; align-items: center; justify-content: space-between; padding-bottom: 2pt; }
    .sd-lh-left { flex-shrink: 0; }
    .sd-lh-img-left { width: 240pt; height: auto; }
    .sd-lh-right { flex-shrink: 0; }
    .sd-lh-img-right { width: 250pt; height: auto; }

    /* Slip body */
    .sd-title {
      text-align: center; font-size: 11.5pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: 2pt;
      margin-bottom: 0; padding: 3pt 0;
      border-top: 1.5pt solid #000; border-bottom: 1.5pt solid #000;
    }
    .sd-subtitle {
      text-align: center; font-size: 8pt; margin: 2pt 0 5pt;
      font-style: italic; color: #555;
    }
    .sd-val { font-weight: 700; }
    .sd-meta-row {
      display: flex; justify-content: space-between;
      font-size: 9pt; margin-bottom: 2pt; padding-bottom: 2pt;
    }
    .sd-meta-label { font-weight: 700; }
    .sd-charge-row { font-size: 9pt; margin-bottom: 5pt; }
    .sd-underline { border-bottom: 0.75pt solid #000; display: inline-block; min-width: 100pt; font-weight: 700; padding-bottom: 1pt; }
    .sd-underline-wide { min-width: 170pt; }

    .sd-table { width: 100%; border-collapse: collapse; margin-bottom: 3pt; font-size: 9pt; }
    .sd-qty  { width: 13%; } .sd-unit { width: 12%; } .sd-part { width: 15%; } .sd-purp { width: 60%; }
    .sd-table th {
      border: 0.75pt solid #5a8a5a;
      padding: 4pt 5pt; font-weight: 700;
      text-align: center;
      background: #E6EFE6 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5pt;
    }
    .sd-table td { border: 0.75pt solid #aaa; padding: 9pt 5pt; vertical-align: middle; }
    .sd-center { text-align: center; } .sd-bold { font-weight: 700; }

    .sd-note {
      font-size: 7.5pt; font-style: italic; padding: 2pt 5pt;
      margin-bottom: 6pt;
      border-left: 1.5pt solid #5a8a5a;
      background: #f7fbf7 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color: #333;
    }

    /* Signature section */
    .sd-sig-section { margin-top: 5pt; }
    .sd-sig-auth-row { display: flex; justify-content: center; margin-bottom: 1pt; }
    .sd-sig-behalf-row { display: flex; justify-content: center; margin-bottom: 1pt; margin-top: 4pt; }
    .sd-sig-auth-block { text-align: center; min-width: 180pt; }
    .sd-sig-bottom-row { display: flex; align-items: flex-start; justify-content: space-around; gap: 6pt; }
    .sd-sig-col { flex: 1; }
    .sd-sig-col-center-all { text-align: center; }
    .sd-sig-label-line { font-size: 7.5pt; margin-bottom: 0; color: #555; font-style: italic; }
    .sd-sig-space { height: 20pt; border-bottom: 0.75pt solid #000; margin: 0 16pt; }
    .sd-sig-name { font-size: 9pt; font-weight: 700; margin-bottom: 1pt; margin-top: 2pt; }
    .sd-sig-name-underline { text-decoration: none; }
    .sd-sig-role { font-size: 7.5pt; color: #444; }
    .sd-sig-divider { display: none; }

    /* Cut line between copies */
    .slip-cut {
      text-align: center; font-size: 7pt; color: #aaa;
      border-top: 0.75pt dashed #bbb;
      padding: 2pt 0; margin: 2pt 0;
      letter-spacing: 1pt;
    }
  </style>
  </head><body>
    ${slipHtml(1)}
    <div class="slip-cut">✂ &nbsp; COPY 2 &nbsp; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>
    ${slipHtml(2)}
  </body></html>`

  const w = window.open('', '_blank', 'width=900,height=700')
  w.document.write(html)
  w.document.close()
  w.onload = () => { w.focus(); w.print(); }
  // fallback if onload already fired
  setTimeout(() => { try { w.focus(); w.print() } catch(e){} }, 800)
}
</script>

<style scoped>
/* ── Tab bar ── */
.tab-bar { display:flex; border-bottom:2px solid #d1fae5; background:#fff; padding:0 20px; }
.tab-btn { padding:10px 22px; font-size:13px; font-weight:600; cursor:pointer; border:none; background:transparent; color:#6b7280; border-bottom:3px solid transparent; margin-bottom:-2px; transition:all 0.15s; }
.tab-btn:hover { color:#2d6127; }
.tab-active { color:#2d6127!important; border-bottom-color:#2d6127!important; background:#f0fdf4; }

/* ── Form card ── */
.ws-card { background:#fff; border-radius:10px; border:1px solid #d1fae5; box-shadow:0 2px 8px rgba(0,0,0,.06); margin-bottom:24px; }
.ws-card-header { padding:16px 20px 12px; border-bottom:1px solid #d1fae5; background:#f0fdf4; border-radius:10px 10px 0 0; }
.ws-card-title { font-size:15px; font-weight:700; color:#1a3d18; }
.ws-card-sub { font-size:12px; color:#6b7280; margin-top:2px; }
.ws-card-body { padding:20px; }
.ws-card-footer { padding:14px 20px; border-top:1px solid #e5e7eb; display:flex; justify-content:flex-end; gap:10px; background:#fafafa; border-radius:0 0 10px 10px; }
.ws-grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px; }
.ws-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.ws-sig-section { margin-top:16px; border-top:1px dashed #d1d5db; padding-top:14px; }
.ws-sig-label { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; }

/* ── Live preview wrapper ── */
.preview-label { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
.preview-wrap { background:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; padding:20px; display:flex; justify-content:center; margin-bottom:20px; }
.preview-inner { display:flex; flex-direction:column; align-items:center; gap:0; }

/* ── slip-doc: shared between preview and print ── */
.slip-doc { background:#fff; border:1px solid #aaa; padding:14px 18px 18px; width:900px; font-family:Arial,sans-serif; font-size:11px; box-shadow:0 2px 8px rgba(0,0,0,.12); }

/* ── Letterhead ── */
.sd-letterhead { display:flex; align-items:center; justify-content:space-between; padding-bottom:6px; }
.sd-lh-left { flex-shrink:0; }
.sd-lh-img-left { width:320px; height:auto; object-fit:contain; }
.sd-lh-right { flex-shrink:0; }
.sd-lh-img-right { width:330px; height:auto; object-fit:contain; }
.sd-lh-divider { display: none; }

/* ── In-slip print button ── */
.sd-print-btn-row { display:flex; justify-content:center; margin-top:16px; padding-top:12px; border-top:1px dashed #d1d5db; }
.sd-print-btn { padding:9px 28px; font-size:13px; font-weight:600; }

.sd-title { text-align:center; font-size:15px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:0; border-top:2px solid #000; border-bottom:2px solid #000; padding:4px 0; }
.sd-subtitle { text-align:center; font-size:9px; margin:3px 0 8px; font-style:italic; color:#555; }
.sd-meta-row { display:flex; justify-content:space-between; font-size:10px; margin-bottom:4px; padding-bottom:3px; }
.sd-meta-label { font-weight:700; }
.sd-charge-row { font-size:10px; margin-bottom:6px; }
.sd-control { text-align:right; font-size:10px; margin-bottom:2px; }
.sd-val { font-weight:700; }
.sd-row2 { display:flex; justify-content:space-between; font-size:10px; margin-bottom:6px; }
.sd-underline { border-bottom:1px solid #000; display:inline-block; min-width:100px; font-weight:700; padding-bottom:1px; }
.sd-underline-wide { min-width:180px; }

.sd-table { width:100%; border-collapse:collapse; margin-bottom:4px; font-size:10px; }
.sd-qty  { width:13%; } .sd-unit { width:12%; } .sd-part { width:15%; } .sd-purp { width:60%; }
.sd-table th { border:1px solid #5a8a5a; padding:4px 5px; font-weight:700; text-align:center; background:#E6EFE6; text-transform:uppercase; letter-spacing:0.5px; font-size:9px; }
.sd-table td { border:1px solid #aaa; padding:4px 5px; min-height:38px; vertical-align:middle; }
.sd-center { text-align:center; } .sd-bold { font-weight:700; }

.sd-note { font-size:9px; font-style:italic; border-left:2px solid #5a8a5a; padding:3px 6px; margin-bottom:12px; font-weight:700; background:#f7fbf7; color:#333; }

/* Signature section */
.sd-sig-section { margin-top:8px; }
.sd-sig-auth-row { display:flex; justify-content:center; margin-bottom:2px; }
.sd-sig-behalf-row { display:flex; justify-content:center; margin-bottom:2px; margin-top:8px; }
.sd-sig-auth-block { text-align:center; min-width:220px; }
.sd-sig-bottom-row { display:flex; align-items:flex-start; justify-content:space-around; gap:8px; }
.sd-sig-col { flex:1; }
.sd-sig-col-center-all { text-align:center; }
.sd-sig-label-line { font-size:9px; margin-bottom:0; color:#555; font-style:italic; }
.sd-sig-space { height:22px; border-bottom:1px solid #000; margin:0 20px; }
.sd-sig-name { font-size:10px; font-weight:700; margin-bottom:1px; margin-top:3px; }
.sd-sig-name-underline { text-decoration:none; }
.sd-sig-role { font-size:9px; color:#444; }
.sd-sig-divider { display: none; }

/* legacy kept for compat */
.sd-auth { font-size:10px; margin-bottom:2px; }
.sd-president { font-size:10px; font-weight:700; margin-bottom:0; }
.sd-role { font-size:10px; margin-bottom:2px; }
.sd-behalf { font-size:10px; margin-bottom:2px; }
.sd-approving { font-size:10px; font-weight:700; text-decoration:underline; margin-bottom:0; }
.sd-spacer { height:10px; }

/* ── Logbook record cards ── */
.btn-warning { background:#9dc5a7; color:#000; border:1.5px solid #a4cfb2; }
.btn-danger  { background:#ef4444; color:#fff; border:1.5px solid #dc2626; }
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:9999; }
.modal-box { background:#fff; border-radius:12px; padding:32px 28px 24px; max-width:380px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,.22); text-align:center; }
.modal-icon { font-size:36px; margin-bottom:10px; }
.modal-title { font-size:17px; font-weight:700; margin-bottom:10px; }
.modal-body { font-size:13px; color:#4b5563; margin-bottom:22px; }
.modal-actions { display:flex; gap:10px; justify-content:center; }

/* ── Hide print sections on screen ── */
.fuel-print-logbook { display:none; }

/* ════════════════ PRINT ════════════════ */
@media print {
  @page { size:A4 portrait; margin:10mm 12mm; }

  .no-print, .page-header, .tab-bar, .page-content, .modal-backdrop, .preview-print-btn-row { display:none!important; }
  .app-layout, .main-content { display:block!important; width:100%!important; margin:0!important; padding:0!important; }

  /* ── Logbook print ── */
  .fuel-print-logbook {
    display:block!important; page-break-before:always; break-before:page;
    font-family:Arial,sans-serif; font-size:7pt; color:#000; width:100%;
  }
  .fuel-print-logbook:first-of-type { page-break-before:avoid; break-before:avoid; }
  .pow-letterhead { text-align:center; padding-bottom:3pt; border-bottom:1.5pt solid #2d6127; margin-bottom:3pt; }
  .pow-lh-republic { font-size:7pt; color:#555; }
  .pow-lh-university { font-size:11pt; font-weight:700; color:#1a3d18; text-transform:uppercase; }
  .pow-lh-office { font-size:8pt; color:#2d6127; font-weight:600; }
  .pow-lh-address { font-size:6.5pt; color:#666; }
  .pow-doc-title-bar { background:#2d6127!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; color:#fff!important; font-size:8pt; font-weight:700; text-align:center; padding:2pt 6pt; text-transform:uppercase; margin-bottom:3pt; }
  .pow-summary-table { width:100%; border-collapse:collapse; margin-bottom:4pt; font-size:6.5pt; }
  .pow-summary-table td { border:0.4pt solid #aaa; padding:1.5pt 4pt; }
  .pst-label { background:#e8f5e9!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; font-weight:600; width:12%; }
  .sum-section-title { background:#3b8132!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; color:#fff!important; font-size:7pt; font-weight:700; padding:2pt 5pt; margin:4pt 0 3pt; text-transform:uppercase; }
  .fuel-data-table { width:100%; border-collapse:collapse; font-size:5.5pt; }
  .fuel-data-table th { background:#3b8132!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; color:#fff!important; font-weight:600; padding:2pt 3pt; border:0.4pt solid #2d6127; text-align:center; }
  .fuel-data-table td { padding:1.5pt 3pt; border:0.4pt solid #ddd; vertical-align:top; }
  .fuel-data-table tbody tr:nth-child(even) td { background:#f0f7ee!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }

  /* ── Withdrawal Slip print ── */
  .withdrawal-slip-print { display:block!important; font-family:Arial,sans-serif; width:100%; }

  .slip-cut {
    text-align:left; font-size:7pt; color:#888;
    border-top:0.75pt dotted #999; padding:3pt 0 3pt 20pt; margin:0;
  }

  /* slip-doc in print = full width, clean borders */
  .withdrawal-slip-print .slip-doc {
    border:none; box-shadow:none;
    padding:10pt 18pt 14pt;
    width:100%; box-sizing:border-box;
    font-size:10pt; font-family:Arial,sans-serif;
    page-break-inside:avoid; break-inside:avoid;
  }

  /* ── Letterhead print ── */
  .withdrawal-slip-print .sd-letterhead { display:flex!important; align-items:center; justify-content:space-between; padding-bottom:4pt; }
  .withdrawal-slip-print .sd-lh-left { width:70pt; flex-shrink:0; }
  .withdrawal-slip-print .sd-lh-img-left { width:70pt; height:auto; }
  .withdrawal-slip-print .sd-lh-center { flex:1; text-align:center; padding:0 8pt; }
  .withdrawal-slip-print .sd-lh-republic { font-size:7pt; color:#555; }
  .withdrawal-slip-print .sd-lh-university { font-size:12pt; font-weight:700; color:#1a3d18; text-transform:uppercase; }
  .withdrawal-slip-print .sd-lh-address { font-size:7pt; color:#444; }
  .withdrawal-slip-print .sd-lh-tagline { font-size:7pt; color:#2d6127; font-style:italic; }
  .withdrawal-slip-print .sd-lh-office { font-size:8pt; font-weight:700; color:#1a3d18; text-transform:uppercase; margin-top:2pt; }
  .withdrawal-slip-print .sd-lh-right { width:80pt; flex-shrink:0; }
  .withdrawal-slip-print .sd-lh-img-right { width:80pt; height:auto; }
  .withdrawal-slip-print .sd-lh-divider { display:none!important; }
  .withdrawal-slip-print .sd-print-btn-row { display:none!important; }

  .withdrawal-slip-print .sd-title { font-size:13pt; font-weight:700; text-align:center; text-transform:uppercase; letter-spacing:2.5pt; margin-bottom:0; border-top:2pt solid #000; border-bottom:2pt solid #000; padding:5pt 0; }
  .withdrawal-slip-print .sd-subtitle { font-size:8.5pt; text-align:center; margin:3pt 0 8pt; font-style:italic; color:#555; }
  .withdrawal-slip-print .sd-control { text-align:right; font-size:10pt; margin-bottom:2pt; }
  .withdrawal-slip-print .sd-row2 { display:flex!important; justify-content:space-between; font-size:10pt; margin-bottom:6pt; }
  .withdrawal-slip-print .sd-underline { border-bottom:0.75pt solid #000; min-width:120pt; display:inline-block; font-weight:700; padding-bottom:1pt; }
  .withdrawal-slip-print .sd-table { width:100%; border-collapse:collapse; font-size:10pt; margin-bottom:3pt; }
  .withdrawal-slip-print .sd-table th { border:0.75pt solid #5a8a5a; padding:5pt 5pt; font-weight:700; text-align:center; background:#E6EFE6!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; text-transform:uppercase; letter-spacing:0.5pt; font-size:9pt; }
  .withdrawal-slip-print .sd-table td { border:0.75pt solid #aaa; padding:6pt 6pt; vertical-align:middle; min-height:40pt; }
  .withdrawal-slip-print .sd-note { font-size:8.5pt; font-style:italic; border-left:2pt solid #5a8a5a; padding:3pt 6pt; margin-bottom:12pt; background:#f7fbf7!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; color:#333; }
  .withdrawal-slip-print .sd-meta-row { display:flex!important; justify-content:space-between; font-size:10pt; margin-bottom:3pt; }
  .withdrawal-slip-print .sd-meta-label { font-weight:700; }
  .withdrawal-slip-print .sd-charge-row { font-size:10pt; margin-bottom:8pt; }
  .withdrawal-slip-print .sd-underline-wide { min-width:200pt; }
  .withdrawal-slip-print .sd-sig-section { margin-top:8pt; }
  .withdrawal-slip-print .sd-sig-auth-row { display:flex!important; justify-content:center; margin-bottom:2pt; }
  .withdrawal-slip-print .sd-sig-behalf-row { display:flex!important; justify-content:center; margin-bottom:2pt; margin-top:8pt; }
  .withdrawal-slip-print .sd-sig-auth-block { text-align:center; min-width:200pt; }
  .withdrawal-slip-print .sd-sig-bottom-row { display:flex!important; align-items:flex-start; justify-content:space-around; gap:8pt; }
  .withdrawal-slip-print .sd-sig-col { flex:1; }
  .withdrawal-slip-print .sd-sig-col-center-all { text-align:center; }
  .withdrawal-slip-print .sd-sig-label-line { font-size:8.5pt; margin-bottom:0; color:#555; font-style:italic; }
  .withdrawal-slip-print .sd-sig-space { height:26pt; border-bottom:0.75pt solid #000; margin:0 24pt; }
  .withdrawal-slip-print .sd-sig-name { font-size:10pt; font-weight:700; margin-bottom:1pt; margin-top:3pt; }
  .withdrawal-slip-print .sd-sig-name-underline { text-decoration:none; }
  .withdrawal-slip-print .sd-sig-role { font-size:8.5pt; color:#444; }
  .withdrawal-slip-print .sd-sig-divider { display:none!important; }
}
</style>