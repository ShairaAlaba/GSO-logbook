<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1>Create New POW Record</h1>
        <div class="breadcrumb">POW Monitoring → Create New Record</div>
      </div>
    </div>

    <div class="page-content">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><div class="card-title"> Record Information</div></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label">Record Title *</label>
              <input class="form-control" v-model="form.title" placeholder="e.g. 2026 POW Monitoring Logbook" />
            </div>
            <div class="form-group">
              <label class="form-label">Date *</label>
              <input type="date" class="form-control" v-model="form.date" />
            </div>
            <div class="form-group">
              <label class="form-label">Year</label>
              <input class="form-control" v-model="form.year" placeholder="e.g. 2026" />
            </div>
            <div class="form-group">
              <label class="form-label">Month</label>
              <select class="form-control" v-model="form.month">
                <option value="ALL">All Months</option>
                <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
            <div class="form-group" style="grid-column:span 2;">
              <label class="form-label">Recorded By *</label>
              <input class="form-control" v-model="form.recordedBy" placeholder="Name of encoder" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title"> POW Entries</div></div>
        <div class="card-body" style="padding:12px;">
          <ExcelTable :headers="headers" v-model="form.rows" :editable="true" />
        </div>
      </div>

      <div class="no-print" style="display:flex;gap:12px;margin-top:16px;">
        <button class="btn btn-primary btn-lg" @click="saveRecord"> Save Record</button>
        <button class="btn btn-secondary btn-lg" @click="$router.push('/pow/all')">Cancel</button>
      </div>

      <div v-if="saved" style="margin-top:16px;padding:12px 16px;background:#d1fae5;border-radius:6px;color:#065f46;font-weight:500;">
         Record saved! <router-link to="/pow/all" style="color:#047857;">View All Records →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'
import ExcelTable from '../../components/ExcelTable.vue'

const store = useLogbookStore()
const saved = ref(false)
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const headers = [
  'Tabbing No.', 'POW No.', 'Online Request No.', 'QR Code', 'Date Request',
  'Requisitioner', 'Contact No.', 'College/Department/Unit', 'Specifics',
  'Prepare By', 'POW Title', 'Equipment Expenses', 'Labor Cost', 'Materials Cost',
  'Sub-Total Indirect Cost', 'Appropriation Cost', 'Revision No.',
  'Source of Fund', 'Account Code', 'Type of Requesitioner',
  'Date Started', 'Date Completed', 'Date Returned', 'Received By', 'Date Approved'
]

const form = reactive({
  title: '',
  date: new Date().toISOString().split('T')[0],
  year: '2026',
  month: 'ALL',
  recordedBy: '',
  rows: []
})

function saveRecord() {
  if (!form.title || !form.recordedBy) { alert('Please fill all required fields.'); return }
  store.addPowRecord({
    id: `POW-${Date.now()}`,
    title: form.title,
    year: form.year,
    month: form.month,
    date: form.date,
    recordedBy: form.recordedBy,
    createdAt: new Date().toISOString().split('T')[0],
    headers,
    rows: form.rows
  })
  saved.value = true
  form.title = ''; form.recordedBy = ''; form.rows = []
  setTimeout(() => { saved.value = false }, 5000)
}
</script>
