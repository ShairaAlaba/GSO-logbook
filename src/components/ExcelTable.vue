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
                :data-row="ri"
                :data-col="ci"
                @input="updateCell(ri, ci, $event.target.value)"
                @keydown.enter.prevent="focusNext(ri, ci)"
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

function focusNext(ri, ci) {
  const totalCols = props.headers.length
  let nextRow = ri
  let nextCol = ci + 1

  if (nextCol >= totalCols) {
    nextCol = 0
    nextRow = ri + 1
  }

  nextTick(() => {
    const input = tableEl.value?.querySelector(
      `input[data-row="${nextRow}"][data-col="${nextCol}"]`
    )
    if (input) {
      input.focus()
      input.select()
    }
  })
}
</script>

<style scoped>
.excel-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.table-container {
  overflow-x: auto;
  overflow-y: visible;
  border: 1px solid var(--gray-300, #d1d5db);
  border-radius: 6px;
  width: 100%;
}
.table-container::-webkit-scrollbar { height: 0; width: 0; }
.table-container { scrollbar-width: none; }

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

@media print {
  .excel-wrapper,
  .table-container {
    overflow: visible !important;
    border: none !important;
    width: 100% !important;
  }

  .excel-table {
    width: 100% !important;
    min-width: unset !important;
    table-layout: auto !important;
    border-collapse: collapse !important;
    font-size: 7pt !important;
  }

  .excel-table thead {
    display: table-header-group !important;
  }

  .excel-table th {
    background: #3b8132 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color: white !important;
    font-size: 7pt !important;
    padding: 3px 4px !important;
    white-space: normal !important;
    word-break: break-word !important;
    position: static !important;
    border: 0.5pt solid #2d6127 !important;
    text-align: center !important;
  }

  .excel-table td {
    font-size: 7pt !important;
    padding: 2px 4px !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow: visible !important;
    text-overflow: unset !important;
    max-width: none !important;
    border: 0.5pt solid #ccc !important;
  }

  .excel-table tr:nth-child(even) td {
    background: #f0f7ee !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .excel-table tbody tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .row-num {
    width: 20pt !important;
    font-size: 6.5pt !important;
    text-align: center !important;
  }
}
</style>

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
.fixed-bottom-scrollbar::-webkit-scrollbar-track  { background: #d1d5db; }
.fixed-bottom-scrollbar::-webkit-scrollbar-thumb  {
  background: #72bf6a;
  border-radius: 6px;
  border: 4px solid #d1d5db;
  min-width: 60px;
}
.fixed-bottom-scrollbar::-webkit-scrollbar-thumb:hover  { background: #3b8132; }
.fixed-bottom-scrollbar::-webkit-scrollbar-thumb:active { background: #1a4a15; }

@media print {
  .fixed-bottom-scrollbar { display: none !important; }
}
</style>