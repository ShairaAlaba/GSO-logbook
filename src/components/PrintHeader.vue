<template>
  <div class="print-header">
    <img src="/2.png" alt="CSU Logo" style="height:80px;object-fit:contain;" />
    <div class="print-header-center">
      <div class="print-title">{{ title }}</div>
      <div class="print-subtitle">{{ subtitle }}</div>
      <div style="font-size:12px;margin-top:4px;" v-if="meta">{{ meta }}</div>
    </div>
    <img src="/1.png" alt="Bagong Pilipinas" style="height:80px;object-fit:contain;" />
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
</template>

<script setup>
defineProps({
  title: { type: String, default: 'GSO Logbook Record' },
  subtitle: { type: String, default: 'General Services Office' },
  meta: { type: String, default: '' }
})
</script>
