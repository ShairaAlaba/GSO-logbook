<template>
  <div>
    <div class="page-header no-print">
      <div>
        <h1>Driver Record</h1>
        <div class="breadcrumb">Reservation of Vehicle → Driver Record</div>
      </div>
    </div>

    <div class="page-content">

      <!-- Controls -->
      <div class="filter-bar no-print" style="flex-wrap:wrap;gap:12px;margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:32px;height:32px;border-radius:9px;background:#E6F1FB;display:flex;align-items:center;justify-content:center;">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#185FA5" opacity="0.25"/>
              <circle cx="12" cy="8" r="4" stroke="#185FA5" stroke-width="1.6"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#185FA5" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </div>
          <select class="form-control" v-model="selectedDriver" style="min-width:180px;">
            <option value="">All Drivers</option>
            <option v-for="d in allDrivers" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>

        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:32px;height:32px;border-radius:9px;background:#FAEEDA;display:flex;align-items:center;justify-content:center;">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="3" fill="#BA7517" opacity="0.18"/>
              <rect x="3" y="4" width="18" height="17" rx="3" stroke="#BA7517" stroke-width="1.5"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#BA7517" stroke-width="1.4" stroke-linecap="round"/>
              <circle cx="8" cy="15" r="1.2" fill="#BA7517"/>
              <circle cx="12" cy="15" r="1.2" fill="#BA7517"/>
              <circle cx="16" cy="15" r="1.2" fill="#BA7517"/>
            </svg>
          </div>
          <select class="form-control" v-model="selectedMonth">
            <option v-for="(m, i) in monthNames" :key="i" :value="i">{{ m }}</option>
          </select>
          <select class="form-control" v-model="selectedYear">
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <div style="display:flex;align-items:center;gap:6px;margin-left:auto;">
          <button class="btn btn-secondary btn-sm" @click="prevMonth" style="display:inline-flex;align-items:center;gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Prev
          </button>
          <button class="btn btn-secondary btn-sm" @click="goToday" style="display:inline-flex;align-items:center;gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            Today
          </button>
          <button class="btn btn-secondary btn-sm" @click="nextMonth" style="display:inline-flex;align-items:center;gap:5px;">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Month/Year heading + legend -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div style="font-size:20px;font-weight:700;color:#1a4a15;">
          {{ monthNames[selectedMonth] }} {{ selectedYear }}
          <span v-if="selectedDriver" style="font-size:14px;font-weight:400;color:#6b7280;margin-left:10px;">— {{ selectedDriver }}</span>
        </div>
        <div style="display:flex;align-items:center;gap:14px;font-size:11px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#22c55e;"></span>
            <span style="color:#6b7280;">Completed</span>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#eab308;"></span>
            <span style="color:#6b7280;">Pending</span>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#ef4444;"></span>
            <span style="color:#6b7280;">Cancelled</span>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#e0e7ff;border-left:3px solid #4338ca;"></span>
            <span style="color:#6b7280;">Reservation</span>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#ede9fe;border-left:3px dashed #7c3aed;"></span>
            <span style="color:#6b7280;">Pre-booking</span>
          </div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="card" style="padding:0;overflow:hidden;">
        <!-- Day name headers -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);background:#f8fafc;border-bottom:1px solid #e5e7eb;">
          <div v-for="d in dayNames" :key="d"
            style="padding:10px 6px;text-align:center;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:0.05em;text-transform:uppercase;">
            {{ d }}
          </div>
        </div>

        <!-- Calendar body -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);">
          <!-- Leading empty cells -->
          <div v-for="e in firstDayOfMonth" :key="'e'+e"
            style="min-height:115px;border-right:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;background:#fafafa;">
          </div>

          <!-- Day cells -->
          <div v-for="day in daysInMonth" :key="day"
            :style="dayCellStyle(day)"
            style="min-height:115px;border-right:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;padding:6px 5px;position:relative;">

            <!-- Day number -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
              <span :style="dayNumStyle(day)"
                style="font-size:12px;font-weight:600;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;">
                {{ day }}
              </span>
              <span v-if="tripsForDay(day).length > 0" style="font-size:9px;color:#9ca3af;">
                {{ tripsForDay(day).length }}
              </span>
            </div>

            <!-- Trip chips — ALL trips on this day shown (multi-vehicle/multi-time support) -->
            <div v-for="(trip, ti) in tripsForDay(day)" :key="ti"
              :style="tripChipStyle(trip)"
              style="border-radius:4px;padding:2px 4px;margin-bottom:3px;font-size:9.5px;cursor:pointer;line-height:1.35;word-break:break-word;"
              @click="openModal(trip)">
              <!-- Row 1: vehicle + type badge -->
              <div style="display:flex;align-items:center;gap:2px;margin-bottom:1px;">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
                  <rect x="2" y="8" width="20" height="11" rx="2.5" fill="currentColor" opacity="0.3"/>
                  <path d="M5 8l2-4h10l2 4" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <circle cx="7" cy="16" r="2" fill="currentColor"/>
                  <circle cx="17" cy="16" r="2" fill="currentColor"/>
                </svg>
                <span style="font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  {{ trip.vehicle }}
                </span>
                <span style="font-size:8px;opacity:0.75;font-weight:600;flex-shrink:0;">
                  {{ trip.isReservation ? 'RES' : 'PRE' }}
                </span>
              </div>
              <!-- Row 2: time + driver -->
              <div style="display:flex;align-items:center;gap:2px;opacity:0.85;">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.2"/>
                  <path d="M12 8v4l2.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ trip.time || '—' }} · {{ trip.driver }}</span>
              </div>
            </div>
          </div>

          <!-- Trailing empty cells -->
          <div v-for="t in trailingCells" :key="'t'+t"
            style="min-height:115px;border-right:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;background:#fafafa;">
          </div>
        </div>
      </div>

      <!-- Summary stats -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-top:20px;">

        <div class="stat-card" style="padding:14px 16px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#EAF3DE;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="13" rx="3" fill="#3B6D11" opacity="0.18"/>
              <path d="M5 7l2-4h10l2 4" stroke="#3B6D11" stroke-width="1.5" stroke-linejoin="round"/>
              <circle cx="7" cy="15" r="2" fill="#3B6D11"/>
              <circle cx="17" cy="15" r="2" fill="#3B6D11"/>
              <path d="M9 15h6" stroke="#3B6D11" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          </div>
          <div style="font-size:24px;font-weight:700;color:#1a4a15;">{{ monthStats.total }}</div>
          <div style="font-size:12px;color:#6b7280;">Total Trips</div>
        </div>

        <div class="stat-card" style="padding:14px 16px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="#16a34a" opacity="0.15"/>
              <circle cx="12" cy="12" r="9" stroke="#16a34a" stroke-width="1.6"/>
              <path d="M8 12l3 3 5-5" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div style="font-size:24px;font-weight:700;color:#15803d;">{{ monthStats.completed }}</div>
          <div style="font-size:12px;color:#6b7280;">Completed</div>
        </div>

        <div class="stat-card" style="padding:14px 16px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#fef9c3;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="#ca8a04" opacity="0.15"/>
              <circle cx="12" cy="12" r="9" stroke="#ca8a04" stroke-width="1.6"/>
              <path d="M12 8v4" stroke="#ca8a04" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#ca8a04"/>
            </svg>
          </div>
          <div style="font-size:24px;font-weight:700;color:#a16207;">{{ monthStats.pending }}</div>
          <div style="font-size:12px;color:#6b7280;">Pending</div>
        </div>

        <div class="stat-card" style="padding:14px 16px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#fee2e2;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="#dc2626" opacity="0.15"/>
              <circle cx="12" cy="12" r="9" stroke="#dc2626" stroke-width="1.6"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div style="font-size:24px;font-weight:700;color:#b91c1c;">{{ monthStats.cancelled }}</div>
          <div style="font-size:12px;color:#6b7280;">Cancelled</div>
        </div>

        <div class="stat-card" style="padding:14px 16px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#ede9fe;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="3" fill="#7c3aed" opacity="0.15"/>
              <rect x="3" y="4" width="18" height="17" rx="3" stroke="#7c3aed" stroke-width="1.5"/>
              <path d="M8 2v4M16 2v4M3 10h18" stroke="#7c3aed" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          </div>
          <div style="font-size:24px;font-weight:700;color:#5b21b6;">{{ monthStats.daysWorked }}</div>
          <div style="font-size:12px;color:#6b7280;">Days Active</div>
        </div>

        <div class="stat-card" style="padding:14px 16px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#E6F1FB;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#185FA5" opacity="0.2"/>
              <circle cx="12" cy="8" r="4" stroke="#185FA5" stroke-width="1.6"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#185FA5" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </div>
          <div style="font-size:24px;font-weight:700;color:#0c447c;">{{ monthStats.driversActive }}</div>
          <div style="font-size:12px;color:#6b7280;">Active Drivers</div>
        </div>

      </div>
    </div>

    <!-- Trip Detail Modal -->
    <Teleport to="body">
      <div v-if="modalTrip"
        style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;"
        @click.self="closeModal">
        <div style="background:#fff;border-radius:16px;padding:26px 26px 22px;width:100%;max-width:500px;box-shadow:0 24px 64px rgba(0,0,0,0.18);max-height:90vh;overflow-y:auto;">

          <!-- Modal header -->
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">
            <div>
              <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:5px;">
                <span :style="{ background: statusBg(modalTrip.rawStatus), color: statusColor(modalTrip.rawStatus) }"
                  style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;">
                  {{ statusLabel(modalTrip.rawStatus) }}
                </span>
                <span :style="{ background: modalTrip.isReservation ? '#e0e7ff' : '#ede9fe', color: modalTrip.isReservation ? '#3730a3' : '#6d28d9' }"
                  style="font-size:11px;font-weight:600;padding:2px 10px;border-radius:20px;">
                  {{ modalTrip.isReservation ? 'Reservation Vehicle' : 'Pre-booking Vehicle' }}
                </span>
              </div>
              <div style="font-size:19px;font-weight:700;color:#111827;">{{ modalTrip.vehicle }}</div>
            </div>
            <button @click="closeModal"
              style="background:none;border:none;cursor:pointer;padding:4px;color:#9ca3af;border-radius:6px;display:flex;align-items:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Detail rows -->
          <div style="display:grid;gap:10px;">

            <div style="display:flex;align-items:flex-start;gap:10px;">
              <div style="width:28px;height:28px;border-radius:8px;background:#E6F1FB;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="#185FA5" opacity="0.3"/>
                  <circle cx="12" cy="8" r="4" stroke="#185FA5" stroke-width="1.6"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#185FA5" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Driver</div>
                <div style="font-size:14px;font-weight:600;color:#111827;">{{ modalTrip.driver || 'Unassigned' }}</div>
              </div>
            </div>

            <div style="display:flex;align-items:flex-start;gap:10px;">
              <div style="width:28px;height:28px;border-radius:8px;background:#FAEEDA;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="17" rx="3" fill="#BA7517" opacity="0.2"/>
                  <rect x="3" y="4" width="18" height="17" rx="3" stroke="#BA7517" stroke-width="1.5"/>
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="#BA7517" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Date & Time</div>
                <div style="font-size:14px;font-weight:600;color:#111827;">{{ modalTrip.date }} at {{ modalTrip.time || 'No time set' }}</div>
              </div>
            </div>

            <div style="display:flex;align-items:flex-start;gap:10px;">
              <div style="width:28px;height:28px;border-radius:8px;background:#EAF3DE;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7z" fill="#3B6D11" opacity="0.2"/>
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7z" stroke="#3B6D11" stroke-width="1.5"/>
                  <circle cx="12" cy="9" r="2.5" fill="#3B6D11"/>
                </svg>
              </div>
              <div>
                <div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Destination</div>
                <div style="font-size:14px;font-weight:600;color:#111827;">{{ modalTrip.destination || '—' }}</div>
              </div>
            </div>

            <div style="display:flex;align-items:flex-start;gap:10px;">
              <div style="width:28px;height:28px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="3" width="14" height="18" rx="3" fill="#6b7280" opacity="0.2"/>
                  <rect x="5" y="3" width="14" height="18" rx="3" stroke="#6b7280" stroke-width="1.5"/>
                  <path d="M8.5 10.5h7M8.5 14h5" stroke="#6b7280" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Purpose</div>
                <div style="font-size:13px;color:#374151;line-height:1.45;">{{ modalTrip.purpose || '—' }}</div>
              </div>
            </div>

            <div style="display:flex;align-items:flex-start;gap:10px;">
              <div style="width:28px;height:28px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="13" rx="2.5" fill="#6b7280" opacity="0.15"/>
                  <rect x="2" y="7" width="20" height="13" rx="2.5" stroke="#6b7280" stroke-width="1.5"/>
                  <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="#6b7280" stroke-width="1.4"/>
                </svg>
              </div>
              <div>
                <div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Requesting Office</div>
                <div style="font-size:14px;font-weight:600;color:#111827;">{{ modalTrip.office || '—' }}</div>
              </div>
            </div>

            <div v-if="modalTrip.tripTicket" style="display:flex;align-items:flex-start;gap:10px;">
              <div style="width:28px;height:28px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="10" rx="2.5" fill="#6b7280" opacity="0.18"/>
                  <rect x="2" y="7" width="20" height="10" rx="2.5" stroke="#6b7280" stroke-width="1.5"/>
                  <circle cx="7" cy="12" r="2" fill="#6b7280" opacity="0.5"/>
                  <path d="M11 10h7M11 14h5" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Trip Ticket No.</div>
                <div style="font-size:14px;font-weight:600;color:#111827;">{{ modalTrip.tripTicket }}</div>
              </div>
            </div>

          </div>

          <button @click="closeModal" class="btn btn-secondary" style="margin-top:20px;width:100%;">Close</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLogbookStore } from '../../store/logbook.js'

const store = useLogbookStore()

const dayNames   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const monthNames = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December']

// All vehicles present in reservation records = "reservation vehicles"
const reservationVehicleNames = computed(() =>
  new Set(store.reservationRecords.map(r => r.vehicle.toUpperCase()))
)

// State
const today          = new Date()
const selectedMonth  = ref(today.getMonth())
const selectedYear   = ref(today.getFullYear())
const selectedDriver = ref('')
const modalTrip      = ref(null)

// All unique drivers
const allDrivers = computed(() => {
  const set = new Set()
  store.reservationRecords.forEach(rec => {
    rec.rows.forEach(row => {
      const d = (row[1] || '').trim()
      if (d && d !== 'N/A' && d !== 'ASSIGNED DRIVER') set.add(d)
    })
  })
  return [...set].sort()
})

// Available years from data
const availableYears = computed(() => {
  const years = new Set([today.getFullYear()])
  store.reservationRecords.forEach(rec => {
    rec.rows.forEach(row => {
      const m = (row[2] || '').match(/(\d{4})/)
      if (m) years.add(parseInt(m[1]))
    })
  })
  return [...years].sort()
})

// Flatten all trips from all reservation records
const allTrips = computed(() => {
  const trips = []
  store.reservationRecords.forEach(rec => {
    const vehicleName  = rec.vehicle
    const isReservation = reservationVehicleNames.value.has(vehicleName.toUpperCase())

    rec.rows.forEach(row => {
      const dateStr = (row[2] || '').trim()
      if (!dateStr) return
      const parsed = new Date(dateStr)
      if (isNaN(parsed.getTime())) return

      trips.push({
        date:         dateStr,
        day:          parsed.getDate(),
        month:        parsed.getMonth(),
        year:         parsed.getFullYear(),
        time:         (row[3] || '').trim(),
        driver:       (row[1] || '').trim() || 'Unassigned',
        vehicle:      vehicleName,
        destination:  (row[4] || '').trim(),
        purpose:      (row[5] || '').trim(),
        office:       (row[7] || '').trim(),
        tripTicket:   (row[0] || '').trim(),
        rawStatus:    (row[10] || row[8] || '').trim(),
        isReservation,
      })
    })
  })
  return trips
})

// Trips filtered to current month/year and selected driver
const viewTrips = computed(() =>
  allTrips.value.filter(t =>
    t.month === selectedMonth.value &&
    t.year  === selectedYear.value &&
    (!selectedDriver.value || t.driver === selectedDriver.value)
  )
)

// Calendar math
const daysInMonth = computed(() =>
  new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
)
const firstDayOfMonth = computed(() =>
  new Date(selectedYear.value, selectedMonth.value, 1).getDay()
)
const trailingCells = computed(() => {
  const total = firstDayOfMonth.value + daysInMonth.value
  const rem = total % 7
  return rem === 0 ? 0 : 7 - rem
})

function tripsForDay(day) {
  // Returns ALL trips for this day — sorted by time so multiple trips appear in order
  return viewTrips.value
    .filter(t => t.day === day)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
}

function isToday(day) {
  return day === today.getDate()
    && selectedMonth.value === today.getMonth()
    && selectedYear.value  === today.getFullYear()
}

// Navigation
function prevMonth() {
  if (selectedMonth.value === 0) { selectedMonth.value = 11; selectedYear.value-- }
  else selectedMonth.value--
}
function nextMonth() {
  if (selectedMonth.value === 11) { selectedMonth.value = 0; selectedYear.value++ }
  else selectedMonth.value++
}
function goToday() {
  selectedMonth.value = today.getMonth()
  selectedYear.value  = today.getFullYear()
}

// Status normalization
function normalizeStatus(raw) {
  const s = (raw || '').toLowerCase()
  if (s.includes('cancel') || s === 'cancel') return 'cancelled'
  if (s.includes('complet') || s.includes('reimburse') || s.includes('cash advance')
    || s.includes('liquidat') || s.includes('reimburs')) return 'completed'
  return 'pending'
}
function statusBg(raw) {
  const s = normalizeStatus(raw)
  return s === 'completed' ? '#dcfce7' : s === 'cancelled' ? '#fee2e2' : '#fef9c3'
}
function statusColor(raw) {
  const s = normalizeStatus(raw)
  return s === 'completed' ? '#15803d' : s === 'cancelled' ? '#b91c1c' : '#a16207'
}
function statusLabel(raw) {
  const s = normalizeStatus(raw)
  return s === 'completed' ? 'Completed' : s === 'cancelled' ? 'Cancelled' : 'Pending'
}

// Chip styling: status sets bg/text color, vehicle type sets left border
function tripChipStyle(trip) {
  const s = normalizeStatus(trip.rawStatus)
  let bg, color, borderColor
  if (s === 'completed')      { bg = '#f0fdf4'; color = '#166534'; borderColor = '#86efac' }
  else if (s === 'cancelled') { bg = '#fef2f2'; color = '#991b1b'; borderColor = '#fca5a5' }
  else                        { bg = '#fefce8'; color = '#854d0e'; borderColor = '#fde047' }

  const leftStyle = trip.isReservation
    ? `3px solid #4338ca`
    : `3px dashed #7c3aed`

  return {
    background:   bg,
    color,
    border:       `1px solid ${borderColor}`,
    borderLeft:   leftStyle,
  }
}

function dayCellStyle(day) {
  if (isToday(day)) return { background: '#f0fdf4' }
  if (tripsForDay(day).length > 0) return { background: '#fafffe' }
  return {}
}

function dayNumStyle(day) {
  if (isToday(day)) return { background: '#22c55e', color: '#fff' }
  return { color: '#374151' }
}

// Month summary stats
const monthStats = computed(() => {
  const trips = viewTrips.value
  return {
    total:         trips.length,
    completed:     trips.filter(t => normalizeStatus(t.rawStatus) === 'completed').length,
    pending:       trips.filter(t => normalizeStatus(t.rawStatus) === 'pending').length,
    cancelled:     trips.filter(t => normalizeStatus(t.rawStatus) === 'cancelled').length,
    daysWorked:    new Set(trips.map(t => t.day)).size,
    driversActive: new Set(trips.filter(t => t.driver !== 'Unassigned').map(t => t.driver)).size,
  }
})

// Modal
function openModal(trip) { modalTrip.value = trip }
function closeModal()    { modalTrip.value = null }
</script>