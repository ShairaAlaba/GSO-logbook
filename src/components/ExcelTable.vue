<template>
  <div class="table-container">
    <table class="excel-table">
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
          <td :colspan="headers.length + (editable ? 2 : 1)" style="text-align:center;padding:20px;color:#9ca3af;">
            No records yet. {{ editable ? 'Click "+ Add Row" to start.' : '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="editable" class="no-print" style="margin-top:8px;">
    <button class="btn btn-outline btn-sm" @click="addRow">+ Add Row</button>
  </div>
</template>

<script setup>
const props = defineProps({
  headers: { type: Array, required: true },
  modelValue: { type: Array, default: () => [] },
  editable: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

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
  const wideAt = [4, 5, 6, 9]  // destination, purpose, etc
  if (wideAt.includes(i)) return 'min-width:180px;'
  return 'min-width:100px;'
}
</script>
