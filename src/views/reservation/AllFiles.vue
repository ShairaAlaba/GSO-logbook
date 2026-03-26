<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1>Reservation of Vehicle — All Files Record</h1>
        <div class="breadcrumb">Analysis → Reservation of Vehicle → All Files</div>
      </div>
      <router-link to="/reservation/create" class="btn btn-primary">+ Create New Record</router-link>
    </div>

    <div class="page-content">
      <!-- Filter Bar -->
      <div class="filter-bar no-print">
        <input class="form-control search-input" v-model="search" placeholder="Search by title, driver, destination..." />
        <select class="form-control" v-model="filterYear">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <select class="form-control" v-model="filterMonth">
          <option value="">All Months</option>
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
        <select class="form-control" v-model="filterVehicle">
          <option value="">All Vehicles</option>
          <option v-for="v in vehicles" :key="v" :value="v">{{ v }}</option>
        </select>
      </div>

      <!-- Records List -->
      <div v-if="filteredRecords.length === 0" class="card">
        <div class="card-body" style="text-align:center;padding:40px;color:#9ca3af;">
          No records found matching your search.
        </div>
      </div>

      <div v-for="(rec, ri) in filteredRecords" :key="rec.id" class="record-card">
        <!-- Print Header (only shows when printing) -->
        <PrintHeader
          :title="`Reservation of Vehicle Log Book — ${rec.vehicle}`"
          :subtitle="`General Services Office | Caraga State University`"
          :meta="`Record: ${rec.title} | Date: ${rec.date} | Recorded by: ${rec.recordedBy}`"
        />

        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span>{{ rec.vehicle }}</span>
              <span>{{ rec.year }}</span>
              <span>{{ rec.rows.length }} rows</span>
              <span>{{ rec.recordedBy }}</span>
            </div>
          </div>
          <div class="record-card-actions no-print">
            <button class="btn btn-success btn-sm" @click.stop="printRecord(rec.id)">Print</button>
            <button class="btn btn-secondary btn-sm" @click.stop="toggleRecord(rec.id)">
              {{ openRecords[rec.id] ? '▲ Collapse' : '▼ Expand' }}
            </button>
          </div>
        </div>

        <div class="record-card-body" :class="{ open: openRecords[rec.id] }">
          <ExcelTable
            :headers="rec.headers"
            :model-value="rec.rows"
            :editable="false"
          />
        </div>

        <!-- Signature Block (only shows when printing) -->
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
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'
import ExcelTable from '../../components/ExcelTable.vue'
import PrintHeader from '../../components/PrintHeader.vue'

const store = useLogbookStore()
const search = ref('')
const filterYear = ref('')
const filterMonth = ref('')
const filterVehicle = ref('')
const openRecords = reactive({})
const printingId = ref(null)

const years = computed(() => [...new Set(store.reservationRecords.map(r => r.year))].sort())
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
const vehicles = computed(() => [...new Set(store.reservationRecords.map(r => r.vehicle))].sort())

const filteredRecords = computed(() => {
  return store.reservationRecords.filter(rec => {
    const s = search.value.toLowerCase()
    const matchSearch = !s || 
      rec.title.toLowerCase().includes(s) ||
      rec.vehicle.toLowerCase().includes(s) ||
      rec.rows.some(row => row.some(cell => cell.toLowerCase().includes(s)))
    const matchYear = !filterYear.value || rec.year === filterYear.value
    const matchVehicle = !filterVehicle.value || rec.vehicle === filterVehicle.value
    return matchSearch && matchYear && matchVehicle && rec.rows.length > 0
  })
})

function toggleRecord(id) {
  openRecords[id] = !openRecords[id]
}

function printRecord(id) {
  // Open record before printing
  openRecords[id] = true
  setTimeout(() => window.print(), 300)
}
</script>
