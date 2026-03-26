<template>
  <div class="app-layout">

    <!-- ═══════════════════════════════════════
         SIDEBAR
    ═══════════════════════════════════════ -->
    <aside class="sidebar">

      <!-- Logo / Branding -->
      <div class="sidebar-logo">
        <img src="/logo 2.png" alt="GSO Logo" />
        <div class="logo-text">GSO Logbook System</div>
        <div class="logo-sub">Caraga State University</div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">

        <!-- Home -->
        <router-link to="/" class="nav-home-link" exact>
          <span class="nav-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          </span>
          <span class="nav-item-label">Dashboard</span>
        </router-link>

        <!-- Section Label -->
        <div class="nav-section-label">Logbook Modules</div>

        <!-- Reservation -->
        <div class="nav-group">
          <button
            class="nav-group-header"
            :class="{ 'active-group': isGroupActive('reservation'), 'open': openGroups.reservation }"
            @click="toggleGroup('reservation')"
          >
            <span class="nav-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
            </span>
            <span class="nav-item-label">Vehicle Reservation</span>
            <span class="nav-chevron" :class="{ rotated: openGroups.reservation }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="6,9 12,15 18,9"/></svg>
            </span>
          </button>
          <div class="nav-sub" :class="{ open: openGroups.reservation }">
            <router-link to="/reservation/all" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              All Files Record
            </router-link>
            <router-link to="/reservation/create" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Create New Record
            </router-link>
            <router-link to="/reservation/drivers" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Driver Record
            </router-link>
          </div>
        </div>

        <!-- Pre/Post Inspection -->
        <div class="nav-group">
          <button
            class="nav-group-header"
            :class="{ 'active-group': isGroupActive('inspection'), 'open': openGroups.inspection }"
            @click="toggleGroup('inspection')"
          >
            <span class="nav-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            </span>
            <span class="nav-item-label">Pre / Post Inspection</span>
            <span class="nav-chevron" :class="{ rotated: openGroups.inspection }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="6,9 12,15 18,9"/></svg>
            </span>
          </button>
          <div class="nav-sub" :class="{ open: openGroups.inspection }">
            <router-link to="/inspection/all" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              All Files Record
            </router-link>
            <router-link to="/inspection/create" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Create New Record
            </router-link>
          </div>
        </div>

        <!-- POW Monitoring -->
        <div class="nav-group">
          <button
            class="nav-group-header"
            :class="{ 'active-group': isGroupActive('pow'), 'open': openGroups.pow }"
            @click="toggleGroup('pow')"
          >
            <span class="nav-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            </span>
            <span class="nav-item-label">POW Monitoring</span>
            <span class="nav-chevron" :class="{ rotated: openGroups.pow }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="6,9 12,15 18,9"/></svg>
            </span>
          </button>
          <div class="nav-sub" :class="{ open: openGroups.pow }">
            <router-link to="/pow/all" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              All Files Record
            </router-link>
            <router-link to="/pow/create" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Create New Record
            </router-link>
            <router-link to="/pow/analysis" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
              POW Analysis
            </router-link>
          </div>
        </div>

        <!-- Fuel & Oil -->
        <div class="nav-group">
          <button
            class="nav-group-header"
            :class="{ 'active-group': isGroupActive('fuel'), 'open': openGroups.fuel }"
            @click="toggleGroup('fuel')"
          >
            <span class="nav-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M3 22V8l9-6 9 6v14H3z"/><path d="M10 22V15h4v7"/><line x1="3" y1="11" x2="21" y2="11"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
            </span>
            <span class="nav-item-label">Fuel &amp; Oil Withdrawal</span>
            <span class="nav-chevron" :class="{ rotated: openGroups.fuel }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="6,9 12,15 18,9"/></svg>
            </span>
          </button>
          <div class="nav-sub" :class="{ open: openGroups.fuel }">
            <router-link to="/fuel/all" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              All Files Record
            </router-link>
            <router-link to="/fuel/create" class="nav-sub-item" active-class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Create New Record
            </router-link>
          </div>
        </div>

      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="sidebar-footer-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        </div>
        <div class="sidebar-footer-text">
          <div class="footer-office">General Services Office</div>
          <div class="footer-address">Ampayon, Butuan City 8600</div>
        </div>
      </div>

    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const openGroups = reactive({
  reservation: false,
  inspection: false,
  pow: false,
  fuel: false
})

function toggleGroup(group) {
  openGroups[group] = !openGroups[group]
}

function isGroupActive(group) {
  return route.path.startsWith(`/${group}`)
}

watch(() => route.path, (path) => {
  if (path.startsWith('/reservation')) openGroups.reservation = true
  if (path.startsWith('/inspection')) openGroups.inspection = true
  if (path.startsWith('/pow')) openGroups.pow = true
  if (path.startsWith('/fuel')) openGroups.fuel = true
}, { immediate: true })
</script>

<style scoped>
/* ── Layout ── */
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 260px;
  background: linear-gradient(175deg, #a2c09e 0%, #81a57d 100%);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
  box-shadow: 4px 0 20px rgba(0,0,0,0.2);
  z-index: 100;
}

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 22px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.1);
}
.sidebar-logo img {
  width: 170px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}
.logo-text {
  color: #000000;
  font-size: 12.5px;
  font-weight: 700;
  text-align: center;
  margin-top: 10px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
}
.logo-sub {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 3px;
  letter-spacing: 0.3px;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 8px 0 12px;
}

.nav-section-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.38);
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 14px 18px 5px;
}

/* ── Home link ── */
.nav-home-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  margin: 4px 10px;
  color: rgb(0, 0, 0);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  text-decoration: none;
  border-left: 3px solid transparent;
}
.nav-home-link:hover {
  background: rgba(255,255,255,0.1);
  color: #000000;
}
.nav-home-link.router-link-active {
  background: rgba(255,255,255,0.18);
  color: #000000;
  border-left-color: rgba(0, 0, 0, 0.65);
}
.nav-home-link.router-link-active .nav-item-icon {
  background: rgba(255,255,255,0.22);
}
.nav-home-link.router-link-active .nav-item-icon svg { stroke: #000000; }

/* ── Nav group ── */
.nav-group {
  margin: 2px 10px;
}

.nav-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 8px;
  color: rgb(0, 0, 0);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.nav-group-header:hover {
  background: rgba(255,255,255,0.1);
  color: #000000;
}
.nav-group-header.active-group {
  background: rgba(255,255,255,0.14);
  border-left-color: rgba(255,255,255,0.6);
  color: #000000;
}
.nav-group-header.active-group .nav-item-icon {
  background: rgba(255,255,255,0.22);
}
.nav-group-header.active-group .nav-item-icon svg { stroke: #000000; }

/* ── Nav item icons ── */
.nav-item-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: rgba(255,255,255,0.1);
  flex-shrink: 0;
  transition: background 0.2s;
}
.nav-item-icon svg {
  display: block;
  stroke: rgba(0, 0, 0, 0.8);
  transition: stroke 0.2s;
}
.nav-group-header:hover .nav-item-icon {
  background: rgba(0, 0, 0, 0.16);
}
.nav-group-header:hover .nav-item-icon svg { stroke: #000000; }

.nav-item-label { flex: 1; line-height: 1.3; }

/* ── Chevron ── */
.nav-chevron {
  display: flex;
  align-items: center;
  transition: transform 0.25s ease;
  opacity: 0.55;
  flex-shrink: 0;
}
.nav-chevron svg { stroke: rgba(0, 0, 0, 0.8); }
.nav-chevron.rotated { transform: rotate(180deg); }

/* ── Submenu ── */
.nav-sub {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}
.nav-sub.open { max-height: 300px; }

.nav-sub-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px 7px 46px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.18s;
  text-decoration: none;
  border-radius: 7px;
  margin: 1px 0;
}
.nav-sub-item svg {
  flex-shrink: 0;
  stroke: rgba(0, 0, 0, 0.45);
  transition: stroke 0.18s;
}
.nav-sub-item:hover {
  color: #000000;
  background: rgba(255,255,255,0.1);
}
.nav-sub-item:hover svg { stroke: rgba(0, 0, 0, 0.9); }
.nav-sub-item.router-link-active,
.nav-sub-item.active {
  color: #000000;
  background: rgba(0, 0, 0, 0.17);
  font-weight: 600;
}
.nav-sub-item.router-link-active svg,
.nav-sub-item.active svg { stroke: #000000; }

/* ── Sidebar Footer ── */
.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.12);
}
.sidebar-footer-icon {
  opacity: 0.3;
  flex-shrink: 0;
}
.sidebar-footer-icon svg { stroke: #000000; display: block; }
.sidebar-footer-text { display: flex; flex-direction: column; gap: 2px; }
.footer-office {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.footer-address {
  font-size: 10px;
  color: rgba(255,255,255,0.28);
}

/* ── Main Content ── */
.main-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>