<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1>Fuel &amp; Oil Withdrawal — All Files Record</h1>
        <div class="breadcrumb">Analysis → Fuel &amp; Oil Withdrawal → All Files</div>
      </div>
      <router-link to="/fuel/create" class="btn btn-primary">+ Create New Record</router-link>
    </div>

    <div class="page-content">
      <!-- Filter Bar -->
      <div class="filter-bar no-print">
        <input class="form-control search-input" v-model="search" placeholder="Search records..." />
        <select class="form-control" v-model="filterYear">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <select class="form-control" v-model="filterMonth">
          <option value="">All Months</option>
          <option v-for="m in monthList" :key="m" :value="m">{{ m }}</option>
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
          :title="`Fuel &amp; Oil Withdrawal Log — ${rec.month} ${rec.year}`"
          :subtitle="`General Services Office | Caraga State University`"
          :meta="`Record: ${rec.title} | Date: ${rec.date} | Recorded by: ${rec.recordedBy}`"
        />

        <div class="record-card-header" @click="toggleRecord(rec.id)">
          <div>
            <div class="record-card-title">{{ rec.title }}</div>
            <div class="record-card-meta">
              <span>{{ rec.month }}</span>
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
const search      = ref('')
const filterYear  = ref('')
const filterMonth = ref('')
const openRecords = reactive({})
const editingId   = reactive({})
const draftRows   = reactive({})
const deleteTarget = ref(null)

const years     = computed(() => [...new Set(store.fuelRecords.map(r => r.year))].sort())
const monthList = computed(() => [...new Set(store.fuelRecords.map(r => r.month))])

const filteredRecords = computed(() => {
  return store.fuelRecords.filter(rec => {
    const s = search.value.toLowerCase()
    const matchSearch = !s || rec.title.toLowerCase().includes(s) ||
      rec.rows.some(row => row.some(cell => String(cell).toLowerCase().includes(s)))
    const matchYear  = !filterYear.value  || rec.year  === filterYear.value
    const matchMonth = !filterMonth.value || rec.month === filterMonth.value
    return matchSearch && matchYear && matchMonth && rec.rows.length > 0
  })
})

function toggleRecord(id) { openRecords[id] = !openRecords[id] }

function startEdit(rec) {
  draftRows[rec.id]   = rec.rows.map(r => [...r])
  editingId[rec.id]   = true
  openRecords[rec.id] = true
}

function saveEdit(rec) {
  const idx = store.fuelRecords.findIndex(r => r.id === rec.id)
  if (idx !== -1) store.updateFuelRecord(idx, { ...store.fuelRecords[idx], rows: draftRows[rec.id] })
  editingId[rec.id] = false
}

function cancelEdit(rec) {
  delete draftRows[rec.id]
  editingId[rec.id] = false
}

function confirmDelete(rec) { deleteTarget.value = rec }
function doDelete() {
  const idx = store.fuelRecords.findIndex(r => r.id === deleteTarget.value.id)
  if (idx !== -1) store.deleteFuelRecord(idx)
  deleteTarget.value = null
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
  border: 1px solid #fde68a;
  border-radius: 6px;
  font-size: 12px;
  color: #92400e;
}
.btn-warning { background: #9dc5a7; color: #000; border: 1.5px solid #a4cfb2; }
.btn-warning:hover { background: #82a381; border-color: #afc49b; }
.btn-danger { background: #ef4444; color: #fff; border: 1.5px solid #dc2626; }
.btn-danger:hover { background: #dc2626; border-color: #b91c1c; }
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-box {
  background: #fff; border-radius: 12px; padding: 32px 28px 24px;
  max-width: 380px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.22); text-align: center;
}
.modal-icon { font-size: 36px; margin-bottom: 10px; }
.modal-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.modal-body { font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 22px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }
</style>