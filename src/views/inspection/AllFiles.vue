<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1> Pre/Post Inspection — All Files Record</h1>
        <div class="breadcrumb">Pre_Post Inspection → All Files</div>
      </div>
      <router-link to="/inspection/create" class="btn btn-primary">+ Create New Record</router-link>
    </div>

    <div class="page-content">
      <div class="filter-bar no-print">
        <input class="form-control search-input" v-model="search" placeholder=" Search records..." />
        <select class="form-control" v-model="filterYear">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <select class="form-control" v-model="filterMonth">
          <option value="">All Months</option>
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
        <select class="form-control" v-model="filterType">
          <option value="">Pre & Post</option>
          <option value="pre">Pre-Inspection</option>
          <option value="post">Post-Inspection</option>
        </select>
      </div>

      <div v-for="rec in filteredRecords" :key="rec.id" class="record-card">
        <PrintHeader
          :title="`${rec.type === 'pre' ? 'Pre' : 'Post'}-Inspection Control No. — 2026`"
          subtitle="General Services Office | Caraga State University"
          :meta="`Record: ${rec.title} | Date: ${rec.date}`"
        />

        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span>
                <span class="badge" :class="rec.type === 'pre' ? 'badge-yellow' : 'badge-blue'">
                  {{ rec.type === 'pre' ? 'Pre-Inspection' : 'Post-Inspection' }}
                </span>
              </span>
              <span>{{ rec.year }}</span>
              <span>{{ rec.rows.filter(r => r[0]).length }} records</span>
            </div>
          </div>
          <div class="record-card-actions no-print">
            <button class="btn btn-success btn-sm" @click.stop="printRecord(rec.id)"> Print</button>
            <button class="btn btn-secondary btn-sm" @click.stop="toggleRecord(rec.id)">
              {{ openRecords[rec.id] ? '▲ Collapse' : '▼ Expand' }}
            </button>
          </div>
        </div>

        <div class="record-card-body" :class="{ open: openRecords[rec.id] }">
          <ExcelTable
            :headers="rec.headers"
            :model-value="rec.rows.filter(r => r.some(c => c))"
            :editable="false"
          />
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
const filterType = ref('')
const openRecords = reactive({})

const years = ['2026', '2025', '2024']
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const filteredRecords = computed(() => {
  return store.inspectionRecords.filter(rec => {
    const s = search.value.toLowerCase()
    const matchSearch = !s || rec.title.toLowerCase().includes(s) ||
      rec.rows.some(row => row.some(c => c.toLowerCase().includes(s)))
    const matchYear = !filterYear.value || rec.year === filterYear.value
    const matchType = !filterType.value || rec.type === filterType.value
    return matchSearch && matchYear && matchType
  })
})

function toggleRecord(id) {
  openRecords[id] = !openRecords[id]
}

function printRecord(id) {
  openRecords[id] = true
  setTimeout(() => window.print(), 300)
}
</script>
