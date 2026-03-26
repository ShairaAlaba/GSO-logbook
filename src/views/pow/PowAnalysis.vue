<template>
  <div class="pow-analysis">
    <!-- ── Page Header ── -->
    <div class="page-header no-print">
      <div>
        <h1>POW Analysis Monitoring</h1>
        <div class="breadcrumb">POW Monitoring → Analysis</div>
      </div>
      <div class="header-controls">
        <select class="form-control" v-model="filterYear" style="width:120px;">
          <option value="">All Years</option>
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
        <button class="btn btn-secondary btn-sm" @click="window.print()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align:-2px;margin-right:5px;"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"/><rect x="6" y="14" width="12" height="8"/></svg>Print
        </button>
      </div>
    </div>

    <!-- ── No data state ── -->
    <div v-if="allRows.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
      </div>
      <div class="empty-text">No POW records found. Create a new record to see analysis.</div>
      <router-link to="/pow/create" class="btn btn-primary">+ Create First Record</router-link>
    </div>

    <div v-else class="page-content">

      <!-- ══════════════════════════════════════
           KPI SUMMARY CARDS
      ══════════════════════════════════════ -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-total">
          <div class="kpi-icon kpi-icon-total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-value">{{ allRows.length }}</div>
            <div class="kpi-label">Total POW Entries</div>
          </div>
        </div>
        <div class="kpi-card kpi-cost">
          <div class="kpi-icon kpi-icon-cost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-value">₱{{ formatNumber(totalAppropriation) }}</div>
            <div class="kpi-label">Total Appropriation Cost</div>
          </div>
        </div>
        <div class="kpi-card kpi-completed">
          <div class="kpi-icon kpi-icon-completed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-value">{{ completedCount }}</div>
            <div class="kpi-label">Completed</div>
          </div>
        </div>
        <div class="kpi-card kpi-pending">
          <div class="kpi-icon kpi-icon-pending">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-value">{{ pendingCount }}</div>
            <div class="kpi-label">Pending / In Progress</div>
          </div>
        </div>
        <div class="kpi-card kpi-labor">
          <div class="kpi-icon kpi-icon-labor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-value">₱{{ formatNumber(totalLabor) }}</div>
            <div class="kpi-label">Total Labor Cost</div>
          </div>
        </div>
        <div class="kpi-card kpi-materials">
          <div class="kpi-icon kpi-icon-materials">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-value">₱{{ formatNumber(totalMaterials) }}</div>
            <div class="kpi-label">Total Materials Cost</div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════
           CHARTS ROW 1 — Cost Breakdown + Type Distribution
      ══════════════════════════════════════ -->
      <div class="charts-row">

        <!-- Cost Breakdown Bar -->
        <div class="chart-card" style="flex:2;">
          <div class="chart-card-header">
            <h3>Cost Breakdown by Category</h3>
            <span class="chart-badge">₱</span>
          </div>
          <div class="bar-chart-wrap">
            <div
              v-for="item in costBreakdown"
              :key="item.label"
              class="bar-row"
            >
              <div class="bar-label">{{ item.label }}</div>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :class="item.cls"
                  :style="{ width: item.pct + '%' }"
                ></div>
              </div>
              <div class="bar-value">₱{{ formatNumber(item.value) }}</div>
            </div>
          </div>
        </div>

        <!-- Requester Type Donut -->
        <div class="chart-card" style="flex:1;">
          <div class="chart-card-header">
            <h3>By Requester Type</h3>
          </div>
          <div class="donut-wrap">
            <svg viewBox="0 0 120 120" class="donut-svg">
              <template v-for="(seg, i) in donutSegments" :key="i">
                <circle
                  :cx="60" :cy="60" :r="45"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="22"
                  :stroke-dasharray="seg.dash"
                  :stroke-dashoffset="seg.offset"
                  transform="rotate(-90 60 60)"
                />
              </template>
              <text x="60" y="55" text-anchor="middle" class="donut-center-value">{{ allRows.length }}</text>
              <text x="60" y="68" text-anchor="middle" class="donut-center-label">Total</text>
            </svg>
            <div class="donut-legend">
              <div v-for="(seg, i) in donutSegments" :key="i" class="legend-item">
                <span class="legend-dot" :style="{ background: seg.color }"></span>
                <span class="legend-text">{{ seg.label }}</span>
                <span class="legend-count">{{ seg.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════
           CHARTS ROW 2 — Top Departments + Completion Timeline
      ══════════════════════════════════════ -->
      <div class="charts-row">

        <!-- Top Departments -->
        <div class="chart-card" style="flex:1;">
          <div class="chart-card-header">
            <h3>Top 10 Departments / Units</h3>
          </div>
          <div class="hbar-wrap">
            <div
              v-for="(dept, i) in topDepts"
              :key="dept.name"
              class="hbar-row"
            >
              <div class="hbar-rank">{{ i + 1 }}</div>
              <div class="hbar-name" :title="dept.name">{{ dept.name }}</div>
              <div class="hbar-track">
                <div class="hbar-fill" :style="{ width: dept.pct + '%' }"></div>
              </div>
              <div class="hbar-count">{{ dept.count }}</div>
            </div>
          </div>
        </div>

        <!-- Monthly Volume (requests per month/year group) -->
        <div class="chart-card" style="flex:1.5;">
          <div class="chart-card-header">
            <h3>POW Requests by Month (Date Request)</h3>
          </div>
          <div class="vol-chart-wrap">
            <div class="vol-chart">
              <template v-for="(item, i) in monthlyVolume" :key="i">
                <div class="vol-col">
                  <div class="vol-label-top">{{ item.count > 0 ? item.count : '' }}</div>
                  <div
                    class="vol-bar"
                    :style="{ height: item.pct + '%' }"
                    :title="`${item.label}: ${item.count} requests`"
                  ></div>
                  <div class="vol-label">{{ item.label }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════
           CHARTS ROW 3 — Source of Fund + Account Code
      ══════════════════════════════════════ -->
      <div class="charts-row">

        <!-- Source of Fund -->
        <div class="chart-card" style="flex:1;">
          <div class="chart-card-header">
            <h3>Source of Fund</h3>
          </div>
          <div class="tag-cloud-wrap">
            <div
              v-for="item in sourcesOfFund"
              :key="item.name"
              class="tag-item"
              :style="{ fontSize: tagSize(item.count, sourcesOfFund) + 'px' }"
            >
              {{ item.name }}
              <span class="tag-count">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- Prepared By -->
        <div class="chart-card" style="flex:1;">
          <div class="chart-card-header">
            <h3>Prepared By (Top Engineers)</h3>
          </div>
          <div class="hbar-wrap">
            <div v-for="(eng, i) in topEngineers" :key="eng.name" class="hbar-row">
              <div class="hbar-rank eng">{{ i + 1 }}</div>
              <div class="hbar-name" :title="eng.name">{{ eng.name }}</div>
              <div class="hbar-track">
                <div class="hbar-fill eng-fill" :style="{ width: eng.pct + '%' }"></div>
              </div>
              <div class="hbar-count">{{ eng.count }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════
           COMPLETION RATE ANALYSIS
      ══════════════════════════════════════ -->
      <div class="chart-card full-width">
        <div class="chart-card-header">
          <h3>Completion Status Analysis</h3>
          <span class="chart-badge completion-badge">
            {{ completionRate }}% Completion Rate
          </span>
        </div>
        <div class="completion-grid">
          <div class="completion-meter">
            <div class="meter-bar-bg">
              <div class="meter-bar-fill completed-fill" :style="{ width: completionRate + '%' }">
                <span v-if="completionRate > 15" class="meter-label">Completed {{ completionRate }}%</span>
              </div>
            </div>
            <div class="meter-bar-bg" style="margin-top:6px;">
              <div class="meter-bar-fill pending-fill" :style="{ width: (100 - completionRate) + '%' }">
                <span v-if="(100 - completionRate) > 15" class="meter-label">Pending {{ 100 - completionRate }}%</span>
              </div>
            </div>
          </div>

          <!-- Duration stats -->
          <div class="duration-stats">
            <div class="dur-stat">
              <div class="dur-val">{{ avgDurationDays }} days</div>
              <div class="dur-label">Avg. Completion Duration</div>
            </div>
            <div class="dur-stat">
              <div class="dur-val">{{ fastestDays }} days</div>
              <div class="dur-label">Fastest Completion</div>
            </div>
            <div class="dur-stat">
              <div class="dur-val">{{ slowestDays }} days</div>
              <div class="dur-label">Slowest Completion</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════
           REVISION ANALYSIS
      ══════════════════════════════════════ -->
      <div class="charts-row">
        <div class="chart-card" style="flex:1;">
          <div class="chart-card-header">
            <h3>Revision Frequency</h3>
          </div>
          <div class="hbar-wrap">
            <div v-for="(rev, i) in revisionGroups" :key="rev.label" class="hbar-row">
              <div class="hbar-name" style="min-width:70px;">{{ rev.label }}</div>
              <div class="hbar-track">
                <div class="hbar-fill rev-fill" :style="{ width: rev.pct + '%' }"></div>
              </div>
              <div class="hbar-count">{{ rev.count }}</div>
            </div>
          </div>
        </div>

        <!-- Account Code -->
        <div class="chart-card" style="flex:1;">
          <div class="chart-card-header">
            <h3>Account Code Breakdown</h3>
          </div>
          <div class="hbar-wrap">
            <div v-for="(ac, i) in accountCodes" :key="ac.name" class="hbar-row">
              <div class="hbar-rank">{{ i + 1 }}</div>
              <div class="hbar-name" :title="ac.name">{{ ac.name || '(blank)' }}</div>
              <div class="hbar-track">
                <div class="hbar-fill ac-fill" :style="{ width: ac.pct + '%' }"></div>
              </div>
              <div class="hbar-count">{{ ac.count }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════
           DETAILED TABLE — Recent / Filtered Records
      ══════════════════════════════════════ -->
      <div class="chart-card full-width">
        <div class="chart-card-header">
          <h3>Detailed Records Table</h3>
          <div style="display:flex;gap:8px;align-items:center;">
            <input
              class="form-control"
              v-model="tableSearch"
              placeholder="Search…"
              style="width:200px;height:32px;font-size:13px;"
            />
            <span class="chart-badge">{{ tableRows.length }} rows</span>
          </div>
        </div>
        <div class="detail-table-wrap">
          <table class="detail-table">
            <thead>
              <tr>
                <th>#</th>
                <th>POW No.</th>
                <th>Date Request</th>
                <th>Requisitioner</th>
                <th>Dept / Unit</th>
                <th>POW Title</th>
                <th>Appropriation</th>
                <th>Labor</th>
                <th>Materials</th>
                <th>Date Started</th>
                <th>Date Completed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in tableRows.slice(0, 100)"
                :key="i"
                :class="{ 'row-completed': row[21], 'row-pending': !row[21] }"
              >
                <td>{{ i + 1 }}</td>
                <td class="mono">{{ row[1] }}</td>
                <td>{{ row[4] }}</td>
                <td>{{ row[5] }}</td>
                <td>{{ row[7] }}</td>
                <td class="title-cell" :title="row[10]">{{ truncate(row[10], 40) }}</td>
                <td class="num-cell">{{ row[15] ? '₱' + formatNumber(parseNum(row[15])) : '—' }}</td>
                <td class="num-cell">{{ row[12] ? '₱' + formatNumber(parseNum(row[12])) : '—' }}</td>
                <td class="num-cell">{{ row[13] ? '₱' + formatNumber(parseNum(row[13])) : '—' }}</td>
                <td>{{ row[20] }}</td>
                <td>{{ row[21] }}</td>
                <td>
                  <span class="status-badge" :class="row[21] ? 'status-done' : 'status-pend'">
                    <svg v-if="row[21]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11" style="vertical-align:-1px;margin-right:3px;"><polyline points="20,6 9,17 4,12"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11" style="vertical-align:-1px;margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                    {{ row[21] ? 'Done' : 'Pending' }}
                  </span>
                </td>
              </tr>
              <tr v-if="tableRows.length > 100">
                <td colspan="12" class="more-rows">
                  … and {{ tableRows.length - 100 }} more rows. Use the search to filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div><!-- end page-content -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'

const store = useLogbookStore()
const filterYear = ref('')
const tableSearch = ref('')

/* ── Column index constants (matches CreateRecord.vue headers) ──
  0: Tabbing No.        1: POW No.          2: Online Request No.
  3: QR Code            4: Date Request     5: Requisitioner
  6: Contact No.        7: College/Dept     8: Specifics
  9: Prepare By        10: POW Title       11: Equipment Expenses
 12: Labor Cost        13: Materials Cost  14: Sub-Total Indirect
 15: Appropriation     16: Revision No.    17: Source of Fund
 18: Account Code      19: Type of Req.    20: Date Started
 21: Date Completed    22: Date Returned   23: Received By
 24: Date Approved
*/

/* ── Flatten all rows across all records, with optional year filter ── */
const allRows = computed(() => {
  const rows = []
  const fy = filterYear.value
  for (const rec of store.powRecords) {
    if (fy && rec.year !== fy) continue
    for (const row of rec.rows) {
      if (row && row.some(c => c && String(c).trim())) rows.push(row)
    }
  }
  return rows
})

const availableYears = computed(() => {
  return [...new Set(store.powRecords.map(r => r.year))].sort((a, b) => b - a)
})

/* ── KPIs ── */
const parseNum = (v) => {
  if (!v) return 0
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''))
  return isNaN(n) ? 0 : n
}

const totalAppropriation = computed(() =>
  allRows.value.reduce((s, r) => s + parseNum(r[15]), 0)
)
const totalLabor = computed(() =>
  allRows.value.reduce((s, r) => s + parseNum(r[12]), 0)
)
const totalMaterials = computed(() =>
  allRows.value.reduce((s, r) => s + parseNum(r[13]), 0)
)
const totalEquipment = computed(() =>
  allRows.value.reduce((s, r) => s + parseNum(r[11]), 0)
)
const completedCount = computed(() =>
  allRows.value.filter(r => r[21] && String(r[21]).trim()).length
)
const pendingCount = computed(() => allRows.value.length - completedCount.value)
const completionRate = computed(() =>
  allRows.value.length
    ? Math.round((completedCount.value / allRows.value.length) * 100)
    : 0
)

/* ── Completion duration ── */
const durations = computed(() => {
  return allRows.value
    .filter(r => r[20] && r[21] && String(r[20]).trim() && String(r[21]).trim())
    .map(r => {
      const d1 = new Date(String(r[20]).replace(/ .*/, ''))
      const d2 = new Date(String(r[21]).replace(/ .*/, ''))
      return Math.max(0, Math.round((d2 - d1) / 86400000))
    })
    .filter(d => !isNaN(d))
})
const avgDurationDays = computed(() =>
  durations.value.length
    ? Math.round(durations.value.reduce((a, b) => a + b, 0) / durations.value.length)
    : '—'
)
const fastestDays = computed(() => durations.value.length ? Math.min(...durations.value) : '—')
const slowestDays = computed(() => durations.value.length ? Math.max(...durations.value) : '—')

/* ── Cost Breakdown Bar ── */
const costBreakdown = computed(() => {
  const items = [
    { label: 'Equipment', value: totalEquipment.value, cls: 'fill-eq' },
    { label: 'Labor', value: totalLabor.value, cls: 'fill-lab' },
    { label: 'Materials', value: totalMaterials.value, cls: 'fill-mat' },
    { label: 'Appropriation', value: totalAppropriation.value, cls: 'fill-app' },
  ]
  const max = Math.max(...items.map(i => i.value), 1)
  return items.map(i => ({ ...i, pct: Math.round((i.value / max) * 100) }))
})

/* ── Donut — Requester Type ── */
const donutSegments = computed(() => {
  const map = {}
  for (const r of allRows.value) {
    const k = (r[19] || 'Unspecified').trim() || 'Unspecified'
    map[k] = (map[k] || 0) + 1
  }
  const colors = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2']
  const total = allRows.value.length || 1
  const circ = 2 * Math.PI * 45
  let offset = 0
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], i) => {
      const dash = (count / total) * circ
      const seg = { label, count, color: colors[i % colors.length], dash: `${dash} ${circ - dash}`, offset: -offset }
      offset += dash
      return seg
    })
})

/* ── Top Departments ── */
const topDepts = computed(() => {
  const map = {}
  for (const r of allRows.value) {
    const k = (r[7] || 'Unknown').trim() || 'Unknown'
    map[k] = (map[k] || 0) + 1
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const max = sorted[0]?.[1] || 1
  return sorted.map(([name, count]) => ({ name, count, pct: Math.round((count / max) * 100) }))
})

/* ── Top Engineers ── */
const topEngineers = computed(() => {
  const map = {}
  for (const r of allRows.value) {
    const k = (r[9] || 'Unknown').trim() || 'Unknown'
    map[k] = (map[k] || 0) + 1
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const max = sorted[0]?.[1] || 1
  return sorted.map(([name, count]) => ({ name, count, pct: Math.round((count / max) * 100) }))
})

/* ── Monthly Volume ── */
const monthlyVolume = computed(() => {
  const map = {}
  for (const r of allRows.value) {
    const d = String(r[4] || '').trim()
    if (!d || d.length < 7) continue
    const key = d.slice(0, 7) // YYYY-MM
    map[key] = (map[key] || 0) + 1
  }
  const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  const max = Math.max(...sorted.map(s => s[1]), 1)
  return sorted.slice(-18).map(([key, count]) => {
    const [y, m] = key.split('-')
    const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return { label: `${mo[parseInt(m) - 1]} '${y.slice(2)}`, count, pct: Math.round((count / max) * 100) }
  })
})

/* ── Source of Fund ── */
const sourcesOfFund = computed(() => {
  const map = {}
  for (const r of allRows.value) {
    const k = (r[17] || '').trim()
    if (!k) continue
    map[k] = (map[k] || 0) + 1
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([name, count]) => ({ name, count }))
})

/* ── Revisions ── */
const revisionGroups = computed(() => {
  const map = {}
  for (const r of allRows.value) {
    const raw = String(r[16] || '').trim()
    const k = raw.match(/REV\.?\s*0+$/i) ? 'Rev. 00 (Original)' :
              raw.match(/REV\.?\s*0?1/i) ? 'Rev. 01 (1st Revision)' :
              raw.match(/REV\.?\s*0?2/i) ? 'Rev. 02 (2nd Revision)' :
              raw ? raw : 'No Revision Info'
    map[k] = (map[k] || 0) + 1
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
  const max = sorted[0]?.[1] || 1
  return sorted.map(([label, count]) => ({ label, count, pct: Math.round((count / max) * 100) }))
})

/* ── Account Codes ── */
const accountCodes = computed(() => {
  const map = {}
  for (const r of allRows.value) {
    const k = (r[18] || '').trim() || '(blank)'
    map[k] = (map[k] || 0) + 1
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const max = sorted[0]?.[1] || 1
  return sorted.map(([name, count]) => ({ name, count, pct: Math.round((count / max) * 100) }))
})

/* ── Detailed table ── */
const tableRows = computed(() => {
  const s = tableSearch.value.toLowerCase()
  if (!s) return allRows.value
  return allRows.value.filter(r => r.some(c => c && String(c).toLowerCase().includes(s)))
})

/* ── Helpers ── */
const formatNumber = (n) => {
  if (!n || n === 0) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toFixed(2)
}
const truncate = (s, len) => s && s.length > len ? s.slice(0, len) + '…' : (s || '')
const tagSize = (count, arr) => {
  const max = Math.max(...arr.map(a => a.count), 1)
  return Math.round(11 + (count / max) * 8)
}
</script>

<style scoped>
/* ─── Layout ─────────────────────────────── */
.pow-analysis { padding-bottom: 40px; }
.header-controls { display: flex; gap: 10px; align-items: center; }
.page-content { display: flex; flex-direction: column; gap: 20px; }

/* ─── Empty ─────────────────────────────── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 20px; gap: 16px;
  color: #6b7280; text-align: center;
}
.empty-icon { color: #9ca3af; }
.empty-text { font-size: 16px; }

/* ─── KPI Grid ───────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 768px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }

.kpi-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 20px;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  border-left: 4px solid #2563eb;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: transform 0.15s;
}
.kpi-card:hover { transform: translateY(-2px); }
.kpi-total { border-left-color: #2563eb; }
.kpi-cost  { border-left-color: #16a34a; }
.kpi-completed { border-left-color: #059669; }
.kpi-pending { border-left-color: #f59e0b; }
.kpi-labor { border-left-color: #dc2626; }
.kpi-materials { border-left-color: #7c3aed; }

.kpi-icon {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.kpi-icon svg { display: block; }
.kpi-icon-total     { background: #eff6ff; color: #2563eb; }
.kpi-icon-total svg { stroke: #2563eb; }
.kpi-icon-cost      { background: #f0fdf4; color: #16a34a; }
.kpi-icon-cost svg  { stroke: #16a34a; }
.kpi-icon-completed     { background: #f0fdf4; }
.kpi-icon-completed svg { stroke: #059669; }
.kpi-icon-pending     { background: #fffbeb; }
.kpi-icon-pending svg { stroke: #d97706; }
.kpi-icon-labor     { background: #fef2f2; }
.kpi-icon-labor svg { stroke: #dc2626; }
.kpi-icon-materials     { background: #faf5ff; }
.kpi-icon-materials svg { stroke: #7c3aed; }
.kpi-value { font-size: 22px; font-weight: 700; color: var(--text, #111827); line-height: 1; }
.kpi-label { font-size: 12px; color: #6b7280; margin-top: 3px; }

/* ─── Charts layout ──────────────────────── */
.charts-row { display: flex; gap: 16px; }
@media (max-width: 900px) { .charts-row { flex-direction: column; } }

/* ─── Chart Card ─────────────────────────── */
.chart-card {
  background: var(--card-bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  min-width: 0;
}
.full-width { width: 100%; }
.chart-card-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 14px;
}
.chart-card-header h3 {
  font-size: 14px; font-weight: 600;
  color: var(--text, #111827);
  margin: 0;
}
.chart-badge {
  font-size: 11px; font-weight: 600;
  background: #eff6ff; color: #2563eb;
  padding: 3px 8px; border-radius: 20px;
}
.completion-badge { background: #dcfce7; color: #16a34a; }

/* ─── Bar chart (cost breakdown) ─────────── */
.bar-chart-wrap { display: flex; flex-direction: column; gap: 10px; }
.bar-row { display: flex; align-items: center; gap: 10px; }
.bar-label { font-size: 12px; color: #374151; width: 90px; flex-shrink: 0; }
.bar-track { flex: 1; background: #f3f4f6; border-radius: 4px; height: 18px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.fill-eq  { background: #f59e0b; }
.fill-lab { background: #dc2626; }
.fill-mat { background: #7c3aed; }
.fill-app { background: #2563eb; }
.bar-value { font-size: 12px; color: #374151; width: 80px; text-align: right; font-variant-numeric: tabular-nums; }

/* ─── Donut ──────────────────────────────── */
.donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.donut-svg { width: 120px; height: 120px; }
.donut-center-value { font-size: 18px; font-weight: 700; fill: var(--text, #111827); }
.donut-center-label { font-size: 8px; fill: #6b7280; }
.donut-legend { display: flex; flex-direction: column; gap: 5px; width: 100%; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-text { flex: 1; color: #374151; }
.legend-count { font-weight: 600; color: #111827; }

/* ─── Horizontal bars (depts, engineers) ─── */
.hbar-wrap { display: flex; flex-direction: column; gap: 8px; }
.hbar-row { display: flex; align-items: center; gap: 8px; }
.hbar-rank { font-size: 11px; color: #9ca3af; width: 16px; flex-shrink: 0; }
.hbar-rank.eng { background: #eff6ff; color: #2563eb; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
.hbar-name { font-size: 12px; color: #374151; width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; }
.hbar-track { flex: 1; background: #f3f4f6; border-radius: 4px; height: 14px; overflow: hidden; }
.hbar-fill { height: 100%; border-radius: 4px; background: #2563eb; transition: width 0.5s; }
.eng-fill { background: #16a34a; }
.rev-fill { background: #7c3aed; }
.ac-fill  { background: #0891b2; }
.hbar-count { font-size: 12px; font-weight: 600; color: #111827; width: 28px; text-align: right; }

/* ─── Monthly volume bars ────────────────── */
.vol-chart-wrap { overflow-x: auto; padding-bottom: 4px; }
.vol-chart {
  display: flex; align-items: flex-end; gap: 6px;
  height: 130px; min-width: min-content;
}
.vol-col { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 36px; }
.vol-bar {
  width: 28px; min-height: 4px;
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
  border-radius: 3px 3px 0 0;
  transition: height 0.5s;
}
.vol-label { font-size: 10px; color: #9ca3af; white-space: nowrap; }
.vol-label-top { font-size: 10px; color: #374151; font-weight: 600; min-height: 14px; }

/* ─── Tag cloud (source of fund) ────────── */
.tag-cloud-wrap { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.tag-item {
  background: #eff6ff; color: #1e40af;
  border-radius: 16px;
  padding: 4px 10px;
  font-weight: 500;
  line-height: 1.4;
  display: flex; align-items: center; gap: 5px;
}
.tag-count { font-size: 10px; background: #dbeafe; border-radius: 10px; padding: 0 5px; }

/* ─── Completion meter ────────────────────── */
.completion-grid { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
.completion-meter { flex: 2; min-width: 200px; }
.meter-bar-bg { background: #f3f4f6; border-radius: 6px; height: 28px; overflow: hidden; position: relative; }
.meter-bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; transition: width 0.6s; }
.completed-fill { background: linear-gradient(90deg, #16a34a, #22c55e); }
.pending-fill   { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.meter-label { font-size: 12px; font-weight: 600; color: #fff; padding-left: 10px; white-space: nowrap; }

.duration-stats { display: flex; gap: 20px; flex-wrap: wrap; }
.dur-stat { text-align: center; }
.dur-val  { font-size: 22px; font-weight: 700; color: #2563eb; }
.dur-label { font-size: 11px; color: #6b7280; }

/* ─── Detail table ────────────────────────── */
.detail-table-wrap { overflow-x: auto; }
.detail-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.detail-table th {
  background: #f9fafb; color: #374151;
  font-weight: 600; text-align: left;
  padding: 8px 10px; border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}
.detail-table td {
  padding: 7px 10px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: top;
}
.detail-table tr:hover td { background: #f0f9ff; }
.row-completed td { }
.row-pending td { }
.mono { font-family: monospace; font-size: 11px; }
.num-cell { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.title-cell { max-width: 200px; }

.status-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.status-done { background: #dcfce7; color: #166534; }
.status-pend { background: #fef9c3; color: #854d0e; }

.more-rows { text-align: center; color: #9ca3af; font-style: italic; padding: 12px; }

/* ─── Print ──────────────────────────────── */
@media print {
  .header-controls, .no-print { display: none !important; }
  .kpi-card { break-inside: avoid; }
  .chart-card { break-inside: avoid; }
}
</style>