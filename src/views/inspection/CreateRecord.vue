<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1> Create New Inspection Record</h1>
        <div class="breadcrumb">Pre_Post Inspection → Create New Record</div>
      </div>
    </div>

    <div class="page-content">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-title"> Record Information</div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label">Record Title *</label>
              <input class="form-control" v-model="form.title" placeholder="e.g. February 2026 Inspection Log" />
            </div>
            <div class="form-group">
              <label class="form-label">Inspection Type *</label>
              <select class="form-control" v-model="form.type">
                <option value="">Select Type</option>
                <option value="pre">Pre-Inspection</option>
                <option value="post">Post-Inspection</option>
              </select>
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
            <div class="form-group">
              <label class="form-label">Recorded By *</label>
              <input class="form-control" v-model="form.recordedBy" placeholder="Name of encoder" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"> {{ form.type === 'post' ? 'Post' : 'Pre' }}-Inspection Entries</div>
        </div>
        <div class="card-body" style="padding:12px;">
          <ExcelTable
            :headers="currentHeaders"
            v-model="form.rows"
            :editable="true"
          />
        </div>
      </div>

      <div class="no-print" style="display:flex;gap:12px;margin-top:16px;">
        <button class="btn btn-primary btn-lg" @click="saveRecord"> Save Record</button>
        <button class="btn btn-secondary btn-lg" @click="$router.push('/inspection/all')">Cancel</button>
      </div>

      <div v-if="saved" style="margin-top:16px;padding:12px 16px;background:#d1fae5;border-radius:6px;color:#065f46;font-weight:500;">
         Record saved! <router-link to="/inspection/all" style="color:#047857;">View All Records →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'
import ExcelTable from '../../components/ExcelTable.vue'

const store = useLogbookStore()
const saved = ref(false)
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const preHeaders = [
  'Request No.', 'Inspection No.', 'Online Request', 'Type of Request',
  'College/Department/Unit', 'Prepared By', 'Title', 'Type of Requisitioner',
  'Location', 'Requisitioner', 'Contact No.', 'Date Requested',
  'Date Started', 'Date Completed', 'Date Returned', 'Received By', 'Remarks'
]

const postHeaders = [
  'Request No.', 'Inspection No.', 'Type of Request',
  'College/Department/Unit', 'Prepared By', 'Title', 'Type of Requisitioner',
  'Location', 'Requisitioner', 'Contact No.', 'Date Requested',
  'Date Started', 'Date Completed', 'Date Returned', 'Received By', 'Remarks'
]

const form = reactive({
  title: '',
  type: 'pre',
  date: new Date().toISOString().split('T')[0],
  year: '2026',
  month: 'ALL',
  recordedBy: '',
  rows: []
})

const currentHeaders = computed(() => form.type === 'post' ? postHeaders : preHeaders)

function saveRecord() {
  if (!form.title || !form.type || !form.recordedBy) {
    alert('Please fill all required fields.')
    return
  }
  store.addInspectionRecord({
    id: `INSP-${form.type.toUpperCase()}-${Date.now()}`,
    title: form.title,
    type: form.type,
    year: form.year,
    month: form.month,
    date: form.date,
    recordedBy: form.recordedBy,
    createdAt: new Date().toISOString().split('T')[0],
    headers: currentHeaders.value,
    rows: form.rows
  })
  saved.value = true
  form.title = ''; form.recordedBy = ''; form.rows = []
  setTimeout(() => { saved.value = false }, 5000)
}
</script>
