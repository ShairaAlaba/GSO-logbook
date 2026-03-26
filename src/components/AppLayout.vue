<!-- ─────────────────────────────────────────────────────────────────────────
  REPLACE the existing "POW Monitoring" nav-group block in AppLayout.vue
  with this updated version (adds the "POW Analysis" sub-link).
  ───────────────────────────────────────────────────────────────────────── -->

<!-- POW Monitoring -->
< class="nav-group">
  <button class="nav-group-title" @click="toggleGroup('pow')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
    <span>POW Monitoring</span>
    <svg class="chevron" :class="{ rotated: groups.pow }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>
  </button>
  <transition name="submenu">
    <div v-if="groups.pow" class="nav-sub">
      <router-link to="/pow/all" class="nav-sub-item" @click="closeMobile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        All Files Record
      </router-link>
      <router-link to="/pow/create" class="nav-sub-item" @click="closeMobile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
        Create New Record
      </router-link>

      <!-- ← NEW: POW Analysis link -->
      <router-link to="/pow/analysis" class="nav-sub-item" @click="closeMobile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
        POW Analysis
      </router-link>

    </div>
  </transition>