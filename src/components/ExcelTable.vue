<template>
  <div class="excel-wrapper">

    <!-- ── Table container (native scrollbar hidden) ── -->
    <div class="table-container" ref="tableContainer" @scroll="onTableScroll">
      <table class="excel-table" ref="tableEl">
        <thead>
          <tr>
            <th class="row-num">#</th>
            <th v-for="(h, i) in headers" :key="i" :style="colStyle(i)">{{ h }}</th>
            <th v-if="editable" style="width:50px;" class="no-print">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in modelValue" :key="ri">
            <td class="row-num">{{ ri + 1 }}</td>
            <td v-for="(cell, ci) in row" :key="ci">
              <input
                v-if="editable"
                :value="cell"
                @input="updateCell(ri, ci, $event.target.value)"
                :placeholder="headers[ci]"
              />
              <span v-else :title="cell">{{ cell }}</span>
            </td>
            <td v-if="editable" class="no-print">
              <button class="btn btn-danger btn-sm" @click="removeRow(ri)" title="Delete row">✕</button>
            </td>
          </tr>
          <tr v-if="modelValue.length === 0">
            <td :colspan="headers.length + (editable ? 2 : 1)"
                style="text-align:center;padding:20px;color:#9ca3af;">
              No records yet. {{ editable ? 'Click "+ Add Row" to start.' : '' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

  <div v-if="editable" class="no-print" style="margin-top:8px;">
    <button class="btn btn-outline btn-sm" @click="addRow">+ Add Row</button>
  </div>

  <!-- ── Fixed bottom scrollbar — always visible on screen ── -->
  <Teleport to="body">
    <div
      v-if="isScrollable"
      class="fixed-bottom-scrollbar no-print"
      ref="bottomBar"
      @scroll="onBottomScroll"
    >
      <div :style="{ width: tableWidth + 'px', height: '1px' }"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const props = defineProps({
  headers: { type: Array, required: true },
  modelValue: { type: Array, default: () => [] },
  editable: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

// ── Scroll sync refs ──
const bottomBar      = ref(null)
const tableContainer = ref(null)
const tableEl        = ref(null)
const tableWidth     = ref(0)
const isScrollable   = ref(false)

let syncingBottom = false
let syncingTable  = false
let resizeObs     = null

function measureTableWidth() {
  if (tableEl.value) {
    tableWidth.value = tableEl.value.scrollWidth
    isScrollable.value = tableEl.value.scrollWidth > (tableContainer.value?.clientWidth ?? 0)
  }
}

function onBottomScroll() {
  if (syncingTable) return
  syncingBottom = true
  if (tableContainer.value)
    tableContainer.value.scrollLeft = bottomBar.value.scrollLeft
  syncingBottom = false
}

function onTableScroll() {
  if (syncingBottom) return
  syncingTable = true
  if (bottomBar.value)
    bottomBar.value.scrollLeft = tableContainer.value.scrollLeft
  syncingTable = false
}

onMounted(() => {
  nextTick(() => {
    measureTableWidth()
    resizeObs = new ResizeObserver(measureTableWidth)
    if (tableEl.value)        resizeObs.observe(tableEl.value)
    if (tableContainer.value) resizeObs.observe(tableContainer.value)
  })
})

onBeforeUnmount(() => { if (resizeObs) resizeObs.disconnect() })

watch(() => props.modelValue?.length, () => nextTick(measureTableWidth))

// ── Table editing logic ──
function updateCell(ri, ci, val) {
  const newRows = props.modelValue.map((row, r) =>
    r === ri ? row.map((c, cc) => cc === ci ? val : c) : [...row]
  )
  emit('update:modelValue', newRows)
}

function addRow() {
  const newRow = new Array(props.headers.length).fill('')
  emit('update:modelValue', [...props.modelValue, newRow])
}

function removeRow(ri) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== ri))
}

function colStyle(i) {
  const wideAt = [4, 5, 6, 9]
  if (wideAt.includes(i)) return 'min-width:180px;'
  return 'min-width:100px;'
}
</script>

<style scoped>
.excel-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ── Real table container — hide native scrollbar (bottom bar handles it) ── */
.table-container {
  overflow-x: auto;
  overflow-y: visible;
  border: 1px solid var(--gray-300, #d1d5db);
  border-radius: 6px;
  width: 100%;
}
.table-container::-webkit-scrollbar { height: 0; width: 0; }
.table-container { scrollbar-width: none; }

/* ── Table styles ── */
.excel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 800px;
}

.excel-table th {
  background: var(--green-500, #3b8132);
  color: white;
  padding: 8px 10px;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.excel-table th:first-child { width: 40px; text-align: center; }

.excel-table td {
  padding: 6px 10px;
  border-bottom: 1px solid var(--gray-200, #e5e7eb);
  border-right: 1px solid var(--gray-100, #f3f4f6);
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.excel-table td input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 12px;
  font-family: inherit;
  color: inherit;
  outline: none;
  padding: 0;
}

.excel-table td input:focus {
  background: #fffbeb;
  border-radius: 3px;
  padding: 0 3px;
}

.excel-table tr:nth-child(even) td { background: var(--gray-50, #f9fafb); }
.excel-table tr:hover td           { background: #f0fdf4; }

.row-num {
  width: 40px;
  text-align: center;
  color: var(--gray-400, #9ca3af);
  font-size: 11px;
  user-select: none;
}

/* ── Print ── */
@media print {
  .table-container { overflow: visible; border: none; }
  .excel-table td, .excel-table th { white-space: normal; }
}
</style>

<!-- Global style for the teleported fixed scrollbar (scoped won't reach body) -->
<style>
.fixed-bottom-scrollbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  background: #d1d5db;
  z-index: 9999;
  scrollbar-gutter: stable;
}

.fixed-bottom-scrollbar::-webkit-scrollbar        { height: 20px; }
.fixed-bottom-scrollbar::-webkit-scrollbar-track  {
  background: #d1d5db;
}
.fixed-bottom-scrollbar::-webkit-scrollbar-thumb  {
  background: #72bf6a;
  border-radius: 6px;
  border: 4px solid #d1d5db;
  min-width: 60px;
}
.fixed-bottom-scrollbar::-webkit-scrollbar-thumb:hover  { background: #3b8132; }
.fixed-bottom-scrollbar::-webkit-scrollbar-thumb:active { background: #1a4a15; }

@media print {
  .fixed-bottom-scrollbar { display: none; }
}
</style>