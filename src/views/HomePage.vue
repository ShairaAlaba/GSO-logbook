<template>
  <div>
    <!-- Hero Section -->
    <div class="home-hero">
      <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:24px;">
        <div>
          <br><br>
          <h1 class="hero-title">GSO Logbook System</h1>
        </div>
      </div>
      <br><br>
    </div>

    <div class="page-content">

      <!-- ══════════════════════════════════════════
           SECTION 1 — VEHICLE RECORDS
           ══════════════════════════════════════════ -->
      <div class="section-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="6" width="15" height="10" rx="2.5" fill="#185FA5" opacity="0.22"/>
          <rect x="1" y="6" width="15" height="10" rx="2.5" stroke="#185FA5" stroke-width="1.5"/>
          <path d="M16 9h4l3 5v3h-7V9z" fill="#185FA5" opacity="0.2" stroke="#185FA5" stroke-width="1.4" stroke-linejoin="round"/>
          <circle cx="5.5" cy="19" r="2" fill="#185FA5" opacity="0.3" stroke="#185FA5" stroke-width="1.3"/>
          <circle cx="18.5" cy="19" r="2" fill="#185FA5" opacity="0.3" stroke="#185FA5" stroke-width="1.3"/>
          <path d="M8 19h7" stroke="#185FA5" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        Vehicle Records
      </div>

      <div class="stat-grid" style="margin-top:0;">

        <!-- Reservation -->
        <div class="stat-card" @click="$router.push('/reservation/all')" style="cursor:pointer;">
          <div class="stat-icon">
            <div style="width:48px;height:48px;border-radius:14px;background:#E6F1FB;display:flex;align-items:center;justify-content:center;margin:0 auto;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="13" rx="3" fill="#185FA5" opacity="0.18"/>
                <path d="M5 7l2-4h10l2 4" stroke="#185FA5" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 11h20" stroke="#185FA5" stroke-width="1.4" stroke-linecap="round"/>
                <circle cx="7" cy="15" r="2" fill="#185FA5"/>
                <circle cx="17" cy="15" r="2" fill="#185FA5"/>
                <path d="M9 15h6" stroke="#185FA5" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="stat-number">{{ reservationCount }}</div>
          <div class="stat-label">Reservation Records</div>
        </div>

        <!-- Inspection -->
        <div class="stat-card" @click="$router.push('/inspection/all')" style="cursor:pointer;">
          <div class="stat-icon">
            <div style="width:48px;height:48px;border-radius:14px;background:#EAF3DE;display:flex;align-items:center;justify-content:center;margin:0 auto;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="10.5" cy="10.5" r="6.5" fill="#3B6D11" opacity="0.18"/>
                <circle cx="10.5" cy="10.5" r="6.5" stroke="#3B6D11" stroke-width="1.6"/>
                <path d="M8.5 10.5h4M10.5 8.5v4" stroke="#3B6D11" stroke-width="1.4" stroke-linecap="round"/>
                <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#3B6D11" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="stat-number">{{ inspectionCount }}</div>
          <div class="stat-label">Inspection Records</div>
        </div>

        <!-- Fuel & Oil -->
        <div class="stat-card" @click="$router.push('/fuel/all')" style="cursor:pointer;">
          <div class="stat-icon">
            <div style="width:48px;height:48px;border-radius:14px;background:#FAECE7;display:flex;align-items:center;justify-content:center;margin:0 auto;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="11" height="16" rx="2.5" fill="#993C1D" opacity="0.18"/>
                <rect x="3" y="5" width="11" height="16" rx="2.5" stroke="#993C1D" stroke-width="1.5"/>
                <path d="M6 9h5" stroke="#993C1D" stroke-width="1.4" stroke-linecap="round"/>
                <path d="M14 8h3a2 2 0 0 1 2 2v3.5a1 1 0 0 0 2 0V9l-3-3" stroke="#993C1D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 20h11" stroke="#993C1D" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="stat-number">{{ fuelCount }}</div>
          <div class="stat-label">Fuel &amp; Oil Records</div>
        </div>

      </div><!-- /stat-grid vehicle -->

      <!-- Quick Actions — Vehicle -->
      <div class="card" style="margin-bottom:32px;">
        <div class="card-header">
          <div class="card-title">Quick Actions — Vehicle</div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
            <router-link to="/reservation/create" class="btn btn-quick" style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              New Reservation Record
            </router-link>
            <router-link to="/inspection/create" class="btn btn-quick" style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              New Inspection Record
            </router-link>
            <router-link to="/fuel/create" class="btn btn-quick" style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              New Fuel Record
            </router-link>
          </div>
        </div>
      </div>

      <!-- Vehicle Fleet Summary -->
      <div class="card" style="margin-bottom:32px;">
        <div class="card-header">
          <div class="card-title">Vehicle Fleet Summary (2026)</div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;">
            <div v-for="v in vehicleSummary" :key="v.name"
              class="stat-card" style="padding:12px;cursor:pointer;"
              @click="$router.push('/reservation/all')">
              <div style="margin-bottom:6px;display:flex;justify-content:center;">
                <div style="width:36px;height:36px;border-radius:10px;background:#EAF3DE;display:flex;align-items:center;justify-content:center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="6" width="15" height="10" rx="2.5" fill="#3B6D11" opacity="0.18"/>
                    <rect x="1" y="6" width="15" height="10" rx="2.5" stroke="#3B6D11" stroke-width="1.5"/>
                    <path d="M16 9h4l3 5v3h-7V9z" fill="#3B6D11" opacity="0.18" stroke="#3B6D11" stroke-width="1.4" stroke-linejoin="round"/>
                    <circle cx="5.5" cy="19" r="2" fill="#3B6D11" opacity="0.3" stroke="#3B6D11" stroke-width="1.3"/>
                    <circle cx="18.5" cy="19" r="2" fill="#3B6D11" opacity="0.3" stroke="#3B6D11" stroke-width="1.3"/>
                    <path d="M8 19h7" stroke="#3B6D11" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div style="font-weight:600;font-size:13px;color:#1a4a15;">{{ v.name }}</div>
              <div style="font-size:22px;font-weight:700;color:#3b8132;">{{ v.count }}</div>
              <div style="font-size:11px;color:#6b7280;">trips logged</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════
           SECTION 2 — POW MONITORING
           ══════════════════════════════════════════ -->
      <div class="section-divider"></div>

      <div class="section-label section-label--pow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3" width="14" height="18" rx="3" fill="#BA7517" opacity="0.22"/>
          <rect x="5" y="3" width="14" height="18" rx="3" stroke="#BA7517" stroke-width="1.5"/>
          <path d="M9 3v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="#BA7517" stroke-width="1.3"/>
          <path d="M8.5 10.5h7M8.5 14h5" stroke="#BA7517" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        POW Monitoring
      </div>

      <!-- POW stat card — sits in its own narrower row -->
      <div class="stat-grid stat-grid--pow" style="margin-top:0;">
        <div class="stat-card" @click="$router.push('/pow/all')" style="cursor:pointer;">
          <div class="stat-icon">
            <div style="width:48px;height:48px;border-radius:14px;background:#FAEEDA;display:flex;align-items:center;justify-content:center;margin:0 auto;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="3" width="14" height="18" rx="3" fill="#BA7517" opacity="0.18"/>
                <rect x="5" y="3" width="14" height="18" rx="3" stroke="#BA7517" stroke-width="1.5"/>
                <path d="M9 3v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="#BA7517" stroke-width="1.3"/>
                <path d="M8.5 10.5h7M8.5 14h5" stroke="#BA7517" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="stat-number">{{ powCount }}</div>
          <div class="stat-label">POW Records</div>
        </div>
      </div><!-- /stat-grid pow -->

      <!-- Quick Actions — POW -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <div class="card-title">Quick Actions — POW</div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
            <router-link to="/pow/create" class="btn btn-quick btn-quick--pow" style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              New POW Record
            </router-link>
            <router-link to="/pow/analysis" class="btn btn-quick btn-quick--pow" style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              View POW Analysis
            </router-link>
            <router-link to="/pow/all" class="btn btn-quick btn-quick--pow" style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" fill="currentColor" opacity="0.15"/>
                <line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              All POW Files
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <span style="display:inline-flex;align-items:center;gap:8px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:#FAEEDA;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" fill="#BA7517" opacity="0.2"/>
                  <circle cx="12" cy="12" r="9" stroke="#BA7517" stroke-width="1.8"/>
                  <path d="M12 7v5l3 3" stroke="#BA7517" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              Recent Activity
            </span>
          </div>
        </div>
        <div class="card-body" style="padding:0;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:10px 16px;text-align:left;font-weight:600;color:#374151;">Type</th>
                <th style="padding:10px 16px;text-align:left;font-weight:600;color:#374151;">Record</th>
                <th style="padding:10px 16px;text-align:left;font-weight:600;color:#374151;">Date</th>
                <th style="padding:10px 16px;text-align:left;font-weight:600;color:#374151;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in recentActivity" :key="i" style="border-top:1px solid #f3f4f6;">
                <td style="padding:10px 16px;">
                  <span class="badge" :class="a.badgeClass">{{ a.type }}</span>
                </td>
                <td style="padding:10px 16px;font-weight:500;">{{ a.record }}</td>
                <td style="padding:10px 16px;color:#6b7280;">{{ a.date }}</td>
                <td style="padding:10px 16px;">
                  <span class="badge badge-green">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div><!-- /page-content -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLogbookStore } from '../store/logbook.js'

const store = useLogbookStore()

const reservationCount = computed(() => store.reservationRecords.reduce((t, r) => t + r.rows.length, 0))
const inspectionCount  = computed(() => store.inspectionRecords.reduce((t, r) => t + r.rows.length, 0))
const powCount         = computed(() => store.powRecords.reduce((t, r) => t + r.rows.length, 0))
const fuelCount        = computed(() => store.fuelRecords.reduce((t, r) => t + r.rows.length, 0))

const vehicleSummary = computed(() =>
  store.reservationRecords.filter(r => r.rows.length > 0).map(r => ({ name: r.vehicle, count: r.rows.length }))
)

const recentActivity = [
  { type: 'Reservation', record: '2026 ADVENTURE Log (42 trips)',        date: 'Jan–Feb 2026', badgeClass: 'badge-blue' },
  { type: 'Reservation', record: '2026 FORTUNER Log (50 trips)',         date: 'Jan–Feb 2026', badgeClass: 'badge-blue' },
  { type: 'Inspection',  record: '2026 Pre-Inspection Logbook (10 records)', date: 'Jan–Mar 2026', badgeClass: 'badge-yellow' },
  { type: 'POW',         record: '2026 POW Monitoring (15 records)',     date: 'Jan–Mar 2026', badgeClass: 'badge-green' },
  { type: 'Fuel & Oil',  record: '2026 MARCH Fuel Withdrawal (61 records)', date: 'Mar 2026', badgeClass: 'badge-red' },
]
</script>

<style scoped>
/* ── Hero Title ── */
.hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #f8fff8;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow:
    0 2px 4px rgba(0,0,0,0.35),
    0 4px 16px rgba(0,0,0,0.25),
    0 1px 0px rgba(255,255,255,0.15);
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}

/* ── Section Labels ── */
.section-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #185FA5;
  background: #E6F1FB;
  border: 1px solid #b8d4f0;
  border-radius: 20px;
  padding: 5px 14px;
  margin-bottom: 14px;
}
.section-label--pow {
  color: #BA7517;
  background: #FEF3DC;
  border-color: #f0d49a;
}

/* ── Section Divider ── */
.section-divider {
  border: none;
  border-top: 2px dashed #e5e7eb;
  margin: 8px 0 28px;
}

/* ── POW stat grid — single card, left-aligned, max-width ── */
.stat-grid--pow {
  grid-template-columns: repeat(auto-fill, minmax(180px, 220px));
  justify-content: start;
}

/* ── Quick Action Buttons — Vehicle (green) ── */
.btn-quick {
  background: #8bca84;
  color: #000;
  border: 1.5px solid #72bf6a;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.18s ease;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(59,129,50,0.15);
}
.btn-quick:hover {
  background: #72bf6a;
  border-color: #5aaa52;
  color: #000;
  box-shadow: 0 3px 10px rgba(59,129,50,0.25);
  transform: translateY(-1px);
}
.btn-quick:active { transform: translateY(0); box-shadow: none; }

/* ── Quick Action Buttons — POW (amber) ── */
.btn-quick--pow {
  background: #fde9b8;
  color: #7a4a00;
  border-color: #f0c96a;
  box-shadow: 0 1px 4px rgba(186,117,23,0.12);
}
.btn-quick--pow:hover {
  background: #f5d47a;
  border-color: #d9a832;
  color: #5a3400;
  box-shadow: 0 3px 10px rgba(186,117,23,0.22);
}
</style>