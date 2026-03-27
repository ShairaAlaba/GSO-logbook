<template>
  <div class="top-scroll-wrapper">
    <!-- Mirror scrollbar pinned at top -->
    <div class="top-scroll-bar" ref="topBar" @scroll="onTopScroll">
      <div :style="{ width: innerWidth + 'px', height: '1px' }"></div>
    </div>

    <!-- Actual content — own scrollbar hidden, driven by top bar -->
    <div class="top-scroll-content" ref="content" @scroll="onContentScroll">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const topBar   = ref(null)
const content  = ref(null)
const innerWidth = ref(0)

let syncTop     = false
let syncContent = false
let observer    = null

function measureWidth() {
  const inner = content.value?.querySelector('table') ||
                content.value?.firstElementChild
  if (inner) innerWidth.value = inner.scrollWidth
}

function onTopScroll() {
  if (syncContent) return
  syncTop = true
  if (content.value) content.value.scrollLeft = topBar.value.scrollLeft
  syncTop = false
}

function onContentScroll() {
  if (syncTop) return
  syncContent = true
  if (topBar.value) topBar.value.scrollLeft = content.value.scrollLeft
  syncContent = false
}

onMounted(() => {
  nextTick(() => {
    measureWidth()
    observer = new ResizeObserver(measureWidth)
    if (content.value) observer.observe(content.value)
    const inner = content.value?.querySelector('table') ||
                  content.value?.firstElementChild
    if (inner) observer.observe(inner)
  })
})

onBeforeUnmount(() => { if (observer) observer.disconnect() })
</script>

<style scoped>
.top-scroll-wrapper { display: flex; flex-direction: column; width: 100%; }

/* ── Top scrollbar strip ── */
.top-scroll-bar {
  overflow-x: auto;
  overflow-y: hidden;
  height: 22px;
  width: 100%;
  background: #e5e7eb;
  border-radius: 8px 8px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}
.top-scroll-bar::-webkit-scrollbar        { height: 22px; }
.top-scroll-bar::-webkit-scrollbar-track  { background: #e5e7eb; border-radius: 8px; }
.top-scroll-bar::-webkit-scrollbar-thumb  {
  background: #72bf6a;
  border-radius: 8px;
  border: 4px solid #e5e7eb;
  min-width: 60px;
}
.top-scroll-bar::-webkit-scrollbar-thumb:hover  { background: #3b8132; }
.top-scroll-bar::-webkit-scrollbar-thumb:active { background: #1a4a15; }

/* ── Content — hide its own horizontal scrollbar ── */
.top-scroll-content { overflow-x: auto; overflow-y: visible; width: 100%; }
.top-scroll-content::-webkit-scrollbar { height: 0; width: 0; }
</style>
