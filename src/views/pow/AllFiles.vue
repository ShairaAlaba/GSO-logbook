<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1>POW Monitoring — All Files Record</h1>
        <div class="breadcrumb">POW Monitoring → All Files</div>
      </div>
      <router-link to="/pow/create" class="btn btn-primary">+ Create New Record</router-link>
    </div>

    <div class="page-content">
      <!-- Filter Bar -->
      <div class="filter-bar no-print">
        <input class="form-control search-input" v-model="search" placeholder="Search records..." />
        <select class="form-control" v-model="filterYear">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <!-- Records List -->
      <div v-if="filteredRecords.length === 0" class="card">
        <div class="card-body" style="text-align:center;padding:40px;color:#9ca3af;">
          No records found matching your search.
        </div>
      </div>

      <div v-for="(rec, ri) in filteredRecords" :key="rec.id" class="record-card">
        <PrintHeader
          :title="`POW Monitoring Logbook — ${rec.year}`"
          :subtitle="`General Services Office | Caraga State University`"
          :meta="`Record: ${rec.title} | Date: ${rec.date} | Recorded by: ${rec.recordedBy}`"
        />

        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span>{{ rec.year }}</span>
              <span>{{ rec.rows.length }} rows</span>
              <span>{{ rec.recordedBy }}</span>
            </div>
          </div>
          <div class="record-card-actions no-print">
            <button
              v-if="!editingId[rec.id]"
              class="btn btn-warning btn-sm"
              @click.stop="startEdit(rec)"
            > Edit</button>
            <button
              v-else
              class="btn btn-success btn-sm"
              @click.stop="saveEdit(rec)"
            > Save</button>
            <button
              v-if="editingId[rec.id]"
              class="btn btn-secondary btn-sm"
              @click.stop="cancelEdit(rec)"
            >Cancel</button>

            <button
              v-if="!editingId[rec.id]"
              class="btn btn-danger btn-sm"
              @click.stop="confirmDelete(rec)"
            > Delete</button>

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
          <div v-if="editingId[rec.id]" class="edit-notice no-print">
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
    </div><!-- /page-content -->

  <Teleport to="body">
    <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
      <div class="modal-box">
        <div class="modal-icon"></div>
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
import PrintHeader from '../../components/PrintHeader.vue'

const store = useLogbookStore()
const search     = ref('')
const filterYear = ref('')
const openRecords = reactive({})
const editingId   = reactive({})
const draftRows   = reactive({})

const years = computed(() => [...new Set(store.powRecords.map(r => r.year))].sort())

const filteredRecords = computed(() => {
  return store.powRecords.filter(rec => {
    const s = search.value.toLowerCase()
    const matchSearch = !s || rec.title.toLowerCase().includes(s) ||
      rec.rows.some(row => row.some(cell => String(cell).toLowerCase().includes(s)))
    const matchYear = !filterYear.value || rec.year === filterYear.value
    return matchSearch && matchYear && rec.rows.length > 0
  })
})

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

function printRecord(id) {
  openRecords[id] = true
  setTimeout(() => window.print(), 300)
}
</script>

<style scoped>
.edit-notice {
  margin-top: 8px;
  padding: 8px 14px;
  background: #fffbeb;
  border: 1px solid #9dc5a7;
  border-radius: 6px;
  font-size: 12px;
  color: #a4cfb2;
}
.btn-warning { background: #9dc5a7; color: #000; border: 1.5px solid #a4cfb2; }
.btn-warning:hover { background: #77b892; border-color: #accfaf; }
</style>