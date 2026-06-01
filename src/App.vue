<template>
  <div class="app-layout">

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
        <router-link to="/" class="nav-home-link">
          <span class="nav-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          </span>
          <span class="nav-item-label">Dashboard</span>
        </router-link>

        <!-- ── Vehicle Records ── -->
        <div class="nav-section-label">Vehicle Records</div>

        <!-- Reservation group label -->
        <div class="nav-group-label">
          <span class="nav-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
          </span>
          <span>Vehicle Reservation</span>
        </div>

        <router-link to="/reservation/all" class="nav-sub-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          All Files Record
        </router-link>
        <router-link to="/reservation/create" class="nav-sub-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Create New Record
        </router-link>
        <router-link to="/reservation/drivers" class="nav-sub-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Driver Record
        </router-link>

        <!-- Fuel group label -->
        <div class="nav-group-label" style="margin-top: 8px;">
          <span class="nav-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M3 22V8l9-6 9 6v14H3z"/><path d="M10 22V15h4v7"/><line x1="3" y1="11" x2="21" y2="11"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
          </span>
          <span>Fuel &amp; Oil Withdrawal</span>
        </div>

        <router-link to="/fuel/all" class="nav-sub-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          All Files Record
        </router-link>
        <router-link to="/fuel/create" class="nav-sub-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Create New Record
        </router-link>

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
  width: 220px;
  min-width: 220px;
  background: linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 100%);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 2px 0 12px rgba(0,0,0,0.08);
}

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 16px 14px;
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
  color: rgba(0,0,0,0.5);
  margin-top: 3px;
  letter-spacing: 0.3px;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 8px 10px 12px;
  display: flex;
  flex-direction: column;
}

.nav-section-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(0,0,0,0.38);
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 14px 8px 6px;
}

/* ── Home link ── */
.nav-home-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  margin: 4px 0;
  color: rgb(0,0,0);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}
.nav-home-link:hover {
  background: rgba(255,255,255,0.2);
}
.nav-home-link.router-link-active {
  background: rgba(255,255,255,0.28);
  border-left-color: rgba(0,0,0,0.65);
  font-weight: 700;
}

/* ── Group label (non-clickable section title) ── */
.nav-group-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin: 4px 0 2px;
  font-size: 12.5px;
  font-weight: 700;
  color: rgba(0,0,0,0.75);
  border-left: 3px solid rgba(0,0,0,0.2);
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
}

/* ── Nav item icon ── */
.nav-item-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: rgba(255,255,255,0.15);
  flex-shrink: 0;
}
.nav-item-icon svg {
  display: block;
  stroke: rgba(0,0,0,0.75);
}

/* ── Sub items (always visible) ── */
.nav-sub-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px 7px 42px;
  margin: 1px 0;
  color: rgba(0,0,0,0.6);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 7px;
  transition: all 0.18s;
}
.nav-sub-item svg {
  flex-shrink: 0;
  stroke: rgba(0,0,0,0.4);
  transition: stroke 0.18s;
}
.nav-sub-item:hover {
  background: rgba(255,255,255,0.2);
  color: #000000;
}
.nav-sub-item:hover svg { stroke: rgba(0,0,0,0.8); }
.nav-sub-item.router-link-active {
  background: rgba(0,0,0,0.15);
  color: #000000;
  font-weight: 700;
}
.nav-sub-item.router-link-active svg { stroke: #000000; }

/* ── Sidebar Footer ── */
.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.12);
}
.sidebar-footer-icon { opacity: 0.3; flex-shrink: 0; }
.sidebar-footer-icon svg { stroke: #000000; display: block; }
.sidebar-footer-text { display: flex; flex-direction: column; gap: 2px; }
.footer-office {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.footer-address { font-size: 10px; color: rgba(255,255,255,0.28); }

/* ── Main Content ── */
.main-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>