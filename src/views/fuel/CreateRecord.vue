<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1> Create New Fuel & Oil Record</h1>
        <div class="breadcrumb">Fuel & Oil Withdrawal → Create New Record</div>
      </div>
    </div>

    <div class="page-content">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><div class="card-title"> Record Information</div></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label">Record Title *</label>
              <input class="form-control" v-model="form.title" placeholder="e.g. 2026 MARCH Fuel Withdrawal" />
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
                <option v-for="m in monthList" :key="m" :value="m">{{ m }}</option>
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
        <div class="card-header"><div class="card-title"> Fuel & Oil Withdrawal Entries</div></div>
        <div class="card-body" style="padding:12px;">
          <ExcelTable :headers="headers" v-model="form.rows" :editable="true" />
        </div>
      </div>

      <div class="no-print" style="display:flex;gap:12px;margin-top:16px;">
        <button class="btn btn-primary btn-lg" @click="saveRecord"> Save Record</button>
        <button class="btn btn-secondary btn-lg" @click="$router.push('/fuel/all')">Cancel</button>
      </div>

      <div v-if="saved" style="margin-top:16px;padding:12px 16px;background:#d1fae5;border-radius:6px;color:#065f46;font-weight:500;">
         Record saved! <router-link to="/fuel/all" style="color:#047857;">View All Records →</router-link>
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
const monthList = ['JANAURY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']

const headers = [
  'CONTROL NO.', 'SEMESTER/QUARTER', 'TIME', 'DATE',
  'REQUESTED BY/OPERATOR', 'QTY. & FUEL TYPE', 'FUEL CHARGE TO',
  'DESTINATION', 'VEHICLE', 'PURPOSE', 'REMARKS',
  'ACTUAL WITHDRAWAL (L)', 'ACTUAL AMOUNT'
]

const form = reactive({
  title: '',
  date: new Date().toISOString().split('T')[0],
  year: '2026',
  month: 'MARCH',
  recordedBy: '',
  rows: []
})

function saveRecord() {
  if (!form.title || !form.recordedBy) { alert('Please fill all required fields.'); return }
  store.addFuelRecord({
    id: `FUEL-${Date.now()}`,
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
