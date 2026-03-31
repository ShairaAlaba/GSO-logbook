<template>
  <div class="print-header">
    <img src="/1.png" alt="CSU Logo" class="print-logo" />
    <div class="print-header-center">
      <div class="print-title">{{ title }}</div>
      <div class="print-subtitle">{{ subtitle }}</div>
      <div class="print-meta" v-if="meta">{{ meta }}</div>
    </div>
    <img src="/2.png" alt="Bagong Pilipinas" class="print-logo" />
  </div>
</template>

<script setup>
defineProps({
  title:    { type: String, default: 'GSO Logbook Record' },
  subtitle: { type: String, default: 'General Services Office' },
  meta:     { type: String, default: '' }
})
</script>

<style scoped>
/* ── Screen: hidden (only shows during print) ── */
.print-header {
  display: none;
}

/* ── Print: show as proper letterhead ── */
@media print {
  .print-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    margin-bottom: 8px !important;
    padding-bottom: 6px !important;
    border-bottom: 2pt solid #2d6127 !important;
  }

  .print-logo {
    height: 60px !important;
    width: auto !important;
    object-fit: contain !important;
  }

  .print-header-center {
    flex: 1 !important;
    text-align: center !important;
    padding: 0 12px !important;
  }

  .print-title {
    font-size: 13pt !important;
    font-weight: 700 !important;
    color: #1a3d18 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    line-height: 1.3 !important;
  }

  .print-subtitle {
    font-size: 9pt !important;
    color: #333 !important;
    margin-top: 2px !important;
  }

  .print-meta {
    font-size: 8pt !important;
    color: #555 !important;
    margin-top: 3px !important;
  }
}
</style>