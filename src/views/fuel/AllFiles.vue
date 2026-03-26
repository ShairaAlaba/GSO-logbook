<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1> Fuel & Oil Withdrawal — All Files Record</h1>
        <div class="breadcrumb">Fuel & Oil Withdrawal → All Files</div>
      </div>
      <router-link to="/fuel/create" class="btn btn-primary">+ Create New Record</router-link>
    </div>

    <div class="page-content">
      <div class="filter-bar no-print">
        <input class="form-control search-input" v-model="search" placeholder=" Search fuel records..." />
        <select class="form-control" v-model="filterYear">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <select class="form-control" v-model="filterMonth">
          <option value="">All Months</option>
          <option v-for="m in monthList" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>

      <!-- Summary stats -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:20px;" class="no-print">
        <div v-for="rec in store.fuelRecords.filter(r => r.rows.length > 0)" :key="rec.id"
          class="stat-card" style="padding:12px;text-align:center;cursor:pointer;"
          @click="scrollTo(rec.id)">
          <div style="font-size:20px;"></div>
          <div style="font-weight:600;font-size:12px;color:#1a4a15;">{{ rec.month }}</div>
          <div style="font-size:20px;font-weight:700;color:#3b8132;">{{ rec.rows.length }}</div>
          <div style="font-size:11px;color:#6b7280;">records</div>
        </div>
      </div>

      <div v-for="rec in filteredRecords" :key="rec.id" :id="rec.id" class="record-card">
        <PrintHeader
          :title="`Fuel and Oil Withdrawal Log — ${rec.month} ${rec.year}`"
          subtitle="General Services Office | Caraga State University"
          :meta="`Record: ${rec.title} | Date: ${rec.date}`"
        />

        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span> {{ rec.month }} {{ rec.year }}</span>
              <span> {{ rec.rows.length }} withdrawal records</span>
            </div>
          </div>
          <div class="record-card-actions no-print">
            <button class="btn btn-success btn-sm" @click.stop="printRecord(rec.id)">🖨 Print</button>
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

        <div class="signature-block">
          <div class="sig-item"><div class="sig-line"></div><div class="sig-name">ACE-ME CASIÑO</div><div class="sig-role">Prepared By</div></div>
          <div class="sig-item"><div class="sig-line"></div><div class="sig-name">ENGR. MARIA M. DELO</div><div class="sig-role">Approved By</div></div>
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
const openRecords = reactive({})

const years = ['2026', '2025']
const monthList = ['JANAURY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']

const filteredRecords = computed(() => {
  return store.fuelRecords.filter(rec => {
    if (rec.rows.length === 0) return false
    const s = search.value.toLowerCase()
    const matchSearch = !s || rec.title.toLowerCase().includes(s) ||
      rec.rows.some(row => row.some(c => c.toLowerCase().includes(s)))
    const matchYear = !filterYear.value || rec.year === filterYear.value
    const matchMonth = !filterMonth.value || rec.month === filterMonth.value
    return matchSearch && matchYear && matchMonth
  })
})

function toggleRecord(id) { openRecords[id] = !openRecords[id] }
function printRecord(id) { openRecords[id] = true; setTimeout(() => window.print(), 300) }
function scrollTo(id) {
  openRecords[id] = true
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>
