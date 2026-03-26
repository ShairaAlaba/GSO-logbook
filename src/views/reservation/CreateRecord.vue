<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1>Create New Reservation Record</h1>
        <div class="breadcrumb">Analysis → Reservation of Vehicle → Create New Record</div>
      </div>
    </div>

    <div class="page-content">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-title">Record Information</div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label">Record Title *</label>
              <input class="form-control" v-model="form.title" placeholder="e.g. January 2026 Reservation Log" />
            </div>
            <div class="form-group">
              <label class="form-label">Vehicle *</label>
              <select class="form-control" v-model="form.vehicle">
                <option value="">Select Vehicle</option>
                <option v-for="v in vehicleList" :key="v" :value="v">{{ v }}</option>
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

      <!-- Excel Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"> Reservation Entries</div>
          <div style="font-size:12px;color:#6b7280;">Click cells to edit. Press Tab to move between cells.</div>
        </div>
        <div class="card-body" style="padding:12px;">
          <ExcelTable
            :headers="headers"
            v-model="form.rows"
            :editable="true"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="no-print" style="display:flex;gap:12px;margin-top:16px;">
        <button class="btn btn-primary btn-lg" @click="saveRecord"> Save Record</button>
        <button class="btn btn-secondary btn-lg" @click="$router.push('/reservation/all')">Cancel</button>
      </div>

      <!-- Success Message -->
      <div v-if="saved" style="margin-top:16px;padding:12px 16px;background:#d1fae5;border-radius:6px;color:#065f46;font-weight:500;">
         Record saved successfully! <router-link to="/reservation/all" style="color:#047857;">View All Records →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'
import ExcelTable from '../../components/ExcelTable.vue'
import { useRouter } from 'vue-router'

const store = useLogbookStore()
const router = useRouter()
const saved = ref(false)

const vehicleList = ['ADVENTURE', 'COASTER', 'FORTUNER', 'VAN', 'HILUX', 'LIGHT TRUCK', 'PAJERO', 'LITE ACE', 'FORTUNER LTD']
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const headers = [
  'TRIP TICKET NO.', 'ASSIGNED DRIVER', 'MONTH & DATE/S', 'TIME',
  'DESTINATION', 'PURPOSE', "REQUESTER'S CONTACT NO.", 'REQUESTING OFFICE',
  'REMARKS', 'CHARGING OF FUEL/PER DIEM', 'STATUS', 'RECORDED BY', 'UPDATED BY'
]

const form = reactive({
  title: '',
  vehicle: '',
  date: new Date().toISOString().split('T')[0],
  year: '2026',
  month: 'ALL',
  recordedBy: '',
  rows: []
})

function saveRecord() {
  if (!form.title || !form.vehicle || !form.recordedBy) {
    alert('Please fill in all required fields (Title, Vehicle, Recorded By)')
    return
  }
  const record = {
    id: `RES-${Date.now()}`,
    title: form.title,
    vehicle: form.vehicle,
    year: form.year,
    month: form.month,
    date: form.date,
    recordedBy: form.recordedBy,
    createdAt: new Date().toISOString().split('T')[0],
    headers: headers,
    rows: form.rows
  }
  store.addReservationRecord(record)
  saved.value = true
  // Reset form
  form.title = ''
  form.vehicle = ''
  form.recordedBy = ''
  form.rows = []
  setTimeout(() => { saved.value = false }, 5000)
}
</script>
