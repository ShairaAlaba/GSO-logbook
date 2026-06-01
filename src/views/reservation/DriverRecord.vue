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
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#fdf2f8;border-left:3px solid #db2777;"></span>
            <span style="color:#6b7280;">Disapproved</span>
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
          <div style="width:36px;height:36px;border-radius:10px;background:#fdf2f8;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="#db2777" opacity="0.15"/>
              <circle cx="12" cy="12" r="9" stroke="#db2777" stroke-width="1.6"/>
              <path d="M8 12h8" stroke="#db2777" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div style="font-size:24px;font-weight:700;color:#be185d;">{{ monthStats.disapproved }}</div>
          <div style="font-size:12px;color:#6b7280;">Disapproved</div>
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

    <!-- ══ PRINT REPORT SECTION ══ -->
    <div class="page-content no-print" style="margin-top:0;padding-top:0;">
      <div class="card">
        <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div class="card-title">Driver Report — Print</div>
          <button class="btn btn-primary btn-sm" @click="printReport"
            :disabled="!printDriver"
            style="display:inline-flex;align-items:center;gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V3h12v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <rect x="2" y="9" width="20" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
              <path d="M6 19v2h12v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="18" cy="14" r="1" fill="currentColor"/>
            </svg>
            Print Report
          </button>
        </div>
        <div class="card-body">
          <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;">

            <div>
              <label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Driver Name</label>
              <select class="form-control" v-model="printDriver" style="min-width:200px;">
                <option value="">— Select Driver —</option>
                <option v-for="d in allDrivers" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>

            <div>
              <label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Period</label>
              <select class="form-control" v-model="printPeriod">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <template v-if="printPeriod === 'monthly'">
              <div>
                <label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Month</label>
                <select class="form-control" v-model="printMonth">
                  <option v-for="(m,i) in monthNames" :key="i" :value="i">{{ m }}</option>
                </select>
              </div>
              <div>
                <label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Year</label>
                <select class="form-control" v-model="printYear">
                  <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </template>

            <template v-if="printPeriod === 'weekly'">
              <div>
                <label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Week Starting (Sunday)</label>
                <input type="date" class="form-control" v-model="printWeekStart" />
              </div>
            </template>

            <template v-if="printPeriod === 'daily'">
              <div>
                <label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Date</label>
                <input type="date" class="form-control" v-model="printDate" />
              </div>
            </template>

          </div>

          <div v-if="printDriver" style="margin-top:12px;font-size:12px;color:#6b7280;">
            <strong style="color:#1a4a15;">{{ printTrips.length }}</strong> trip(s) found for
            <strong>{{ printDriver }}</strong> — {{ printPeriodLabel }}
          </div>
        </div>
      </div>
    </div>

    <!-- ══ PRINT-ONLY OUTPUT ══ -->
    <div class="print-only" id="printArea">
 <div class="pow-letterhead">
        <img src="/1.png" alt="CSU Logo" class="pow-logo" />
        <div class="pow-lh-center">
          
        </div>
        <img src="/2.png" alt="Bagong Pilipinas" class="pow-logo" />
      </div>
      <!-- Header -->
      <div class="print-header">
        <div class="print-header-left">
          <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAEdB7ADASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBQYBAwQCCf/EAGEQAAEDBAAEAwYCBQUKBwwHCQEAAgMEBQYRBxIhMQgTQRQiUWFxgTKRFSNCUqEWYnKxwQkXJDOCkqKys9E3OENjdaPCGCU0NTZTVWV0k+HwJidzpMPS8ShERVRkZnaElP/EABsBAQEAAwEBAQAAAAAAAAAAAAABAgQFAwYH/8QANREBAAEEAQMCBAQFAwUBAAAAAAECAwQRIQUSMUFRBhNhcRQigaEykbHR4RUjwTNCQ/DxUv/aAAwDAQACEQMRAD8AuWiIgIiICIiAiIgIiICIiAiIg4RdNTUw00ZfNKyNo9XHS1u5ZdBHtlDF57v33dG/71zc7q2Hg07v1xH09f5PW3YuXP4I22ootYxWuulyq5JaqRogYNBrWaGytjnljgidLK8MY0bJJ6ALPDz7eXYi/TExTPvxx7pXbmirtny+/wAl9LAW7J7dWVZp287NnTHvGg9ZwEEd1642ZYyombNUVRHsldqu3Oqo0+0RFtMBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERcEgDZ6AIG+ieiwF3yeipCY4N1Mo9GH3R9SsPQZNX1FziExjbA94aWNb8endcDI+I8DHvxYmvdUzrjnX3bVGFerp74jhujnhrCT0AHUrSK3Nvao3fomLUfMQJpB30dbAW2XqUMs1ZLv8ADTvP+iVD9hjMdko2u7+Xs/ckrifGnWsjp9qiixV2zVvc+v6NvpeNbvVTNyN6ZWpqp6uTzKid8rv5xXFNDJUTshibtz3BrdLpHdbjg9t0w3GZvU9IgR2HqV+bdHxL/Wc6mmqqZ9apnnh2M2uixa3EfZsNpoY7dQx07Ne6Nud8T6laZmd4NdUexQPPssR98j9t3+5ZfM717PGbfSv1K9v6xw/ZHw+pWk66r7L4t+IKMW3HT8SdajU69I9ml0zC75+dc/T+76adAa6LZ8byOSJ7KSvdzxnoyU92/I/H6rVx2XzJK1g6r4XpHWszByIrsz949J+kullWLd2jtrhLzXtc0Ob1BX381rmCS1Ulo3Uh/K15ERd3Ldf1LYj1K/f8HInJx6L0xruiJ17PkLtHZXNMTvT6REW4wEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARfLnBo2SAPmuI3skbzMcHD4g7WPdTvRpz6LzVtdS0beepnjjH853X8lheIM2SU+PyT4xCyasYQTFrbnt9Q3fTaia15vR3S4OoLo2a2XZp5ZKatHI/m+AJ/qXzvXut3em2/9q3NU+/o3MTFpv1fmq1H7pbZltsfUiEGUMJ15hbpq68/t9ZeMSqqa11L4asASwuYfxlp3y/MEdFo5+a2PF726Eto6l+4u0bifw/L6L5fo/xhOdcqxs2IiK+ImONb9J/u38npsW6YrteYaLjF3F3ton0GyMcY5WfBw/3jR+6yjKhlNOyWR3KGuDvyKw2XUYxPiMKqP3LXfT19Ayf1H36H7ldGcRz/AKNFbATzQbcWj1C+N6pgV4WfNv68S6mNci5bj6pHuuSR12LXB0MZDPI5OZzuu3dB0+61eCPy6eKP91gH5LRWX+4T2Ax26Rkkbi10sY7kt7D6rZsav9LfISIdx1MY1LA/o5vz+i2fiHNvdRt25nmaI1P3XHxYx968TLY7RRPrqxkDegPVx+A9Vul7uEVmtbWQhokLeSJn9v2WNsEcNrtbq6oPK6QbPx16Ba1dKuWurH1Mx0T0a391voF0sW5Hw/07j/rXOftDSrp/F3uf4af3dMsj5ZHSSOL3uO3OPqV8EgdV8ucAstZ8auF05ZJg6kpT3c4e+4fIf2lfL4XS8vqt/VumZmfM/wB5b1zJosU/mliYGVFZUilo4nTTH9lvp8z8AtysOHxQFlTc3CeUdRF+w0/P95Z+z2ujtVMIKOINb+049XO+ZPqum532228ESzh0g/5OP3nf/BfqfSvhrA6PR87Kqiao9Z4iPttw8nPu5U9luOPp5ZMNDWgNaAPkvoaWh3LL62fbKOJsDP33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t5QdDqTs7JVIuEWGZ/i/Faw5RW4JkzqSirfOmEdtk5uQ7B1sfByxPL9ER2XDvwldFFOKqkiqBFLEJGB3JKwte3foQexXiyi7foW0S1ot1wuDmjQgooDLI4/IBZMX504Mf/2taA+n8p5P9q5fpUvzvxjBeIFu42UOY1WBZQaKK8mtkYy3SF4YZC7XbW+q/Qa11YrqGGrFPUU4lYHeVURmORm/RzT2KK9aIvHd65tut09a6nqakRN5vKp4jJI/5NaO5RH51cYHiXxeVsg7fyihb+T2D+xfpCOy/O3N8I4i3bjJV5hTYBk5pZLuKxoNuk5uQSB3w76X6C2WtNxtVLXGlqaQzRh5hqY+SSPfo5voUWXtRERBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAXlukpp7XVTtdyGOF7w74aBO16l1yxMlidFI0PY8FrmkdCD3CD87bzcrvkN1dUVtwqa+sneSOZznuds9g0bP2XZkeC5TYrJDe7zaqmho5n8kb5m8pJ7/h7j7q+WO4di2Oue6yWC3UD5HFz3xQND3H5u7rvyvHrZk9hqbNd6WOopahnKWuHY+hHwIXH/wBL3EzNXLlVdMiqZqqq3L86KYQkcxkLwsjT3KWlaWUrgzfwb1WS4gWibE8xuFmr7eYjDO8M8tm2ubzHlcCQNgjR+6xUVxa3/F0uvq1ce5RNFUxMOLet12p1p3GG9XFw1HV1JPbqSslR4feHgSVr6a3w+rqiTR/JYv8AS1cPwOkZ/RGl1mS4VjukdTL+ZWE11T4jTGmIqjdUNtpaLCbPqSvrJLzOP+SiBbGD9fVdl04hV3keyWKlgtFMOg8poLyPqR0WtU1gu0zQ57IqZh/amkDQs/ZMWsbz/h1zq6+Ud4LfBz/m7a8ar1NEfmqbFuxcuflohrPNWXKs5R51VUyH5uc4rY48NdbqB1xymtjtdOGksi7yyH0AC74cqML327DsWjp3dW+dUN28n46G/wCJKzOJY3c7tUy1WYOmqC4Dkaew+R2tXJzbePRNVfH03z/Jv4XSb2TcimmN/X0R5bKSgr4an/vsylqWn/B4pInFsg+bgOi8lTFV0Ja2vpnwcw20u7OHxBU9OxPHzTmJtthZoe65o0R91G+T2G82urldFQsqaEn3W8heNfMLXwuu2ciuaI4+8x+0uj1H4cvYtqK9b+zV6G4zU5BhlIHw9F6pqi2Vw/wumbHL/wCdYNH+C64LRBdJvJo45qSrPaMDbD9u4XjrbRdqCXy542jX7x1v811ouUVTrepcCMe5TT3THDsktbyeairGzD0a7oV0vbXwHUtO7Q9R1XVz1Mf44nD+gvptwmB5S2TXzCtPdP1a0UzM7hya7pySE6+BC6JBRSddtafiDpen2xjvxxb+rV1SVFO7p5LT/k7SZmPTTL80zqYLTZ7heLlHbrM11ZVzHljhZ+JxWVyPFM0w4tffbNW29jjoSPZth/yh0VlvCbw/gttmfmVdTMFZXDkowWa8uId3fUn+A+anmopqeoidFUQRzMd+Jr2hwP2K7NjpsV24qrnmXXt9NpqoiqZ5V38GtVNWQ3iRtZJLAyOIGMk6a879O29BWOKx1mstns0ckdotVFb2SO5pG0tO2IPPxPKBsrJLrWbfy6Ip9nTs2/l0RT7CIuAQSQCCR3+S9Xq5XWYYidmJhPx5QuxEHy1jG/hY0fQL6REDSIiAiIgIiICIiAiIgaGtJpEQEREBERAREQcaHwTlC5RA0mkRAREQEREBERA0mkRA0iIgIiICIiAiIgIiICIiBpERATSIg4LQfRND4LlEBFxsb1vr8FygIuCQO5AXOx8UBdHslLzc/s0PMfXkG137RBwAANAaC5REDSIvlzmtG3OA+pQfSIiAiIgaREQEREBNIiAiIgaXBAXKIOOULlEQEREBD1HVEQND4IiIGh8E0iICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIK+eMOwVJx+kyaiaXMhd5FWwNHZ2uR+/TRGj9R8FV6KclgPZfoTm1igyXFLnY6jQbV07ow7912vdP2Oivz2qKSottfPbayJ0VRTPdFKxw6tc0kH+pcHqtmYmK4cPqtuYmKod7Kydmix2vsF2/pO4OHKauQD4DovEAV9tY8n3WuPXXQbXAqrmOHGp+ZcntiWzYPZ6G9XQfpWtaGg9I3u2XlTJb6SnoKdtNRxNhiHTTVpXDTFHUcbbtXbEzx+rZr8I+fzWYzPLKTH42t8s1FZINxwjp9yfQL47qNdeZk/KszMx7en/AL9X6n0Cza6fhfNyYiJ9586ZpsNDb43PbHBTtJJc86bv7rw0uRWuprDSxVbJOX8TwfdH3UMXq+Xe9VRkuE7+QnbY2ghjR8gtuwRtAa+2WpxAdUVTBUPd09wkdAvWvo3Zb3cq3VPt6NSr4lmq/wBuNbjt95/wkaW5W5mwytgkfrYYx2yV4qHIrRWTGGCuhbJ25HnR/itR440UVmyq3mhZ7OBG4N5OhIDlqWUhlVS01c2Pypy1rH+WwgO/nfVZ09Ds8RNU8+rG98UXYqmmbccfWeUzRW6gbWe2tpYhUd/MDdFeXJbJbbrRv9s1G4DpL35VGeK5Je7WWcz5KqmA6xybOh8j6KT7NdKK+ULpIN6PuvY4dWlaN/Hv4VcVzVuI9YdXCzsPqVqbfbqZ9JQfeIYqOvkhpqttTE09HtboFeLzn79T9lt3ETGn2qr9ogDnU8p79+UrTjtoG9hfYYmTTdtRXRO35v1TFuYt6qmY07PMB7jf2WcwHHZMry63WWFhHtMzWvcB+Fvdx+wBWvjROgrH+D3FW+dcMpqYySxvs9OSOxOi4/kAPuV0cO3N+9TTLSwaKr16KZWNt1JT0FDT0NLGI4II2xxtHZrQNAL0oi+zh9eIiINb4k5VRYTg91yeuLTHQ07ntYTrzH9mM+7iAqZ8IOJeeY1xOo86zSSrfYMqqHU1TNM4iAacNOYOw5C4dOnu77rf/Hplxk/QOAUr3uEsnt1c2Lq7XVsTdfUudr4hq1TjBmVjy3hVb8ctOI3O3zUjCTLJTkRR+6G+6T069ySemvXaksqfC6lZVU9HRTVtRK2OnhjMskh7NaBsn8lGb/EPwcaGn+WtK7m7ap5v/wAiwvAvMWZ14cKKWaVr62npxbKwA9eZpDNn6t0VHvgkwfE73wluV2vmPW641TrpPC2SpgbIWsZHFpo2OnUu/NTlNJom45cJoqBtac7tLonDYa17i/8AzAOYfcLM4FxIwvOnVDMWv1PcJKYAzRNDmPYD2PK4A6+fZVp8LeBYvceLfEGK6WKhrKa11boaOCeIPjhBml7NPTs0BZ/ArXQ4341r5Q2ekhoqKa0vPkQN5WDYgcdAduo2rtdQlW7ce+FVpuVRb6/KGRVVNK6KVns0rtOB0eobo9ln8G4m4LnFRJS4xkdJX1Mbed8DeZkgb8eVwBI+YVaPDziGP5Zx6ymTIbZS3KKloG1EcVQzmb5kkuubR79AfzWy8SsYsOFeKjhjUYzb6e2/pN04qYKZgY13I0jm0Pk4/knOzUJvzrihgmEztpsjyOko6pzA9tONvlLT2PK0HQ+q8OE8ZeHGYXaO1WLJqea4SgmKmlY6J8mhs8vMAHHXXQ66UDZlkGC/y5hns2M02bZTV08VPJFWMcYIn7JHp1PK4b6dPiFoXEqjyC0cTMMudywvFcUnddomtNll26Q8zTqRvMdEb+A7ptYiPC5Vz4i4hbc2pMOrru2C8Vn+Ihcx3K8/Dm1rfy2shmuW2HDrUy5ZDXNpKeSZsLDylxc9x0AAOqgHxtY7Jb6Kx8SbXD/hlmr2eY4D0cQWk/LmaB/lLA8RslZxp4i49j1gqI6i2+ZQSylj9iJoDp5yddnDlaw/AhI2mljMh4jYdYMVpsmu19pqa21bA6medl03TemMHvE/bp6rB4Xxw4a5bc2Wu0ZEwVsruSKGpidCZHegaXAAk+g3sqEqLH7bmfijqbDkUYls9lEhore8fqn7/WH3fgXOJPx0Atg8WmBYdZcCpcls9oorVdKatiiifSxiPzAd9CB31ram+V1Cas/4i4jgsdO7JroKP2gkRAROeSQN/sg6WqU/iJ4STSiP+VAj2dBz6WUD/VVe+Ok9XkGFYVW3Jxllqn29r3v7uL6fbvzO1KXHvAMQoOA9xqrfjlspqynoI5IqiOna17HAs67A36n81dymtLAWuvorpb4Lhb6qKrpKhgkhmicHNe09iCF61EvhP528GqGF7iRFUzsbs9h5hOv4qWlWL5cdAkegVLuF+FXfivmWTvrsqq6NtBVO29zHTOcXPdoD3hoAD4q6L/wn6Kj3BvAspy7iDlUmPZnccbgpquT2h9G4c0hc93KNEgeh6qSyhuef4jm3BWko8ks/EOqraV9QITSSxva3fK53Vhe5rm6ad9irAUmc2ij4e2jK8orKe0xVtHTzSGQnlbJLGHco9fUqsHHPhxxGw+yQZHc80rsts1HUsfNRXCUAa7nYB7EAg669fqtx44ZBbct8O9quluhlhpZJLfN5MjdGIOB034HWtbCm5NRpYlt+s7sd/lCK+L9F+ze1e0nYb5Wubm+OtdVoWa8X8Zg4WX/K8Zu0VxdRUzhEY2OIEp01u9jsC5pXkYYz4ZT1HIcS18v/AAVRl4faakq/DpnNLLBHLE/2oFrmgg/4OHD+KbNMz4XuMjr7RXmHNMkbJV+2Rto2zN0S1wcSByj5Kb8OzPGcwo6isxq7w3Gnp3+XK+MOAa74dQPgVA3hwoLfDg10qoqGkE8l1hDXCFvM39S3t06d3Ls8D+m4XlAB7XJ5/rP9qvg0myg4g4hXZfLiVJeYprzC98clM1jttcwbcCda6D5rwZrxa4eYdXGgv+TUlPWABxp2B0jwD22Gg6+6grh06GTxkX1jXN8xlbVOdrv/AIto/sXjyPIsD/vgVcuM4zS51kVyf5MguNI/yYXtJGmnWiB12dendRNLB4JxVwHNq51BjmR01XWsYXmmc10cvL6kNcBsfTa8uZ8ZOHWIXia0ZBkLKSuh1zxCCR5GwD3a0jsQqxYdFcaHxnY3BW4/ZccqDR80tJaRqE80Umnf0iCN/QLN5TY6DIvF5aKe50kVXTSXuqbJHK0Oa8RUgcAQe421XazEJ5xrjpwsyG5w2y3ZZSirndyxRzMfFzuPYAuAGz9VJaqJ43cUsNit2KXGxWegts5rjE99LA2MvHKSAeUDfUK2VtcXUFOT38tu/wAkiUmGhceuI8XDbCzdIoWVVzq5PZ6CB5010miS52uvK0dT9h02oYxDhnxL4u2qPLM4zuvtVNVDnoqKnjJBZ6P5OYNaD6DRJHqsn466SpfQYrXtY800MlVE9wHRr3iIt39QxynfhpcKO6YBYa2gex8D6CEN5OwIYAR9iCPsoviFfrXScZODObUFvbJc87xOrkbGSyJ7nRBxA7bcY3N79y0genpJ/GP9CSXKg/SuS2q0SezB0bK6NznDUrHF7NEaOmlv3W35znOL4TTU8+SXRlGKl5ZCwMc98hHfTWgkqEvE/LDXZBZKiMF0ctuc9hc3R0TsdD2QnljvE9xpuGH59h9usd4kioWVLKq5+UzYlhIZpp33Ba5x1v1CmGwcZuG18uVDbbflVG+sr3FlPE4ObzuA3y7I1v4DfVQV4lrbSTcSOG3tNNC6OovjIpQ9gIezy6X3T8R36LZPGrhUFRwvo8ostFFS1eOVPnh1NGGFsT9A/h+Dgw/ZPBwn3K8gtGLWKpvl9rWUVBTgGSV+zrZ0AAOpJJ7BduN3q35DY6S9Wmf2iiq4xJDJylvM0+uj1VRuO3EGXjBHhHD/ABqaOd15ipqm4NhdsMne7XI7XowNe8/AaVvMftdJZLLRWigjEdLRwthiaPRrRoImkX+KfPL5gXDllXj0RZW1tU2m9rcARStIJLtfE65R6De/gDEF/wCHGb2Thy7iY3jHdZa5lCy5OhHmCN7XAO5WvMnXv6t18lIXjLyZtBhMGKx2qmr570XHnqQS2nZGWnnaARt/MW6/t7KOrn4ZMkpuGL5IuJF1qaiKh891plc4UfRvMYwOf09DrXySWUa0lPC+LtaPDe7iFfKZtTX0lLMS0e4Kh0bg1rj8OYubvXzUYWrEM04lWyHKcw4qzWWvrGiWkoYqSYRQMI20tIe0N79+vpteOvvsF48G7YKKjZSNp7dURzsiB5A5tRCAQT8dk/HosvwP8P1hynhjar9d8uyxtVXQc7WUdeI4oB2AaC13b6/ZJkSR4dqziDbLRkdrz6orLnFa53GguM7elRE3mB5Xa24e6CD1791E+KW/OfEXf73dazMqrH7HQVBjpqamDnNaTvlbyhzQSGgEuPXZXq4NXrJbFXZxw+qLzU3mht9Jc/JkqHF8jHRcrRpx66Id2+I6LYvAbPG/EMlg6NkZc2uI9dFmh/UU9Dw6OC+RZlgPHOq4QZZfpL7bTROqKCqm2XtADXN0SSQOXnBaSdEdOi83Ea9ZhxY44VHDbGMjnsVkt0JdVTQF23lobzudykFw25rQNgLniEDU+N6001JoziwSc2vT9TN3/gvH4c+ai8UGUUtWCyZ1nDdO7l/+Dk/1FD6vHWQZh4eOJOMe1ZhV5Bjl9qPIqYpw5oYA5rXHlLnAOAeHAg9dEFW9VXvHtyvt+DwtHNPLdHsiA7kloHT7kKzsXMGAOO3AdVYYzy7FFPisrqmg4I3qWknkhle+CPnY4tOnStBGx8ipWHZRF4vBvgTeT8Jac/8AXMVI8on4R8BnZfgNuyaoy6popq9he2OKAu5BzEdXCQbPReeNuc8DeN+KY6/MqvILFkVRHAYalzyGh8rYzprnO5XDmBBB6+q++BdFx5l4eUU2IXW2w2Zxe2mbVujcWgOO9Axkgb36racW4GZreOJtpzriflcVwltNQ2pp6WDbtvadsG9ANaHaOgOulOSPLXM7z6lx7xgWC6ZBeXUNnprJUMkL3O8sE1FU0dB3J5WD7Kasf458K75XQ0NFmFCKmd4ZEyYOiD3HsA5wA6/VQPnuOWu/eOCw2S70jKug9hMkkMg214HtUoBHqObS9XjUxDGses+JV2P2K32yd918uR9NA2MvbyggHXfsovCaOOLbHJU48L1f7Pag2aaSJtwY4iUhgG2FpGi3YPVR5xkudfR8c8BpKW4zezy0EJe2N5DH7qR72vmOn0WM8XsxlqeHDjoiRlR3/nMjC9HGtoHiAwcejLbEfyqEWISDeDYTx0p3VWSWeO4tdA2KhkhkNUNMd7rXAhunc2+oPZbDmvFzh5hd2dackyOGhrmsDzC6KRx0QCPwtI9R+ahfLhzeNW2M6b5oCPtTvP8AYsJxMsNryjxm45aLzSx1VFPVTGaJ4217YqSJ7WkeoLm9fqiaTvi/G/hdkt1gtdqy6jfW1DuSGKVj4ud3wBcAN/LfVZ/Os9xTCGUcuU3eO3x1kjo4XOY5wLmjZ/CCexH5qA/GngeI43wqpcmx+w2613SiudOyOWlhEbntcTtvTv1AP2WJ8TUb8go8Do7jIWCuvFRA+T1aC2nZv+JV5IiJ8Jmp/EJwhnrW0keZUwcXcoe+GVrN/NxboD5levjg+wVuMWZ9yvVlpKV92pZIpa4GSKf3uYMby+rh2PZa3xR4S4Bb+C1zoaLG7dTupaRpiqhC3zw5pb7/AD9y49fzVcLhdLhWeF3FvbpnTG3Zn5ET3HfuMaS0D5DfRInZpcSvzfFcKwO1XW/XyIW98MccdWyJzmy9AA4AbOj/AGrWm+JHg86QRnKuQE65nUkwb+fKov8AFRD5fh8x+lA92Knbv/JkiC3J3DnDv+5h5XY3a3VQxsS+0ezN83zPJDufm1ve+u0ng1ymux3a23u0092s9bBW0FSznhqIXhzHt+R/MfLS0DIePfCqx3d1rrMrp31DHlknkRvlYxwOiC5oI/Lagbh7f7tY/Ardqm2TPbVe11MDXtPWNj3e8R8OhP5rycDbPmB4dUU9p4QYNfqOrbI4VtwqQ2ebT3NOw7eurSOmh0TZpbrE8msGVWpt0x270l0o3e75tPJzAH4Ed2n5HqtKyfjvwtx65zWy45TA6qgcWStgjdKGOB0QXNGtj10eiiDwwYTxAsmfZcy62umx+z3ajlLYaOtiljhlLvcDGtcSOUPOiR2C0i14rxD4P1Fe658K7HmNsmYwz1fke1uY1u9kEHbd72dt6/FNnbC4WD5ti2a0ElZjF6pbnFEQ2Xyne9GSNgOaeo+62NQF4YM74Z3+puVBilo/k9eqkCartxpjG33ByksOyCATsjprfb1U+jsqkxoRERBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBx0VMPFfjwsvFQ18MYZT3WFs7dDoXjo/+IB+6ueoP8X+MG74HTXuFgM9on5nHXXy36Dv4hpWpm2/mWaohqZtvvszEKoUkbp5o4mDbnkABThjGN0FFZ4YJKRj5Dp8r3DZLlCeO18dDX09ZJF5jYnhxb8dKVbfxKssjWtqBJT+nUbC/Met28mumKbVM/o2PhevDszVVfmO7023GpqqWijDpnBkfZo+J+CiDIs5vdRdKiOnlgigZK5rG+zscdA67kbXq4g5VFV3Oi/R04mgheJHa7ErH5jbKKaKG+2mfz46txM1O1vvQv76+hWv0rBpx4iu9HNXjfp/9PiPrFd+r5Nir8se3q4tmT36eoZGayEtJ6g00f/5VIOLY6zP8unkggFKKema8yRj3XPGgB07bO1p+F4zCyrZUXuo9n/VulZRt/wAbI1o31/d2tg4fZXcarOaG3W+WayUFW9tOIaM67noST3PzXSm3RdvdtMcfTjy5PT702qPz8zMtlveJRsyaz1F5hklZQyeXKx7idtPY9fmvPxQybH3wmkx6BjJIY+skjBy7HoApcvdhNwiNMZn+a5vIyV/Vw116/FQfebFDYLtVWnI6RsLZW6ZUgEuAPYt9CF45vSb2HXFVzdVEeJj7+JdbIrmbc6jmfLQI83yGFrmMnpuvwpmf7luXD7Ln10nstzbH5p/DLGwMH3AWiZBY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fUYtmLNqKX1ONZ+VailyiItlsCIiAiJtAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARE2EBE2EQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQaPxqwuLOcErbQABWMHnUb/3ZW9QPoex+qoXV08kcs9vrYjHNE9zHscOrXA6I/NfpWqo+LjhwbZcDntog1S1L2suLGDoyQ9BJ8g7sfnr4rnZ+P3099PmHNz8fvp76fMK2UcFZb7tHNR9XtdthB7lWN4P8Pa3OpRdMkslLb6TmD3yhv62o+nXoPmo5wKy2N3kXmuq/NkDtiF34WEfL1U1M4qGgo2U9LPDGxjQ0BrQFyrNu1cr7rvo0MWqiqd3PEJ9s1stdmt8dFbqaGlp4xprWABdNdPFT1zamEs5i3TuvdVmuHFq8SSny7qAPhpfVv4o1jnBtVWh7ifiurOXRFOqY06X463Cy4vsQJDmga+a1rJKqO41ofE0aAA2fVQ4eJlRt/M8hg/aKxNXxRry8ikrI2AHrtoK1b+TF6nsYzn0eifbzhtnyXFIqK4Usb3cnM13L1DlVnjRbL7iM8lqpLRHSUcjTqZg2Hj5Fb1ZOMd4iJbNcoXtb2BYF6cnz2kyq1Oork2nlY4dfdHT6LDKtY9+iKpjVUML1dm9TvepVTpaF0s+3nrvr81Zzwn4L7deDkdbB/glAf1Ox0fNr/sjr9dKOrbw6/S2UUlBYajznVMwa2M/sDfUk/ADqrr4Xj9Fi+OUlloWgR07NOdrq93q4/UqYNmb1z5lXin+rww8XvufMq8R/VnB2REXfdsREQF1TyRwQvmlcGxxtLnE+gHUldgWKzAOOK3YM3zGjlA1/QKxniEnwrBmfGfOsvyWS14O+WgovNLKZtPGHTzgEjmcT+EHW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TTj9titFhoLTC4uioqaOnY49yGNDQf4KRErMoo4wWPJKvL+H15tFiqrhBaLxPVVjInN5o43Ma0HRI33P5LB5hi+Y2zjBi+ZWnGaq7UlJT10dVFBMxjwZXvc0e8f5ysGmlU2rzxLtOY5Dxaxy80WFXSKlpKqgfPPJLEQ1sc3mP6Nce2z+SyfFLEMmuPGDBbzbbVLVW63VTX1czHN1EBKCSQTvsFOekQ2q/YcEz3hdxZrcltWMvya13Fk/NHTzhrovMlD9dR6a+Hqpnfe8rOGR19pwh9LcA8/97Z6hjdNHzHTr9FvOk0po2rzU4ddsq4lY1fW8N/5Hz0dTJNcrjFVM5nt8shvKGjRPMd7I9OuwstkLMsvdvmsGacJqfJhtzIayKrja1w3prySOZhI0fdPx6KcNJpNG0d+H3Da/BeG1NY7n5bKo1M1S+GOTnbAHvJDA710NbPxJUiLgLlVJEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREHCeiw+QZHZrExrrrWtg5/wtDHPcf8loJXXZMpsN5kENtuUE8xBIj6tfod/ddory+db7uzujftvll2VTG9cM6sNlWO2nKLLNaL3Rx1dHMPeY8dQfQg+hHxC99ZXUdFF5tXUxQM7cz3ABcvqqaOjdWPnY2nbH5hkJ90N1ve/hpZTVTO4mWPbuFKuLPCLIOGd1/TNrZLdbE1/M2cN26D4NlA7f0u30WMoeKl4p56isoY2QVdRTGmdK5/OA0jXQaHUDsrizZviE8UjJrrA6A+490kTxGdjsXFvL1HzUP5/4fsYy/wAy84BeKW2zvJL4WES0rz8gDth+nT5LjXse3cq7rNUT9Ilzcnpte++3wiDH+Lub2OKWOmucdU2V3M72qISHfboVnaDiBnfEFkuOUNobX19WPLklhDtMiPcFp91g/nLP4r4Z7tT1sdRl+SUVPQMd77KPZe8fDmcAG/kVY/DcWx3FbW2ix63QUkBALnMG3SfNzu5K87WBXcqmK51DzsYV7/yVfl9mlcFuEVtwiBlzuHl1t+lZp8uvcg33bH/a7uVKf2WFyDKbDYi1t0uUcD3dmAF7/wDNaCV82HK8evpLbTd6SqeO8bZNPH1aev8ABdazNi1/tUTEa9N8utRZ7KPy08M76JroviSWOON0kjg1jRtxJ6ALroaylrqZtRSTsmid2ew7C2O6N69TXq9CIiyBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERA0PgiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiDhYjMLnJZsXuV1iZzyUtM+Vrdb6gdPssv6LzTOpKqCSF7opongskbsEEHoQVhXzTMLGtoS4cR23O3Prb9UPrpGN60/mFoDtklzgDv1H/wAhbBauHFBj3ECkyS21hhoYYZA6nmme93O5nKA0u/Z69ifRYK+cG5aK+G5YllU1mY92xC4PPJ17Nc09R8iFsdowi4RU/m12RCruO+ZlX7FzFh100HHW/npfPY+HctaiaImYnfduN/5dGu5TVzFWo1rWmg8esnq5ckp6ClErqKgeJZ3NB5XvLQAN9unMfupIwi6UWS8OHUznOfG2kfDI0nTtAHX9i+bRgRZjtdaLje6i4msZK10klOB7zzvmI31IPbqsTinCy/Y9UPdb80kjiPeL2HbSD3BBeQVjbw8m3kTej83dvccev9npVdsVWuzxNOtT/wAojpJqCnsldPcqO4T0pu3I6Slk5TCWx6Y53XqOrvyCmXgfQU1Db5qmgqfPpqxoex/N+L3iNnQA3rXosfZ+FF0tjpmHMZJKaQTl8H6PAY50rdEkc3ppdmO8M8ksNM6l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IkYTsfXRU61E8VPTyTzSNZFG0ue49gB3KwGR4djl9raeuuNuBrYz+rqYZXQyt/ymEE/ddNbhdnuEDoK6e61EA6GKS5zlrvr76CELLZqjiBnlZLG1wpJ6p888noyMuJ19SNAKcOJDWQ8PrpFGA1raUsaPgOyyeP2S02KjFFaKGKkh3shuyXH4knqT9SuMkslHfre631z6hsDj7whlLC766TyqG/D0eTMKxn79G7X2e0qbqW30lNX1VbBEGTVZYZ3D9stHKCfnrp9lq9j4cY1aLnFX0La5lREdtcapx39R6rdR2RGpcX3cvDy5j4tYP9NqjTw8O5ctuUX79Fv8pB/vUvZVj9vyGjbR3F1T5IO+WKYs39dd1hrBw6xuyXaO5W9tdHURggE1TiCD6EeqDZqW301NXVVbBEGS1XKZiP2y0aB+uun2C1fjS4DBp2k/ilZ/Wt1HZYPK8bt2SU8UNydVeXGeYNhmLAT89d0gRX4b/dvl8Z+9BEfyc7/et84uYxJk+KSRUjQa6mPm0/8AO+LfuP46XfjGA4/j1zFwtgrY53M5Xc1S5zXD4EdittVmdiDPDtfWUdxuGM158iaV/mxNf0PO3o5n17HXyKnNalkmA4nf672+4WlvtnR/tEEr4XnXxLCN/ddUeB2BrOSV92qYx0DJrrUOH+uoumw0d2oKy4VFBTTedNTAedyglrCf2S7tv5KFvEGQ/L6YdPdomj/TcputtBR26kjpaGnZTwN/Cxg0B/vWr3/AMdvlzkr7g2tknf7pIqnAAfIeiQj5wqgprzwtt1vrA4wT0bY3hp0eh/r6L251kgxy10ppxDLW1VZBSwQyO0Xc8jWuOvk0k/ZeKiwLH6WnFLBJeI4h2Y26ztA+wcFxRcNcPprrT3YUFXNWQyCWJ9RcJ5Q1w7Hlc8g/kkq3Zq5QdkRBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQf/2Q==" class="print-logo-img" alt="CSU Logo" />
        </div>
        <div class="print-header-center">
          <div class="print-doc-title">DRIVER TRIP REPORT</div>
          <div class="print-doc-sub">{{ printPeriodLabel }}</div>
          <div class="print-doc-meta">
            <span>Driver: <strong>{{ printDriver || '—' }}</strong></span>
            &nbsp;·&nbsp;
            <span>Printed: {{ new Date().toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }) }}</span>
            &nbsp;·&nbsp;
            <span>Records: <strong>{{ printTrips.length }}</strong> trip(s)</span>
          </div>
        </div>
        <div class="print-header-right">
          <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAEdB7ADASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAYHAQUDBAgCCf/EAE8QAAEDAgMDBQoLBwIFBQADAAABAgMEBQYHERIhMRNBUXGRCBQWFyJUYXOSsRUyMzU2UlNVcoHBI0J0k6Gy0SY3J0NEYoIkNEVjoiVl8P/EABwBAQACAwEBAQAAAAAAAAAAAAABBQIEBgMHCP/EADsRAQABAwEECAQFAwMEAwAAAAABAgMEEQUSITEGExRBUVJxkSIyM1M0YXKBoSMksUJDwQcV4fAlNdH/2gAMAwEAAhEDEQA/APZYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUACvcxMeTYbu8dup6VsqujR6qvFNVNH4w749qOS2v0XoaabOjysfx680UfvLYsFso/guB7oWKqsTihdVW7NjGormnWanLWr+Vl5t21TXu00yr9cf33T5vk9g+fD++fd8nsFppbaRP+RH2Gfg+k83j7DV7VZ8iw7Dlfdn2VYmP7793yewZTMC+6/N0nsFp/B9J5vH2GPg+k+wj7B2mz5GUYWT92fZV3jAv2vzc/2DPjBv33c72C0Pg+k+wj7B8HUn2EfYO02PIdiyfuz7Ku8YN++7newFzCv33c72C0fg6k+wj7B8HUn2EfYT2qx5DsWV92fZVvjBv33c72DPjCv33e72C0Pg6j83j7DPwfSfYR+yg7VY8iOxZX3Z9lXeMK+/d7vYMeMK+/d7vYLR+DqPzePsM/B1H5vH2DtVjyHYsr7s+yrvGDffu93sDxg377vd7BaPwdR+bx9g+DqPzePsHarHkT2LK+7Psq3xg377ud7BnxhX77ud7BaPwdR+bx+yg+DqPzePsI7TY+3/ACdjyvuz7Ku8YV++7newPGHfvu53sFo/B1J9hH7I+D6P7CP2R2mx9tHYsr7s+yrkzCv33c/2B4wr993P9gtH4PpPN4+wfB1H5vH2Edps+Rl2LJ+7Psq7xh377ud7A8YV+1+bnewWj8H0n2EfYPg+k83j9kmMmx5GM4OV96fZV3jCv2vze7T8ATMK/a6fBzvYLR+D6PzeP2R8H0n2EfYO02PIdhyvvT7KuXMG/wD3c72DHjBvuvzc72C0/g6k+xj7DPeFJ9hF7JHarPkR2HK+9PtCrPGFffu93sGfGJfU/wDjl9gtH4PpfsI/ZHeFL9hH7InIsT/t/wApjCyo/wB2fZV/jEv/AN2O9geMS/8A3Y72C0e8KT7CP2R3hS/YR+yYxfs+Rn2TK+7/AAq3xiX/AO7XewY8Yd++7XewWl3hS+bx9g7wpfsI/ZMoyLH2/wCXnOHlz/uz7KtXMK/fdzvYMeMG+/d7/YLT7wpfN4/ZM94Uvm8fsk9pseT+URhZf3p9lV+MG+/d7/YMeMK+fd7/AGC1e8KTzeP2T5+D6X7CP2R2mx5P5T2LK+7PsqzxhXz7vf7A8YV9+73ewWn3hS/YR+yO8KTzeL2SO02fInsWV92fZVqZg33Rf/493sDxhX77vd7BafwfSebx+yhnvCl83j9lB2mz5E9iyfuz7Ks8Yd9+719geMO+/d6+wWl3jSebx9g7xpfN4/ZQjtNnyHYsr7s+yrPGHfvu9fYHjDv33evsFqd40vm8fsjvGk83j9kdps+Q7Dlfen2VZ4w7993L7A8Yd++7l9gtLvKl+wj9kd40nm8fsjtNnyI7Flfdn2VcmYd/0+bl9geMO/fd6+wWl3hSebx+yg7wpfN4/ZQdps+RjOBl/en2Vb4w7793O9gx4xL8n/xrvYLT7wpPN4/ZPlbdSL/yI/ZJjIsfb/lPYcv70+yrXZi4gRfm1dPSw7OHcy6ysvkFuqqJjOVkRmuuipqpZK26k2dOQj9koutibDmo1jERqNrmoiJ1obeNFjJprjc0mI1aGXObh10VTc3omYjTRf7F2kRek+k4HFTb4WdRypwKaXTRyAAQyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQ+dC6Y+Z6qL3l0WH5pp/wIUtnV9P2epi95dViTS003q0LrO/CWfRzWzI02hkesO8aTGF6dZLalSyNHuc7ZRFN2Q3NT5op0/+39CptUxVXESvcquqi1VNPNp4cdXSdiOZTLovREp9+GF3X/p5P5SkhwBHG7DdMqtaq+Vzf9yki5JmvxENiq7boqmNxoW8a/coiqbs8fyV54W3b7CX+UoTF13+wl/lKWJycf1E7Bycf1E7B2m35IZ9iv8A3ZV34X3f7CT+UZ8Lrx9hJ/KLD5GP6idg5GP6idhHX2/InsV/7sq88Lrv9g/+UY8L7x9g/wDlFi8lH9RvYY5KP6idhHX2/Insd/7sq68L7x5vJ/KHhfePsJP5RYvJR/UTsM8lH9RvYOvt+Q7Hf+7KuvC+8fYSfyh4X3f7CT+UWJyTPqt7ByTPqt7Ce0W/JCOxX/uyrvwvvHm8n8ox4X3j7CT+UWLyUf1G9g5KP6jewdot+RPY733ZV14X3j7CT+UZ8MLx5u/+UWJyUf1E7DPJR/Ub2DtFvyHY7/3ZV14X3j7B/wDKMeF94+wk/lFjclH9RvYOSj+o3sHaLfkOx3/uyrnwuu/2D/5Rnwvu/wBg/wDlFiclH9RvYOSj+o3sHaLfkR2O/wDdlXfhfePsJP5Q8Lbv9hJ/KUsTkY/qJ2Dko/qJ2DtFvyI7De+7KuXYvujfjQSbv/rX/Bt8FYmlu9Y+nlaqKnoJRWQRLTSeQ34q8xX2AERMTT6bvKcesTRdt1TFOmjwm3fx71EVVzVEyswBOAK9dgAAAAAAAAAAAAAAAAAAAAAAAAAAAADDuClBXX/dZV//ALBPehfjuClB3VP+Kjv49PehabMnSbn6ZUG3J0i1+qF80vyLeo5UOKl+Rb1HKhVyvaOQAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgxqnPoYeujVVOghdyuFwWtc1kj0RF3aFVtPatGz6aaq6ZnXwelq1NyeabbtTPMazD881RQI6ddXo5U16TZG9Yv03rVNynlMasaqd2dGQAe7EAAAAAAAAAAAAAAABQudf09b6mP3l2WT5qpvVoUpnX9Pmepj95ddk+aqb1ae4t82f7W16Ob2Z/9hkesO7zkMzV+aaf1q+4mZDM1fmmn9b+hW2fqQuszjZq9Gwy++jNN1O/uUkacSO5f/Rmm6nf3KSJOJjd+eWeP9Kn0hkAGD3AAAAAAGFVE4qiGnq8UYbpKrvWovtujn015N1S3a7NQNyCMVmOMNUt4+CJblElZ3n34kevGPRVRdfSiKdK7Zi2C14et17q3SpBcKVKmFrU1XYVu0mvp0BomgIFiLMqjtEkKJaK+rZLSR1e1Fs7mPRVTcq+g31HiyzTq9k1S2kkjYx8kc6o1Wo5NU1/IjWBvwdOiuVBXIq0lXBOiceTejjuEgAAAAAAADhqt9M/8KlcYAVVxLN+NxZNR8g/8Kla5e/SWf8bjdxvp1+iszPrW/VZycDCmU4GFNJZwyAAAAAAAAAAOOeTkoXybDn7KKujeKkInzUwpSVa0twmqaKRq6LysKoiE7I/i3CFgxRSOprzboqhrk02tNl6dTk3kxp3onXufVlxfhi8Ii26+UM6r+6kyI7sXebxr2vTVjkcnSinlfM3ubaymWS44KuU8mnld7SyaPT8Lt2pT7ccZrZc3BaOS63WlWJdOQq27TdPRtcx7U2aa4+Gp5VXZp+aH6FBTxrhTuuL9SK2LENgp69qblkhfyT+zehdGBu6Ky4xM5kM9z+Bal+7k69Ujbr+PXZMZs1x3JpvUVcpXEDrUNbSV1O2oo6qCpidva+KRHtX80OyeT1AAAAAAAAYdzlB3ZNM1Xfx6e9C/FKDu/wDus/8Aj096FnsznX6SotuRrFv9UL4pfkG9RyocVJ8gzqOVCsld0cgABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHzI5GMVy8xjM6RrIz6QRuvvzmzNbE3REdv1N5QVTKunSZnBTRxtpWMm5VbtzrMPWuxXRTFVUOyACweQAAMKm7Q6Ultp3uVyt3qd4+dU10PC9YtXY0uUxPqmJmOTjpoGU8XJsTROJzAIZ00xREU0xwhAAD0AAwq6JqAQGguOIG00romxOVU5zY2mvSug5TYVipxRSts7Uxr1+bFFWtUPWqzXTTvTHB3wAWTyAAAAAAAAUNnWn+vWepj95ddk+a6b1aFK52fTyP1MfvLrsvzXTerT3Fvm/hbXo5vZkf/IZHrDuENzU+aaf1i+4mRDs0vmqn9b+hW2fqQu8v6NXo2GAPoxS9Tv7lJDzkfwD9GKXqd/cpIOcxufNLLH+lT6QyADB7gAAwqoiKqroiFd43zCqaCkbPhuiguUTapKeeZXroxd+qoicUTTjwI5m5i7E0d2fa7Gx8HIyI1NtunKL07t6od7KLBl5tr5qu6rTLSVNOqckqKrtp+9V0XciESQ0GLL5fYMQ4TvVZepnWmorXvmbubG1jVRqIqJ1ou81l1wHcsV3221VolTvWSjkbUVTERWsekyyMRenaTdu3pqXlasN2q32SjtPerKmCkZsxrUNR69e/nNtFFHCxGRMaxqczU0QREwyidFVwZY1NdiCputylip3yWOC3MWNUerJGbWr96dCocFwyfr7hh+2WWrxS5ae30TaNmzRt1c1vBV38dNxb+oJ4m9Ku3ZeVUneqVF1bMlPRx0iLyWyrmMTRNdCPYjwdeoLnJXuTl4n7KSJptI5rU0T08C5TDmo5NHIioRojV56qai92WZaq1RJAxF2la1F0JTgPMW4VtS231UTaiXVVcuuyqJzrv3bi0qm30dRGrJaeNyKmm9pXeNstG1TZamyObDMrV8lVVOzQy14JmYmE7tF8t10lkipKhskkbUc5qcyLuNoef8Gre8L1LrS6NUqKv9gjnrso127Z47+ZS9bUydltp2VTmunbGiSK1dUV2m8hi7YAAAADjm+Rd1KVrl79JZvxOLKm+Rd1KVtl99JZvxuN3G+nX6KzM+tb9VmpwMKZTgYU0lnDIAAAAAAAAAAAADBG8Z4Kw5i6hdSX22Q1TFTc5U0e3qXmJIRzF+IY7VAkEKo6pk3NTo9I104sqLdVyrdpjXV5Qzf7mi62509fgqZ1zp2aufSOcnKsT0dJ5zrKWpoqqSlq4JaeeNdl7HtVrmr6T9P8H0U0VK6sqnOdPPoq68yELzpyVwtmNQyTPp2W+9tYqQV8TdF15keifGT+ptWMqaeFbVyMWNZ3Hg7CmM8WYUqm1GH7/X0SouuwyVVYvW1dUL7y97rS9USx0uNLTHcIk3LVUqbEvWreC/0KPzJwDiXL6/OtOIaJ0SrqsM7d8Uzelrv04oRfThqWE2rd6nVXRfuWp0l+lOXeauCMdwtWw3qF1QqaupZl5OZvo2V4/kTg/KKlqKmjqGVFJUSwTMXVr43K1UX8i/coe6bxJhxYrdi/bvdtbo1JdESeNOv978+00ruFNPGni3bWXTXwq4PcII7gbGeHMa2dt0w7coayBUTaRq6PjXoc3iikiNKYmOEtwAAGFKDu/wDuu/8Aj096F+KULdk1zYd/Hp70LTZnO5+mVHtr5bf6oXtS/IN6jlQ4qX5FvUcqFXK6o5AADIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPmRu2xU6T6BjNOsaCOVFgSWZXqqJqbm3UzaSkZC391OJ2QpoYuzLGLcm5RHGXrXerrjSqeDIALF5ABxyyxxpq9yJ1mMzERrI69yqm0sCvVdFIp8PStrFdtroi8Ok2WKpFkp12V3aENduf6T5p0o25fs5MUWqtIhcYONTVRM1Qsq11sdbTJKz806Dt67iK4Pk5KF6ucumhvKW5U887oWu8pvSdlsjadOVi2665iKqo/lX5Fnq7kxHKGwABdtcCpqioABorjZO+Zttrk/M2VupEpIEYm9edTtArrGy8azem/RTpVL0qu11U7szwZABYvMAAAAAAABRGdn07j9TH7y67P82U3q2+4pTOxP9dx+pj95dlp+baf1bfcWub+Gtejntmx/fZHrDtrwIbml81U/rf0JlzENzT+aaf1v6FfY+pC4y/o1NlgD6M0vU7+5TfmgwB9GaXqd/cpvzG588s8f6VPoyADB7OvX1cFFSSVVTI2OKNquc5y6aIU+7M661eNmss9M+rtyqjUgTRFVvO7r1OXMS7yXfEctsWr5Cgp4Xu8h6aPc1qrovNqq6Ihs8nMMxRQOvs0KNWXRIk2dNycV7dQnRPn22guE9NcaqhYtTGzyFenlM14ovSbFERE0RNEMgIY4DmNLivEtnwzblrbvVsgYieS3XVz16ETnKJxjnZe7o6Snw9AltpV3JM/ypXenoQ3MbAv5M/BHDxVubtTGw4/qVcfDveip6iCnZtzzRxN6XuRqf1NdJiTD7HbLr3bkXo74b/k8eXO4XO5zLNcrjU1T1XjJIqnVRmnBVL610ZqmPjr/hzN7pnbif6dGvrL2nT3u0VKo2nudJKq8zJmqvvO+jkVNWqjkPD7Vc1dUc7VOdFJThfHWI7A9q0twlfEn/Llcrm/1Mb3Rm5TGturVnj9MrNVWlynSHrkfkVdgLNu3Xp8dHdWJRVbtyO18hy9fMWfG9kjEexyOaqaoqc5z2RjXcerduRpLq8XMs5VG/aq1hrrlZLbcaiGoqqZj5YXbTHKm9FNluRNOY1t+vNBZqNamunaxqcE13qVFfc066e8xOt/7Gkifw+unpPTHw71/wCSODXzdq42FpF2rjPd3rwHMajDF5p73a46yByLqnlIi8FNua1VM0zpLet3KbtMV0zrEsgAxejjn+Rf1KVtl99JZvxOLJn+Rf1KVvl99JJ/xON3G+nX6KvN+tb9VmJwMKZTgYU0lpDIAAAAAAAAAAGNw5jq3Sugt9FLVVD0ZHG3VVVQmmJqnSHSxTe6ax2uSrncmqJ5LedVK/wRSVWKL5Ldq9FWFjtUReHHchGbpc6/H2L2UlIrkpGP2W6cNE51LssNsgtVtiooGoiMbvXTivSa9NXWVaxyhcXrUYFndn6lXP8AKGwY1GtRqJoiH0AbCmRvMDBlgxxh2ay3+jjqIHp+zfsptxO5nMXmU8CZ35W3nLXELqSq1qbdMquo6xrdGyN6F6HJzofo9zEazHwfa8c4Sq7BdYmuZM1eSkVuroZP3Xp6UPexfqtTw5PC/YpuRx5vzCaZVE01RDc43w5X4UxVcbHcI1ZPRzuidu3L0KnoVN5pkUu6JiunVSVxNFWjfYBxpiHA1/ivGH66SnkY5OUjRfIlbr8Vyc6HvzI3NSz5nYdSpp1bT3OBESrpFXexelOlqn5xuJJlVjO5YBxzb8Q0D3bMUmk8aLuljXc5q/kaeRjxXGsc25i5M0zuzyfqADo2K5U15s9HdaN6Pp6uFk0apztcmqHeKlbMcxQ90T/iy7+PT3oXwvEoq5J/xbX016e9Cz2bzr/TKk2zHw2/1QvKm+Sb1HInA+IE0jQ++YrJXNPIAAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA0MkCz3xtDgTLa53pZEbVLHyNI3ndK7cnZvX8jOzaqvVxbo5zwG2w3jbD1/xDdbFbK1s1Za37E7U4a8+nTou4kyn5n5ZZhXfCOOYcRwTvc90quqUV26Zqrq5F6z9FMHYkt2KcNUd8tkySU9TEj06WrpvRfShabW2Nd2dMb3GJ7/AM08+MN5qnSNeghl7u1bFVubHIrW9B1abENdE9FdLtpzopwOX0pxMW9Nq5E8G9Rs67co3qU9XgYTXTmNNFclrqJXQO2X6b06FOhQ3OppqtWVblVirouqcDar29jUzRPHdq7+793hGNXxjvjuSkjuLle1YnIq6IpII3texHNXVFTVFNffqdJ6Ny6aq3ebW1bVV7Eqijno87U7tcatJVu5e07Sb1RCLyppKhJrY1ZIJYHcEVdCP1bNmq06FPkO3qK7lui7Pfw9nRYWlO9S39iTZpHr/wBp82tHOua7PO45LX5Ntkdp+6p2cLRJJJJMqcNx02yrFVfZqKfDVoXqojfmUjZrspqcdVUR08ave5ERDkVUYxVXghFLvUS1dbyLFVWou87faWd2O18PGqeEK6za6yrTub633KKr2tlFRE51OG43yjo1VquV7+hpqaiobb6PZYuj1TRCMTyufIrlXVV5zj9p9LrmJbi3TpNff+SwsYFN2vXuS2PE7HyI1INEX0kiicj42vTnTUrW3RSTVMbWNVV1LJgbsQsb0Iha9Fdq5O0aK6706xHLg8s/Ht2JiKX2q6JqpXN7zaw9bcWNsKyte5r0ZLIi7mqpp+6EzSpsHWaW2W+Vr7rURqiIi/JovP1njCW811Rcn1k0rnTPftOcq71XpOhycyLVUUwtNkbArzLc3a+Edz9KqeaOogZNE5HMeiOaqc6HIVD3NGNW4jwlHbqmXaq6NiJvXerS3uY26K4rpiqFDlY9WNdqtV84ZABm8AAAUVnV9O4vUx+8uq1/N1P6tPcUtnT9O4vUx+8uq2/N8Hq09xZ5k/29r0UGzo/vb/rDskOzT+aKf1v6ExIfmj80U/rf0NGx9SFvl/RqbDAP0Ypep39ykgTmI/gH6M03U7+5SQJzEXPnllj/AE6fRkiGaOIXWKw7EDHvqqpVZHscWpzr2EvKyznuFwtqU1bFhSC70sLV255KzkuSVV4aIqaop5y9mksOEaa9XCN0F4o5qaTYmkY2Rqztdrq5Faif1LipKaGkpY6aBiMijbstanMhX2SjqW52uovSWGitc/LugTveVZUc1Eauu0vWWORCZnV86EZzExdQYPsL6+qVHyv1bTw88j/8dJJXvaxjnuXRqJqqnkzNvFEuKsY1EzHqtDTKsNM3m0Rd7vzUstmYU5l7d7o5qbbW0o2fj73+qeENHia+3XFF1fcbvULLIq+Qz91idCIa9G6Ih9IiIhmJj5pWxxNV73Lo1qJqqn0W1bt2qIppjSIfIb127lXZqqnWZfI09BbeBsm665QMrL7ItFE5NWxJveqfoWJSZR4LhhRktukqHab3Pmci/wBNCpyekGLZq3Y1q9HRYfRTLv0RVOlOvi8w6ab14BdFTU9G3vJfDFTC74PdU0MvNpIr29ilMY8wVdMKzr3zsyU/7sreCnpibZxsqrdpnSfCWrtHo9lYVO9VGtPjCMterHI5rlRU5yxMCZuXCxwLb656VMKJpGrl3t6PyKhuNy2dY4l16VNQs0iybauXU9c2xZyKdK41Y7OvZGL8VurRdGJMS1+IKp09VOr2uXVreZDUImidJocMV3LwNje7VyEgT0GePZooo3aY0hz20Mq/Xfmq7OsrDyZxI633VtBO/SCdyN3rwVeBfDXankq3VDqWtjkYuio9F16N56iwtXJcbFS1aLqr401603Kcpt7Dizci5Tyl9I6GbUnJsTZqnjT/AIbYAHPO5cc/yL+pSuMAfSSb8TveWPUfIv8AwqVxgD6ST/jcbmN8lfoq8369v1WWnABOANNaAAAAAAAAABhVRE1UDhnljgjWWRUa1qaqqlC5tY0nvt1TD9pkV0au2X7G/U3WduYLaGF1ntkqOnf5L9nm13HQyIwQ6adMR3SNVXXWNHc69JpXbk3a+ro/d1GBhUYWP23Ijj/pjxnxTvKbCbbBZo56iNO/Jm6vVeLfQTr06GGoiJohk26aYpjSHO5F+vIuTcrnjLIAMniDRBzEHzVzLwzl3ZpK28VbHVKt/YUca6yyu5k05k9KkxE1TpCJmIjWXlvu56egjzJp5qZGpUSUbFqNOddVRFX8jzwm8kmZOMLljnF9fiG4u0fUyatjbwjYnxWp1IRxE0Qvce3NuiIlRZNyK65mGFPh+mp9PVNOJIcsMG3TMDGtDhq1sdrO9FqJtNWwRIvlPXqT+pNyuKY1lFmiaqtIe8+5WmqZshMKuq0dyiU8jW7X1ElejP8A8ohZ6GuwzZ6PD9goLJb2bFLQ07IIk/7WpobFOJQ1TrMyvaY0jRheBUMVoqq7NOepYxeShq0e5ypu03FvdZWlvxAyizCqqCSNNJ6hGIvpNzDmqIr3Y7lbtKmirq9+dI3oWYxNGohlTDd6amVNJZwAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGFU8Wd3Xi6SuxpRYThld3vb4GyytRdyyvTXf1NVO09nVMrYaeSZy6NY1XKvoRNT8ys2L0/FOY15vTpNpKmqerefyUVUanYiHWdDcKMjO36o4Ux/KJnRFGIqaKehO5OzUdhm8Pw7d53Ja6tU2Vcu6J/BF6igXM2FRFXU+opnxTtkiVWq1dUU+obW2ZZzsaq1VHNFOsP0mvlOkz0miVHRvTVrmrqimhkjdGqopU/c7Zvx1Vshw5iCbbljTZhle7evQhej6eGrj24XIqLwPyX036H3rWRVVTzj+V5hZs0U7lTXWqulo50ci6tX4ydJI5mRV9Ok8SortCMVdJJTqu1qc1rr5KWZFXXYXihwuBm3MTexsmPhn+Pzht37UXo36OaU2KrdC7vSZV0/c15vQbuZqPic3pQjT1jniSqgXhvOzHf4mU37Xe5N3Hid5sjbdq1Zm1kV8I+WfGFRdx6qp3qY497qNRaavc1dyKporqxUrnaaaanNdLqs86OiTTReJr5JnyO2nLvPn22No2rtU27c60xMzC7xceunSurwSOgc34LczVNVTpNvhqPk6RelXKpBmTyMTc9TYWu91FMxW67ScyFpsTpDax71E3Y+GmNGvk4FddMzT3phe6lIaRWovlO3IaSnaymgdUSr5XE6sl2ZVyI6Z2mnMp0blWrM7YjXyE/qWW2ekNm9c6y3xiI0j/APXhj4dVPwz+7r3KrfUzq5V3cEToPmio5qqRGsaq9PoOzbbe6pcj37mm7WpprdTqxjU2kKDB2VOZXORk1aUz7y3a73V/BajWXcsdup6Jm29UV68VUiWc2aNswPY5OSlbNcpWqkMbV10XpUiGZ2YbLHSPkfUeWuqNYjjyrjDENdiS7SVtXM9+0vko5ddEPoOBnW7dnqcajdpjvb+B0buZV2Lt+eHg4cTX64Yhuk1fXzvlkkcrlVy6muY3dv5zDG+g5W+lDKrWrjL6FZxqbdMUUxpELP7nbFL8OY6pEfIqQT+Q9Nd2h7lhc2SJr2rqjkRUPzUtk7qWvimYq7TXblTqP0Dynu/w3l5Zbk52r5KVqP3/ALyJovuLnZt3WmaPB896ZYEWrtN6nv4JYAC0cSAACjM6fp3F6mP3l0235vg9WnuKWzo+ncfqY/eXTa/m+D8Ce4ssv8Pb9FDs/wDG3/WHZIfml80U/rf0JgQ/NHfaKf1v6GlY+pC2y/o1NhgD6NUvU7+5SQGgwCn+m6bqd/cpvyLvzyyx/pU+jK7kVSqKzG9RQVuJaOv2J3sqEbRxyM1bpzppzonEtSV2zE53QiqUHVSUVyxjtVd3gikkqXKir+6mvDoXoPN7LdwDTzxYfbLUpCj6iV06JEzZbo7hu6tCRHXoGtbRQtYqK1GIiKnPuOwBD837u6yZf3OrjVUkexIWKnHV67P6qeTWovFVPSvdIoq5cP04d9xa/wBTzUxdUQ7ToxREWqqu+ZfNumd2qb9FvuiP8z/4Zcu4uPuecHw1Uj8SV0TXtidsQNVNfK51/Ip1qau38D1NkmyNmX9DyaJxdrp0m10iv1WsbSnvnRq9FMWi9la1xruxqnKIiJohkHDVLKlNIsCIsuyuyirxU4F9S5Q6OIL1b7HQuq7hO2NicEVd69R59zNxjLipX08bVZRN+KipvcdXH09+mvUzb5LNyiPXSN6rsonoToI85Goz0HY7K2TbtxF6udZ7vB8s6S9I792uca3Tu0xz15yre5w8hVSR8yLuOku5xusUo3vxVbwU0q7y2q41aQ0rFW9REy3eF5ljrWt13KTpq7kUr6wL/wCtj6ywINVYim1a15KLatMb+r6cqouqHoHI+tWqwfybnarBO5n5bl/U8/OTVC7O56V3wLXtXglQmnslP0ioicbXwld9CLk05+7HKYlagAOGfY3HP8k/8KlcZf8A0ln/ABOLHn+Sf+FSt8v/AKSz/icbeN9Ov0VmZ9a36rMTgAnAGoswAAADhrKllLCsr+CAcwIncsd2mhVUmciKnS9ENFW5vYfp9dVaun/2oTuyLH3FcZvY7hw7bX01NIi1T2qm5eBDsVd0JZaSlkZSxt5VUVEXlddDzpinMKfEN3dVSqrm7eqosnMed3XTSOa52Vi2+si7kfLC3Mr8LVmMsSd/1qvWFH7T1dzprqen7dRwUNHHTU7EZGxuiIh5Kwhn7R4Xs7aWiw/tPRNFctQiar2HFde6sxMu0lDY6KLoV8iu/RCcfDqop5Mds7UnNvcJ+GOEQ9iGPzPBt57pTNGsRUp62jomr9lCmqdpC7xmxmddlVKrGVyRrv3Y5VYn9DcpxKp71FVeppfoxcbtbLZGslxuNJSNTis0zWe9SuMY5+Za4biftXtLjO1F0io2rJqvRrwTtPAVfX3yvcrq67VdS5ePKTK7XtOktLUOXVWK5enie1OHH+qXhVlT/ph6PzC7rC/3JklLhG3R2mJUVO+JdJJetOZOw893+93a/wBzluV5uFRXVUq6ukmkVzl7T6t+H75cHpHb7TWVbl4Nihc5V7Cb4fyLzUvKNWHCVXSsdwfVKkSdi7zYoi1ajhwa1c3bvNXCLofD5ETnQ9L4X7kPEdXycmJMRUVvYvxo6Zrpn9XMn9S8Mv8AuectsIvjqfgpbvWM0Xlq9eURFTnRnxf6KY3M2iI+HimjCqn5uDx/lTkvjfMWpjkoLetBalcnK3CrRWRonPsppq9ertPcOTuVuGssrEtDZoOWq5tFqq6RE5WZf0anMiE6jjZFGkcbWsY1NEa1NERDkQrrt6q5zb9qzTbjgAA8nswvEou5Lpm31V6J/VC9F4lE3Tdmyv8AHp70LLZ3Ov0lSba5W/1QvOBdY2qcnMcdN8k3qOROBWyuaeQAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgARPNy5/A2WOI7k12y+C3TK1f+5Wqif1U/MnbV1Qiqu9V1P0j7oO3Vl0yZxRRUMbpKh9C5Wsam92ioqon5IfmzEjmS6OarXJuVF4n0noFRTMXJ79YY1c3Yn12kXQ4k4nZc5FbvONGtcfUKKKSIdi2Vk1DVR1MD1a+N201fSeqciMyXXmmit9ZUIlY1EREV3xjyfsKmqom42eHrrU2SvhrqWVWvY7aTRec4zpT0VtbStzVT8zat17sP0Tp6qGpjRlS3RV5zq19uRmr41VW8xXmSGZ1pxlb4rbdJGU9xjboiu8nb05yyLi+SjTYa9HMdw5z8wdLujVeJTV1tOk0t7FvTNe7DVx1M0GsbHKiLxQ4HPcq8RI7bcrtND5TgfIa8iqfhmeToaaIjjoc4HODU1nV6wLwGgM6DeJ4CHYoOTdOnKro1OJ1nORE3HTuFwho4XSyStbonOpuYtVUVxw1YxZqufDHel0tYxrNiDRrdOK7is8zswKCwUskUMzJqtU3NRddFIpjjM+eOCSjtypqqaK9EKNvVbUVtU+aeRz3OXVV1PpeN/XojWF7sfovcmrrLscP/AHmxim+V1+uMlVWSucrlVUbruQ02zvOd6HG7Ut7dMUxpDteyxbp0iHwh9Iu4+V+KdywWi4X67wWu10756qd2yxrU/qvQh606zOkNO7XTaiaqp0iHcwdYbjiXENLa7ZTvmnkduREVUROlfQe+st8Oswrg6gsLZlmdSx6PevO5d6/1UqrC9gsOR2A1u1ydHPeqlqI9V+Mrl37LU6E3amz7nPGVdi6qutVWSrJr5aa8E1e7TT8lLzDopsTuz80vmPSHMu7Tom5RH9KieE+M+K6QAWbjQAAUbnP9PIvUx+8ui2fN8Hq09xS+dH06i9TH7y6LZ83werT3Fll/h7Xootn/AI2/6w7JEM0PmmD1v6EvIhmh80wet/Q0rP1IWuX9GpscBfRml6nf3Kb40OAvozS9Tv7lN8Y3PmllY+nT6D0RzFReCoUfe8NS1mJ61KKONeTqHfG0RU16NVLxKYzKt9mw9iFLjclr5m1sjpGx086tX082hg94WzZGuZaqaN6ormRNa7Rdd6Id4g2UuILdeLXUQUUc8CQyrpHPKj37K85OQhDc4rW67ZfXKnjbtSMakrUTpaup5Ni1RqIvE9vVMTKinkgemrJGq1yehUPIuY+G5sM4rqaFzV5FXK+FdOLVXcdV0ayaaZqsz38Y/wCXC9McGquKL9McuE/8I9r2l69zliWJ1HNYKiVGyo/lIUVePShRacDsWm4VdpuEVdRTLHNG7VqodDtHD7ZYm339zk9i7R7DlRXPLve10XUc5UeBM4LdWwR01+VKSoTdyv7ruvoLGpsR2KohSWG7UT2KmuqTt/yfPsjBv2Kt2umYfWMbaOPkURVRXEuti7C9rxFSLHWwpyrU/Zyt3Oaefce4WrMNyvbMiui/ck04l5X3MLC9sjdtXOCaRP3Y3bXuKLzNx7Lih6wQxrHTpw1TiXWw6MuK9NJ3fz/4cr0pt4F23vVTG/3ac/3U5eJlnqnLzIdBOJtrhQORyuTf1GudE5F00XU6ebcxVq5a1VTFMRDa4biV9W1dNxO49zNCO4VolaxJHt016SR8F9B60VTTLnNp3N+vSGF4l+ZE0bqfC00zk0WaoVU6kRE/yUPBGss7WIirtORNx6iwZQJbMOUVKiaK2NFd1rvUoekl7S1TRHfLrugmNNV+q7PdH+W7ABxr6s45vkXdSla5e/Sab8Tv1LKm+Sd1KVrgD6TTfjd71N3G+nX6KzM+tb9VnJwATgDSWYAAB8va17dHNRydCofQA6E9qts/ytBSyfiiav6EWx3S4Ssdlnr6+12/RqeSiwt1VewlV5uNNa7dNXVcjY4omq5VVTyZm1j2qxVeJI4nq2iY7ZjYnP6TVysmmzT+a/2Bsa7tO94URzn/AIRTE8VNibEWlHbqeFskmjGRR6HoDLbJDDdNYY5b/bYp6mVqOVitTydxo+50y+dK9uKLtCvJtX/0rHJ8ZfrdSHobeeeFbriOsrnjLd6S51nrIxcaIimjnp3yrt+SeXL/AI2H4DruyJyzcu/DsPaWcQK55oWOkzFo8ExI6orqhzWuVi7o1XXj2FjFVc8pclMxHNrUyIyyRdfB2FfzOeHJDLOJdUwxTL1qpY+8byN+rxNI8EKo8q8vqREWLCtu3fWj195u6LCeF6LTvXD9riVOCtpWa+4rzMbPay4Du3wbfsPXmKRU1jejWbMidLV13mnw33SVixHVLS2TCd/rZ0TVY4mMVdOrUz3bkxr3MN6iJ0XjBFFEzZhiZG3oY1ET+hylIVfdIYUtdy7wv9mvdol10VJ4W6t9KprqWbgvGWHcZW7v7Dt0grYk+MjHeUxehzeKGE0VRxmGUVRPJIgAYsgAAAABheBRF2/3ZX+PT3oXuURdv92V/j2+9Cz2b81fpKl2zyt/qhelN8k3qOROBx03yTeo5E4FbPNcU8gAEMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB07pV0lDQvqK6RkcCaNc5/Deuia9p5C7qjJZ1HVTY2wpTR94y6PqaaLhGq8Xt9C8T1BmpSSV2ArrDCq8o2FXt06W7ygu58zTprhTvwTimVJo37UUL5V14qvkrqXexb2ViVTlY/Hd+aPGDnDyQuuyqLxQ+E3c5e3dI5Pz4Wr5b7YoHS2md6uVGJryWvMvoKJTaRdHJop9r2VtOztCzTctzz/hERMO1C7WJyOQ4uKLqdmmRFZvOKSJEcqIqFxuxEvTTV3LHdq211jKikqJInsXVHNXeejssM5I7nHFbb3MnLtTRJXcXdZ5ka3TcdinlfC9HtcrFTgrdynH9KuimPtqxVRVHFs49XV1RU960s8VTE2WF6Oaqaop9r6Ty3lpmtXWZ0dHWvdLT7k3rvRPzPRWG8T2y+UbJqadrnKm9NUPxz0v/AOn2Zsi/VVFOtLpLGTTdhuk4AwqpprqcUk7I01c5ET0nzmbVVM7ujcpiauTnbofEsjWN1VdEQ0tzxFR0rF8vacnMikJvuKqqp1ZC7Yb6DZsYNdyVji7MvZFWmmkJViLFFJQxuRHo5/QhVOJ8R1lxkeiSubH9VFOKvnllcrnuVyr0qaioaqqqnT4GFRa/OXb7N2Nax9JmNZaWtc5znamnqG6KpvaxqIiqaWo4rqdRjzpHB1cW6dzg6T26HA/RFOzKqIbfBeEbzi68xW60UrpXvVNp2nksTpVSxtRVXVERHFT59+3jUTXXOkR3tXh+zXG/XSG3W2nfPUTPRrWonTz9R60wHhLDmS2DpcQX58Ul1exNt/FdV/cadnDmHMH5KYTddLs+CW5uaqrIqIr1XT4rNfeeaM2cxLxju9Pnqpnx0bFVIIEXRrE/yXVNFOLTrPGv/D5rkZN7b93q7WtNmJ4z31OPNvMO544xFLVTyvbTNXZgh18ljfR6S8O4ja59vvUqouy3kmIvXtKeWGsXaRVQ9i9xnbVpMv6utc3Ramq3dTU0/Uxwta729PNPSS3bxNmdVRGkaxEL5ABevmIAAKLzo+nUXqY/eXTbPm+D8Ce4pfOf6dxepj95dNt+b4PVp7iyy/w9v0UWzvxl/wBYdleJEcz/AJog9b+hLl4kRzO+aYPW/oaNn54WuV9Kp38B/Rul6nf3Kb9DRYF+jdL1O/uU3qEXPmllY+nT6MkIzYw9brraG3CvkWJtCirtb9NlVTXXQm5x1EUc8LoZmNfG9NHNcmqKhg9lCYUxNZ7RfYYsPR07nLsxSMZtu21VURVVV9GpfcMjZYmyMVFRycxVt3gpsNXiWhloWtopY5Zo5oqZFcj1RdN+mu5f0JLlHLUyYPg5dH7DXORiv11Xfqv9VUiEzxTAgmbWCW4stLX06MbcKfVYnLu2k+qpOwvpPWzers1xXRPGGvkY9GRbm3cjWJeJ7lRVVurZaOshfDPG7R7XJwU6+qHq/HuALJi2nV1RGkFaiaR1UbU2k6+lCgMZZb4kw1K90lI6rpE4VECbTdPSnFDu9nbcs34imud2r/3k+YbW6NX8Wqa7cb1H8x6oerdedT5Rui6o5yfmfaMem5UX8zOw/wCqpdTconmoIm7b4Q+N/Sq9ZnmRNdx9JG9f3VO3bbTX3KpbTUdLLPI5dEaxqqedVy3RGszpDKizevzpETMujySPXTZ1JPhHLW54hR9TTw7MbEVdV3Iq9BYuX+T9Ur46zECtgai6pAm9y9fQXVbLdSW6kZTUkDIo2poiNTQ53aW36KPgscZ8e52Gyei9y5G/kcI8O95TuFnrLLUupKymdC9m7enHqOvqi+k9QYtwvbcQ0Sw1ULUkT4kiJvapSF9wFd7beEpmUzpoXO8h7UVUchng7btXqdLnw1R7KfbHRG/Zu79n4qJ94c2U2H1vF+ilkZrTwKj39G7gh6GY1GoiIR3AOHo8P2dsOyiTyeVIqdPQSPU5naWXOVemY5Ryd70f2VGz8WKZ+aeMvoAFevnxN8m7qK1wEmmJZvxu95ZUvxHdRW+BE/1LN+N3vNvHn4K/RW5sf1rfqsoypxzO2YnO6EIdhbEvfOI6y2zSKqo9djVeg09VrRbqqiZjuTUAEsGFOGomip4HzzPRkbEVXOXgiHI9zWMV71RGomqqp53z6zMWqe7D9kqHJCmqVErF+N6Neg8MjIpsUb1Sz2Tsq9tLIi1b/efCGkzyzJkxBWvtNrlcy3wu0cqf8xUNPktgKfF9/bUVUattlMu1O9eDl5mp6VI1gjDVwxbiOC2ULFc57tZHrvRjedynsfB+H6DDVip7Vb4msjib5TtN73c7l9JU4tqvKu9bc5Q7zbWfY2Fhxg4vzzHGe+Pzn857m0oqWCjpY6WnjbHDE1GsY1NEREOwCH5j4viw3QchS6S3GdFSJnHZ/wC5S9iNeEPmEzrxlDe6Nzeo8vrDLQ29yTXypjVImpvSFF3ba+noQ8y9zHXV1+z/ALXX3GofUTvkfI5z11Xc1VJJ3ROEay34SixNeZpJblW1CK5XLvRF36KR3uOIuUzwt66bmQSu/wDyqfqWFummLFUxzaVyapuxHc99JwAOKolZBBJPK5GxxtV7lXmRE1Ur268W93jfIazGlFaYNFfQ0vlqnHaeuvuahLO4QwwrLPdMSVUe1tObBCq8+mquX+qHnbNy+zYpzGu9yc7b74qXcmirwbv0T+p7EyVvuG8BZJ0tRc66CHk0dI+JrkV73KiaIic6rob16mbdqKY72jariu7M+Cuu7wobbGtiqmRxtrZNprtETVzE6Su+4yuVwo866Gio5JO96qGVtRGi+SrUYq6qnoVEU7GZs+Kc6cc992uikljRvJU0DUVWxM5tV4arxU9AdzLko3Lmmnvl6WKa/wBWzY8ne2nj+qi9K86iqYt2dyebKn47s1U8l4gA0W4AAAAAMLxKIu3+7Tv49vvQvdeJRF2/3ad/Ht96Fns35q/SVJtrlb/VC86b5JvUcqHHTfJN6jkQrJXNHIAAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgq4GVNLLTvTVsjFaqdaH5wZo2qrwZmfcaFqOidT1KvjVN3kqurV7FP0lPI/dq4O0xDSYpjaqNqmJFIrU/eam7X8tC72FtGnDu1RX8tUcXvjW+suRR4pbkVmdbcbWBMLYnWJ8/J8mizKipMnR1lQ90JkpU4Tqn3yxNkqbXM5XKjW6rFrzL6CpLPXVdurW1FJM+KViorVaum8vy190RVrhz4Ju1ppq39nybnSoq7W7Teb1rbNvZmZ12JV8NXOnuW07DyJnWinWHnGNdE0VN5h+m0im8xRPS190lraSljp2PXXk2JoiGhfqrlXTQ+u7J23jbQtxVTPFqZWDcxp0qhzQPRfJ0EuqLvPiDVHnJLrqhfRTq0qZfCOXn5jfYVxTdbFUtloZ3sRF1VEdxNDouu4+2u2F4FPtLYmNn0TRdpidXtRXVTVrD0PhvOVaynZBWxLFMm7bVyKhvJMRzXCPbSpRzXcNFPMjXOa3bYqtX0G2s2Kq+2vT9osjehy7j4Z0n/wCktq5VNzFjSfB1ezdqW7Ux1kLxqZXv1VV1OjKqJrqRWzY7oatjWVKtievQm43zK6GoZtxPY5F4aKfG8/orm7PrmiuiYfRNn5mPfpjq5fNSu41lQ7RVO7UPR3Oayodo5UU0KMeqidJdPjTGjpVW/U09UzRdxKLVZbneqttNb6SWeR66IjWqpduXWRlJSMZdcXyIqom0lNr5LfxKX2DgXrs8I4eKu2t0jxNl0f1Ktau6mOcqgyuyrveNq1j+RfTW5F8uoe3ydOhPSegrxdsGZI4TWnpI2S1z2bmaokkztOK9CGszOzjsGD7a6y4WZDNVRJybUYn7OPT3nlLFF8uWIrtLcrnUvnmkXVVcuunoQvpuWsSNy3xq8XDTYzukVzrsqNy1HKnx9W0zExze8b3h1ddJvJTdHG34rE6EQjCJp8beETROBtMNWG54ju8NrtNK+pqJnbLWtTh6V9Bqa1VzrzmXQU27OFb04U0w48N2quv16pbXb6d88870a1rU38T9AMsMLR4PwXb7GxUc+GNFmcifGkXe5e0ieR2UtswFb21dU1tTepWftZlTdHr+63/JanpLzDxps061c5fLeke2+33It2/kp/n82QAbrmgAAUZnT9O4vUx+8um2/N8Hq09xSudP07i9TH7y6rZ830/q09xY5X0Lfoo9n/jL/rDskSzN+aYPW/oS0iWZvzTB639DStfPC0yvpVNjgb6N0vU7+5TeIaPA30bpep39ym8Qiv5pZ2Pp0+jIAMHq69ZR01ZGkdVC2VqKiojk50OZjWsajWIiNTgiH0RbF+PcLYVdyd5usMM2mqxIu09PyTeBKQQHDGbeDMQ3OG3W+sqFqJnbEaSQOajl3869SkixbiqwYUt6V1+uUNHE7cxHu8p69DU4qBvD5c1rkVHIiovMpVVsz9y6rrlHRLc56VZHbLJZ4HNj19K8yelS0YJop4GTwytkie3aa9q6oqdKKDRoLvgjC9zeslVZaRZF4vazZVew078qsHquqUDm+hHqfOKM28E2GtdQ1Fy74qGro5lM3lNlfTobTBGOsPYw5VLNPKskKI58csasVEXdrvPejKvURpTXMfu1LmBjXJ1rtxM+kOrR5Y4Op3o74KZIqfXcqknttqttti5Kgoqemb0RsRCE4uzhwRhm5vt1ZcXT1Maq2RlMzlNhU4ounObbBGYGFsZQyvsdyZJJD8rBImxIxOlWrzelDG5euXPmqmWdrEs2vkoiPSEuBXt6zjwHZrnUW6vukkVRTyLHInIO02k479DhtWdWAbnWx0lJcpnyyORrf2DtNTybCyD5VjV4tRSF4xzRwbhO5rbbzcXRVSMR6xsjVyoi8OBrLVnVgS518FHS1tS6SeRI2fsF01XpAskGoxJiKzYcoO/rzcIaOBdzXPXe5ehE4qpD6DOjAlbVtpoayrRXu2WudTORqrrpxAscHxG9skbZGLq1yIqL6D7A+ZPiL1Fb4E+ks/43e8sh/wAReorjAif6lqPxu96mxY+StoZca3bfqsSoTWB6dKHnquuzrHmlC5ztlrqhyO6lQ9EKmqaHl3ujIpLXj6nqmIrWrpIhW5VybdO867o9YpycibE/6ol6epZWzU7JUXc9qKh9SSMjjV73I1qJqqqQTK/FdJccJUkk88bXxx6O2ndBXmdWaqLHNZbJIm/yZJUX3CvKt0W9+ZYYmwMrKzJxqadNJ4z3RHi5c8c1EhbJYbHKiqqK2aVq/wBEKKstuuF+u0NDRQvnqJ5Ea1ETXeq+46tNBV3O4Mhha+aeZ6NRE3qqqp6xyWy6p8IWpKusa2S6zpq92m6JPqp+pT26Lmdd1q+WH0TMvYfRfC6uzGtyr3mfGfyhtMqcCUWCrGkDdmWumRHVMypvVehPQhNekIarFN8pLBZ5bhVvREbuY3nc7mQ6CiiKYimnk+S5GRcyLlV27OtU85arMfGNHhKzrO9WyVciKkEWu9V6V9BTGD8S01biB98xFDNNLt7bGrwRebsJphPDUmN7tJibECOdTK79jDzO0X3FlRYeskUaMZaqNrUTTTkW/wCD21imNGvxl5R7sbG1DesNWu3ULHInL7bkVSJ9xPGr85IZFT4tFKv6E27u2322hhsfedNBA9+0r0jaiKqa+gjPcPw65oLLu3UMif8A6N2nSMfg0qqpm/pL2+Vx3RuJfBfKe7VbH7M87O94t+i6u3L/AELGPJ/d7Yna2Gz4bhl1VHLPM1F7DStU71cNu7Vu0y89ZR4bfjTMe2WhyOVlRUN5VU5ma6uXsRT2tijIHAlysElLQUUlBWMjXkaiORVVHabtUVdFQpDuF8L984trcQzN3UsGzHu4OXVD1tjK9UuHcLXK9VkiMio6Z8q6rxVGron5qe2RdqmvSJa+PapijWXhTCWbGLsqMSS2uOSK4W+mqHMlppG6Iui6KrVTenD0nt7LXF9ux3g2hxLbEc2GqRUdG7jG9qqjmr1Kh+aWKa59zvFTcHp5c8rnqnpVdf1Pf3cr4crsMZL2ejubHR1VSr6t8bk0ViSO1ai+nTQZMU6RPeyx5nWY7lqgA1W0AAAAAMFE3ZP+LLv49vvQvYom7f7su/j2+9Cz2b81f6ZUu2eVv9ULzpvkm9RyJwOKm+Sb1HKnArJXNPIAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMERzYwtDizBVdbHxtfNsK+BV5npvQlxkMrdc0VRVHOH5kYhtNTaLtPRVTNiWGRWObwXVF6Doaab111PTvdb5ZujmXGNnp/wBm9f8A1bWp8V2nxvzPMLkcxyteioqcdSryqKonV9Q2Jl0ZNmKu/vc0DWudq7h0HzWUMbk24l39B8sVE5znjXn13G3svbWTs67FdEre/s+xm07tUNZyLo3b0MOTXRDcckyRFRyfmdOopHNcqt3ofauj/TWxmRFFydKnFbU6OV42tVHGHVRqcAqJpwPrYcm9yK0xrouine2si3cp1pnVzHV1UzpU4kc7XZ13H0sfOu8yqJzbzkZppxMatJ4yz3Zhwva5u9jlaqHYorrX0rv2c+mh8vRVRdx1HROc7REXUodpYuz71MzdphtY9y/aqibcyllFjKpRWsqtHN4atTQtXKyPC+I6xiXG5Q07dU1Y+RGuX0FHUNkrapUXkVa3pcSK22iO3ubLtbUic/QfF+kuFsbHqmu1pq73Zn/d8y3uRM0xPe9lJibL/Als5O3yU75Ub8WJUc53WpSGaucl+xAslDb5nUVGq6bLNyuT0qVtU187/Jc9VOjP5flOXefP8jaFVXw0cIdJszofZx6uvyPjr8Z4ulUSSSyOfI9XKq8VXU4Hbl0Q55tGnxQ1Fujro+/5lZFr5SImq6GWHh3cqrSiFhn5VnCtzMzySLAWCb1jG6R0drpXPRXIj5FTyWp6VPVWFbHhLJvDTqmpWKW6PZ+1l4vev1W9CFb4VzlwHhDC60tgpdqpVu9Vboqrpx1Nfl66/ZyY75asdJ8F07tuRy/Fa3o61Oht7LuYtO9NP7y+S7X21XtGuYrndtx3Rzn1eiMtrhdb9HPfbgro4ZvJpoeCNZ09ZNTrW6ip7fQw0dKxI4YWIxjU5kQ7PMe0RpDkLlUVVTMRpDIAJYgAAozOj6dx+pj95dNs+b4PVp7ilc6fp7H6mP3l1W35up/wJ7iyy40x7Xoo9n/jL/rDsrxIlmd80wet/Qlq8SI5nfNNP639DRs/PC0yvpVNlgb6N0vU7+5Td85o8C/Rql6nf3KbznIr+aWdn6cej6ABg9Q8b584XxbRZv3DEFRba6ts09S2Riwt3LGjUTZ2ubnPZB58zNt+a1PiS4Vtqp7nU0UsqrClLW7LUbzJsa6f0CYRDLPFWWFPimkWtmu1trWS7cbKqojcxH6O0Tcu1z9Brc1ZHZh90ZBh2urZKa2MWKCB3RGrEeqtRed2vHqM2vKLH2NcZ228Xq0/B0dNPtzVNW9rpHN37tERFXjz9BP8+soLzcrpbsT4KbtV9JCyKWNsmxI7YREY9q867ukxZcHVz+yiwXYsprhd7RSS0dXbYuVZKs7nbaJxRUVdN/o0I1l5j280/cs3tzamVKihmbSwT6+Uxj266Ivo0XtF6sufOYdp8F71STQUTtGyvnRsUbtOd6pvd06b9S4cJZP2e0ZOzZf1MnLrVsc+rqUTe6ZURNtPQmiIiegaaE6Kf7mLLKyYvwjJiW/TVU88lQ+NkbJdlGtaumq86qqlqYqw3astMD4gv2HUqI6taNY2K9+1suVdEVO0qmzYJzgyunnt+Hu+Ku2ukVzX0rttj9efZXgvTuLZy7teNsSWW60+YDJ2UlXDyUUM2ztb+K6N4fmTxkVV3MuXOH8Y0VzvmI+VrXxTpDHDyqtTVU2nPcqb1VVXp5lI5mdQ0+VefNrbhqaWKlmWNXQrIrlRrlRHMXnVF13c5JmYEzaywvtVJg9Ja2gqHbn0+j0cnNtsdzp06GzwFlBivFWPIMaZjI6NsMrZ+Qlciyzvbvaiom5rE0TcO/U4Nj3UmBrEmEanFFNTPguT5onPe2R2jtp2i6t4c5xdylgTDtdhCW+V1Dy9ayueyN7nro1GtaqbutVLPz1w3X4my+qrZbIeVqXSxOaxF01RrkVTr9z3hi5YUy/bbrtDyNU+rlmVmuqoi6In9EEcmLzN3ULnL3QUkSxVE8elOzkoPjqmxvRCyMn7FaLncUSSy4ghWHakY+q2OTRUa7RNyamu7oPLPGF4zZkxHZbVPVU+zE9r4nab2t006TuYOpsyrfeKXk8M3KCJ0qNl1qpHN2F3Kmjl000USmGizqmqsYd0VS4Wr6ySC3QzRUsaIu5jVRHOVE+suumvUXVQZJYIgSJWR3Haj0VFWp4qnTuInn7lJeL5f6fFuFNH3GNGrNEj9h6ubpsvavTu6TUWa4591VVFR1FFc27Co1z3JExunSq6b/6jmieT0fDG2GFkTPisajU6kOQ4aRJUpYknXWVGJtr0u03nMSh8u+IvUVxgJdcS1H4ne8saX4juorfL9f8AUtR+N3vU97MfDU0cqf6lv1WTuKM7qWxuqLfTXVjNeT8ly9peeho8b2KLEWHKq2SImsjPIVeZeY0cm11tuaV/sjNnCzKL3hP8PFdBebnR03e8FXIyP6qKdT9vW1KMY18s0i6IiJqqqSW54ExHSXuS2ttk75Ek2W7LVXXeXrk1lLT2BIrzfImzXFURY43b0i9K+k53Hwb1yvdnhEPsO0Ok+BhY/X0TFVVUcIj/AJceQ+V7bDTx36+U7VuT02oYnb+RRedfSXL+Y5tw6U1OltWqbVMU08nxnPz72dfqvXZ1mf8A3SCRXIxysTV2m5PSefMysOZrYlxFyjaKH4Pid+zYjkRNE9Gp6FB6ROjTarC0E9NYaSGpgbBM2JEexOCKbUADy53S2XOZOYmJ0fb7bTLbqRNim1XRzk1VdVXXn1On3NeVuZGA8w6Wuu1jp2WySN8U8rZmq5iKi6Lprrx0PV6g9evq3NzueXU07+/3upc5p6ehlmpaZ1TM1vkRtVEVy/meOc5MoM28eYxqb3NaafYkf+zZyyJst5kPaPBDBjRXNE6wzqpiqOLzXkhhbNLLu1T0jMPW96zaaq56uXd+Exm5hvO3MK3JZ1o6GCge5FkjjesSL17S70PS2qATcnXXREW4iNHmjKHuYaKzXamvuNqyK41MDkkioodeRa5OCuVfjaL+R6Va1GtRrURERNEROY+tAY1VTVOssopiI0gABCQAAAABjnUoq7f7su/jm+9C9edSirx/u07+Ob70LLZvzV+kqXbHy2/1QvGm+Sb1HKnA4qb5JvUcqcCtlcU8gABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6l0oaW5UE1FWRNlgmarXtcmqKh4g7oXKqrwRd33Gka6a11D1WN6N12V1+Kp7pOhfbRbr5a5rbc6WOppZm6PY9Nf/APKZUbm9E1xrDdws67iV71EvzBSdEeuvA546hqceBcOfuRd1wZUy3ixxS19icquVzG6vp/Q5Oj0lJpqjtFQ+j7L6NbO2nYi5a0dFb6QXedMtiyqZz6khwfS0l6ucVDNURwJIum1IuiIQ/enOfTFc1Uc1yovShZWug1iidaJ0lsXdvXrtG7MvUdB3N1NdKFlRFeINHN1RWP2kIFmHkFf8MRPq4a6krIERV0RdHJ+RDMJZlYuw1HyVtvlVDH9RXbTexTbXXOHF13iWG43R0zF3KisQ06sTbOyrmtFcVUR+Skt2q8i7xqhXs9FPDO+N7FRzV000OzTWyplX5PRPSbRa/vmd0rla5zl1U77Jk2UVNEKTa3TrNs60xRo7nZvRixd0qqr1dGjw9taLLJ+SG4orXQ066sharulyan1T1LVbomiqfEkz2u6EPmm0+leflzMVVzEO3wuj+HjxrFETLtPVqbtE09B1KtFa3aTgHVGvDicU1QxWOSRyJoc1T1+VXpzXdPVWKdeTpukVV4HXqqhkTdXu0OrdLrDCiti0VSLXCvlmcqK5dDtdjdEL+VMTXGkOT270vsYdE00TrLZXS7tTVkS7+kj9TVPlequXecLnLv1UsjJLJ/EmaN2RtFE+is8Lk76uMjF2Gp9Vn1nehPzPqGNsvC2Rj79ekad741tXbeTtGuZmeHg1mTmAMQZjYnjtNmhdyTHI6pqXfJws13qq9PoP0Wy1wXacC4Yp7Jao00Ymssyt0dK/ncpjLTAuH8vsNRWLD1KkMDfKkkdvkmfzucvOpKDitq7SnNufDGlMco/5U9MTEcWQAVbIAAAAAUVnR9PI/Ux+8uu2fN1P6tPcUnnQv+vY/VR+8uy2fN9P6tPcWmZ+Hteii2dP93f9YdkiGZ/zTT+t/Ql5D80fmmn9b+hoWfqQtcr6NTZYE34bpep39ym+TmI/gFf9N03U7+5SQJzGNz55Z2Pp0+jIAMHqAAAAAAAAAAAAAAAAAAAAAAAA+JPk3dRW2APpNP8Ajd71LKk+IvUVpgH6TT/jd7zbx4+Cv0V2ZP8AWt+qzU4AJwBqLF8cmzb29hu106bz7OpdK6C3UrqmpejY0VE1XpOhT4mtMzdpKljebeoG6Bqqq/W2mpe+ZJ28l0opzWa7UV2gfNRybbWO2XehQO+DoMu1vfVOpW1MaytXRW68+mp1X4it7avvdZEVedUcgG5BpanEdvhmSPlGvXXRdHHBNi60xScm+ZqL6XASEEdXGFoT/ntX/wAj7kxVbWORFeiqvQoG/Bp48RW17EXlmovRrvOl4Z2nbVm3vRekCSgjlPi+2TormOTROfaOxbsTW2tqEhjk0cvDVQN2DV3a+W+2vbHUy6PVEXROKIvOdd+KrHHDBNJXRsZUOVseq8VTiBvAaitxHZ6OSOOorI2ukZyjE14t6TNrxDa7lUchSVCSP013AbYAAAABgou8f7tL/HN96F6KUVeF/wCLS/xzfehZbN+av0lS7Zn4bf6oXlTfJN6jkTgcdN8k3qOROBWyuKeQAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwzwxzwvilY18b2q1zXJqiovFFQ84Z2dzXR3eSe9YGVlFWuRXSUD3aQyL0sX91fRwPSpjcbmDtHIwLnWWKtJ/z6sqapp5PzAxJYrzhu5vtt8ttTQ1Ua6LHMxU/NF4KnpQ17VXQ/S/GOD8N4tt7qLEFppq+JU0TlG+U38Lk3p+R53zB7lh23LVYLuzUaqqraOs5vQj/8n0/ZPTuxdiKMuN2rx7v/AA2KLsTzl5ZTVV4an2yPaJdivLTG2GJnNu+H6yFjV05VrNti9St1Qi6RyMfsuRUXXgu4663tDDyadaK4qhv2504xLDGvYvkuVFOxHcZoF0ciOQ4pE3Lom868jFcnA53amztnZETvxC0xdo5dmfgqbumucS6LrsqSGx0k16nZT0StllcumivRPeQWGnl4aHapoaqKVJI5XMcm/Vqqh8t2zsHZlEzNE8XYbP25tCqnSdHorC2S76mFJ7tcGUqLv0Ym0RjNDAOGbNTvSjv9RLUonxNGqn9CGUmKsQRUSUvwjVLHpw5VTtWLD2KMS1LW2u03Cte9dNpsaq383LuOVtXqMavSzQzrjIuVTcy7+lPhHCFdVlnqFe5GauTXd0qcFLha8Vs7aelpJJpnroxjE1c78kPVeCO5xu1bJHU4rq46OHisELtqRfQq8EL8wVgDC2EKdrLNa4o5ETfM9NqRfzXgdhh9IcmzTxiHC7avYE1aWZmqf4eVsl+5Xud1qIbtmC6S3UKaObb43ftZfQ5f3E9HE9h2CzWyw2qG12eihoqKBuzHDE3Za1DYcwNHO2lfzq967P7d0OYiNOTIANJIAAAAAAACiM6Pp7F6qP3l22z5up/Vp7ikc6Pp9F6qP3l3Wv5vp/VN9xaZn4e16KDZv4y/6w7XMQ3NP5pp/W/oTLmIZmp800/rf0NCx9SFtl/RqbHAH0bpv/L3qSEjuX/0bpup3vUkRF355Z4/0qfQXgRS7YnqaSskhZStVrV01VFJWcMtNBKur4mO60Ioqppn4o1TdoqqjSmdELdjWsRf/ax9imFxtWeaxf1Je620S8aaL2T5W1UC/wDSxeye8XbPlak4+R3XP4RNMbVnmkX9TsU2MZHL+1pWon/aqkj+CaDzaP2TKWuiThTx9hE3LU8qWVFnIieNf8NSzFdMvGJ6HMzE9Iv7j0/I2iUFInCBnYfSUlOnCFif+J5zVR4NiKbnfV/DVpiOkX91/sn14Q0fQ/2VNp3vD9mz2TPIRfZt7DHWnwZaV+P8NX4Q0fQ/2VMLiKjTmf7Jtu94vqN7DC00K/8ALb2DWnwNK/FqfCSj6H+yfbMQUa8z/ZNj3rD9kzsMpTwpwib2DWjwRpX4/wAOGjuNPVO2Y9rX0od0+GRsb8VqJ1IfZjOnc9I17wAEJAAB8yfEXqK0wF9JZvxu96llSfJu6itcBL/qSb8bvebmN8lforM2f61v1WanAwplOBhTTWcNBjq21V1sraSlTy1ma53oRNSA3TAV6SnZFBKm9V1VNyluSORkbnu4NRVUhyX+9VdS91JFBFTtXdttVVVOsCvbjh7FNLC2j73bURI1N6uXXcSrLKivVvo7gyppeSc+NVjTXcrtNx80+N7lU3xtC2GFrfK1ds9BwXLMO4UlasCQRK1F012eI1Tq1tThfFNPUTXGJGOleqOVqu3anZpKa8JFyL7VTrO5dVfquqGzqMW3xXUkkcMSRT6/uHDccc1VHIkclOzlFTXVGbgjRr6egvNPI5s9uieqpoi9B1J8I3utndUck1u/VGkipcZ1XeffVXDG1vNozep27Zii5V6tmgijZBrv2mcUDJAo8PX+GpTlKF2yjuY21dbLqtQ16UTdNU49RIrzjyKkuMdCyJj3ubq52m5q9BxXHE9yhuksLGQujZpp+z111QMeLU26w3Va+KWViIza1VOY7LsNVyNe5sKL5Kne8M55UWGGJGzN4rsbjp1eYFVQvSOaBsq7tdloOLU2i0XeOkkh7zVZGN4Hcw9brsl0jSShWNvO7eSnDeMqO7VTIY4tl7lROGimmvWYNTbsVLbu94+9mq5HO2NV3a/4MWT7xzbrtDdZ62Ggpq2GSBjGtl13KhBqjD+JrksEi26GCOF20yKPXRN5YkOLrpdmOqrVBElJGxXPWRuqrpxOhT45uVdPNFQwRawORr1cz4yr0ARmTDmKamrhmmo2uSODkWpqvDXX9Td4DtV9ocRQOmtvJw70e/XREQ2seP5omPWa3qqRP5KR7eCPTdp/QluFrpLeLctZJTLAiuVGovOnSToiZbcAEoAABheJRN4/3ZX+Ob70L2XiUTef92HfxzfehZbN51/plSbb+W3+qF5U3yTeo5UOKl+Rb1HKhWyuaOQAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADSYvxLZsKWZ93vlWlLSNe1m2rVXVy8ERE4qIiap0gbrrBVkefuWT13Xx7U102nU70T3E/w7frRiK3MuNlr4K2mfwfE7XTr6D0uWLlvjXTMfsiJiW1BBsb5p4KwbdGWu+3ZIatzUfyTGK5WovDXTgSuy3OivNrguVvmSalqG7Ub050MardVNMVTHCTV3eYcxCcZ5p4HwlUrSXe9Qtqmro6CLy3t60TgfGDM1MFYsr20Fnum3VPRVbHIxWq7To1M+ou7u/uzp46I3qddNeKc8w5iL42x7hPB0CSYgvNPSPVNWxKusjupqbzQYRzpy8xNc2W2gvbYqqRdI2VLFi5RehFXcqiMe7NO/FM6eOhNVMTprxWQYItjfHuGsHRU8l9uDadKhUSNEarlXVdNd3Mc02M7BHhZuJe/UdbnxLK2RqaqrU113fkYdVXpE6cJTrGujfTQxTRrHLGx7F4tcmqL+RFL5lnga9K51fhi2Pe7i9sCMd2od3CGM7Bimwuvdqq9qiZ8Z702dndrv8AyInec9st7bVd7reu+Xoui8hGrkT8z2tU5ETMW4nWPA62KOOujVXTuc8vqtyuhp6qk15opd39TUzdzHhNfkrrcY06NUUtvB+LbFiuiWpstY2drUTaaqaObr0ofeMsVWTCNqbc79Wd7UzpEja7ZVyq5ebRDKcjIqq3ZmdfDi2aMy7TxipTjO5iw2jtVvtwVPwNNxa+5zwPSqi1UtfVr0OkRqf0Q3EWe+WkkqR/D2yqrpq6FyISetx1haksS3yS7QOoEj5TlWLtJs6omu70qhhcs3p+emfZ7RtbK00i5P7NdZMp8v7S9r6fDNHJI3g+dqyL/wDrcTOlp6emiSKngjhYm5GxtRqJ+SESgzKwbNZJL0y6s7xilSF8itVNHKmqIbzDOIbRiSgWts9UlTAjtlXIipv/ADPKbU0c40aleRXenWurX99W34AiGI8xMJWC/wAVjulxWKulVEbGjFXfprxT0HRxHm5gTD8sMVzvHJPmiSViJE52rV4LuQypsXa9N2mZ1/J5TVTHOU+MKQDDmcGXuILlFbrdiCF1VMuzHHIxzNt3QmqcTu1uZWEKLENPY5ronftQj1ja1qq3yNdrf+S9gqsXaZ3ZpmJ9Dfp011TMEMvGZuCbPcKeguN7hp6ioSPk2ORd/KfF7Tv4xxrh3CVrjuV7r0gp5XbMao1XK5fQiGPV16xGnNOqR9Rk11jvFBerPT3agm5SkqGcpG9U01b0kTp83MAVOIorBT4gglr5peSYxrVVFdrpprwEUVTrpHI1TwHVudworZRSVtwq4aWnjTV8kr0a1PzUrisz5y6p6xaWO51FS5F02oadzmr1KTbs3LnyUzJMxHNaQU6NjulJeLVT3Kher6eoZtsVU0XTqO8YTGnCUqGzp+nzPVR+8u+1/N1P6tvuKPzp+n7PVRe8u+1fN1P6tvuLXN/D2vRz+zPxl/1h2iG5qfNNP61fcTIhuanzTT+t/Qr7P1IW2Z9Gr0bHL/6N03/l71JCR7AH0bpv/L3qSEi788ssb6VPoyADzbAAABXVNmjb5JKqN9FI1aeKaRVRddUjRyr27P8AUsVd6Hn/AAPb5UvN2dPTSOiZS1e2ro92yrX+/VAiU0y6zHuGJqiCWssrKKgq3pHSzJLqrn7LlVFT0I3+pr7nm5Xy3m4UeHML1N1p6CRY5qhmqpqmvRw4KVdl+lc3G9Fa8LTVDqeSeNZ2VEXkwrqu05uirwai793USzL3EtHgN+IrJiOjqYah9zkqWbEaeWi7kbqq8NE3L6VJIWflrjqjxlSTq2mko62mXSeB666elOw1OYmZq4cxDTYetFoddrnNuWLlUj0XRFRE14roqGgyIo7jXYpveK30q01vrNpsTVTTacr9d3SiJzmv7qDDcraOmxbaW1DbpTPasaxMV6K5FTjpw1TnToISkkGclojwPcsRXCilp57dWPoZqRrtpyzpqiNRfSqKn5HxhXN1K27fBeJLDNYqmRzWwJI/aR7lVNG8NyrqhXmJstbvbclquv1kqbjWXKG8VcKxqqs3uc5unHi9dT5vdTV5jY0oPBujmliguEFbNM5NUYxHM1RV5tN/YTGkmid4nzmdbcQXKhtuGp7hRWuVsVZVJLso1y6bk3Lz7vyNnjLN61WGwxXaC31NbHJLDFoio3ZdK3aRFXpRCqLjWOw+uPcO3GCVtZdbqySnVGfHZymvuXcbzGeDrnFkw9JqaR1VU3WmqljaxXLHGjEY1FROGiImvWESvqx16XOz0lwazk0qYmyI3XXTVNdDvGkwLG+LB1pjkarXNpI9UVNFTcbshIAAAAA+JvkndRWuAvpJN+N3vLKm+Sd1Fa4A34jm/G73m7jfTr9FXnfWt+qzU4GFMpwMKaS0h8ysSSNzHcHIqKRabDFxa9zKS9SwwOX5PYRSWACvYsv6mC6NrIrknBdrVm/ec0mXVLOqvqKpz5NdddkngAisWEmsgpou+1VIF3at4mvu+A4qytbKtSqMROGhOiru6Cvd2stipZrTUyQSK9drYVU1QJ1SKvwdST21lKxVarF116TV0+ErrSt5GmuL44uhChbTmRjC4VawJcpmbKarq5xI8MY3u1FiN891udRNC1F8jbXTh0ahK0Vy4bNLy89WrplXXaXibeDBr2qqy1ivcqcVTeU9asyL3LmTb3LU1LbY52zIx2qNXUvmqxFbqZ8TXue50vxdlupiidUXqsDzQzOlpq1WucvHQ6zcBSTS7dVUI/XpIzm1iy60uIeToqp8ULW7kRdCHOxzf5kRe/ZWq3dxXeZC5LBgVtrvza+GqVIkVP2eh075l3U3DEcletW3kHucuzz6Lru/qVph3GV/kxHSrU3KdYuUbqxHKiLvTcek2LtNR3SmoNUAo8D3GhgfT0F3lgheio5qcFReJwR5f1tCvK265ujlcusnk/GVOBZABqhseCYn2KWiqJ1dPNOlRJIifv7/APKkptlJHQ0MVLEnkRt0Q7ICAAAAABgoe8L/AMWHfxzfehfClD3f/dd/8cnvQstm86/SVHtv5bf6oXpS/IN6jlQ4qX5BvUcqFbK6o5AADIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg80d3XepIbHh6wR6qyeokq5U6Ujbst/vXsPTBUGeeTa5lXqguS36ag70p3QtjZGiouq6quqm3gXLdq/TXc5QwuUzVTpDyBfrdNR4IoqSrwZdqCWSqjlW41DXNjkRW6aI1U09J6byWvtnwDkT4RzuiVz2SVDo2rosrm6Na1PSayXuZrlVwQ01bj+5TU0T2vbFIqvamzw3KuhvcR9z5Fc8MWjD8GJ6uGkoUkSXaZ8rtORddE3btC5zs7HyaaaN7hrrPNr0Wq6JmqPB5XxbclxZV3fFd0u0Dbk+rY5lM5FVz2u11RvoYmnaej8jccT0fc3XKeB6rW2uGdI16F2l0X8tpCdeIfATsNR2iS2xrK2FGOqmt0kc/RU21Xp3mvysyVTCVtvdmr7o6uttxgdEjOCtVzuPXojew8MrOxr9qKYiY3Zjh+TKi1VTVr4qU7nDA+G8fXG9XLGLp62oikjcjFmVm2sirq5ypvXfoSfBFRlla8y6uLD2F6ptbbErHRzLXPVHci1V12F5naG0d3Nt3tdylnw3jWto2yO3bL1jVE5kXTiTPKHIy2YIuc94uFzlu1wnjcxznt0aiP+N6VVTzvZdqZqqiuZiYiIp4xEFNqYiI04+Kjcn7NQZr5l3G544rJahyRd8LEj9lHqqoiN14o1E5kNd3TuF8MYXxnZqDB8LoJ5Y9aiFkiu2Ho5NnTXgqovAte+9zU+G9vr8LYnq7c1yqrWo9WrGnRqm9UN/l/kBb7RfY7/ia8T3+4ROV8azIqta7TTXfvVUPec+1FzrYrnSI0inTgx6nWjd04681Fd1NcLhWVGGLU9Hy1EVpp3Obv1VyopDX48xNQYTfgathkbHDFJErHIqOYrl1/U9Z4nySp77mbT4rqLqvekHJNbSq3XyWJps69CqdHNbue7Ri67rd7XcX2uqkTSbydpruHA9LO08a3bot1Rrp/ljVYub0zE81MV12uOF8jrZYqd7oPhlkUkrm6ovJozen5roS7AWXOWdNlk/EeIY5bpWupHVL2tlc1GprojERu7XXpLfxRlDZL/gG3YbqZnx1Fvp44oaxieUitbov5KVdTdzZiBGLQrjaoZb1XRY9pyordeGym48ZzrVy1uxM0zrrOneyizMVazGvDT0TruZafB77Zc67DFjktj0kbFMr51k2+Kpx4EP7ua58lhu02xF1RZlncnVo1PeXHlXgS35f4ddaqKolqnSycrNPLxe7RE4cyIiEXzkydizIxDQ11Ze56Ojp4Ujkgiaiq5Udta6rw4IV9jIooyutnlEvWaKtzdeQqV2HqjCsNJBhqSW8LIu1VNrF3p6tOwlV7obvYsoI4LjDPTd+7TIWPaqao6Zi+5uv5nsLC2AMI4apYorXYqGORjUasywtWR2nOqrzkSzyyllzHltToLulujodrVnJ6o7XnQs6Ns0zciJjSnXWe+XlOPMUzpPF55xUnwPkdRUrlVr624I7Tn2UTTU9LZJNobTlpQqkjG6tV79+/Ui+ZuRTcU2i00FBe30baCPZXVmu27d5R0MN5G4ntbUiXHtyWFqbo2u8nsNfJv2Mi3ETVpOszPCWdu3NFWundorDMypfe89Gzs8tsc79PRsxkSzQuFJLj6GC4UbquCCngYsSP5NVajd6bXN1noyyZGd7Yj+Fq6+yz6o/XyU2l2k011PugyAsKZgzYlu1XJc6dWojKWZvkqqJomvoQ3bO08a1ER4U6Q8qrFVX7y81UVFSXXGtlXCmGpqBI6yFXo2pWo1XbRdrXTduNtbYa6fO2CkqI5Ekp2VjVRycFSST/ACe1rbYLLbIWxW61UVIxqIiJDA1unYhV2Gskorbj2qxPXXyarWXldhmwiL+0cqrr2mvG1qa97ejThpHfKZxuXq8r51yXC/5j1b7ZTzSrQoqNRiKqsZCiJr1JpqcF0x1iHGtPZ8O3dyypSatY5E3qr3ouq/luPV+AskKXD+Lbjea+5LcIquGaLknN00SRV1XsXQ1Fw7nW2Jj+DEVtuT6amSobI+nRu5rWtTcn569ptxtPE1iNOUcJ/Nj1FyYnjzanMPHqYKyioLBa50bcJYGs1b+5GiaOX8+B5qt0sVtxbbLpTV0Uz++2KujVRWeU1f1VPyPVkmQDbpi1Lhf7vLWUDUVEiVd+5dWp1HYxt3O+FrlSNdZGvoKlj9rVi6IqaLu7dDVsZmLZp3OMzPOfVlVauVcfB0O6Hp7ljnAFofZp1kjSNtQ+BrHLyyqmnFOjTn6Tz5h2vtmG520eLMCV86be0srq2Sm8npRuminpG6ZMX+ow7bLfSYvulM+lhWN7W1Gy3jrzIR639zXXV1zZPiPF9bVQN0RWK/bcqdGq8DDFyrNm1NuatY4+MSyuW6qqt6IXpl0trdgq1yWam72oHwI+GLb2tlF38eckR0bJbqWz2iltdG1W09NGkcaLx0RDvdJSVTrMy2YUJnV9PW+qj95eFq+bqf1bfcUjnV9Pmeqj95d1q+bqf1bfcWmd+Hteig2Z+NyPWHaIbmn81U/rf0JkQ/NH5qp1/wDt/Qr7P1IW+X9Gr0bDACf6apupfepIDQYCTTDVL1L71N+Y3Pnlnj/Sp9GQAYPYAAA+dhmipspovHdxPoAcENLTQOc6GCKNzvjKxiIqnzVUNHVqi1NLDMqcFexF0OyAPiNjY2IxjUa1E0RETREMvY1+m0iLouqH0AMK1FTRU4nxFDFEipFGxiLx2WompyADglpaaaVkstPFJIz4rnMRVTqU59AAMIiIiIiaInMZAAAAAAAOOb5F/wCFSt8v/pJP+N3vUsiZNYndRW+Xyf6kn/E43caf6dfoq8361r1WYnABOANJaAAAAAARnH2GG4ntzKflkiexVVqq3VFJMAKPhydrqad0kVZAiuTTXZPnxP3FZXSOrIXOVdddlS8gNRS/iuurUb/6qJdldU8k38GGsUxQtiSvj2WcNW66Fk6J0DQCnr7lxervVd8VVZE5+mmuwdFcobi92q1sCdbFLvAFMW3KK4wXOCrfcafZjka5yIxdVRFLmamjUToMgAAAAAAAAAAAMLwKGu/+67/49PehfK8Chbv/ALru/j096Fls3nX6So9tcrf6oXtSfIM6jlQ4aX5FpzIVsrqjkAAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUPnVp4es9VH7y7bT83U/q2+4pLOlNcfM9TF7y7bV83U/q2+4ts38Na9HPbMn++yI/OHaIhmhqlngVGq7SXXROolynFVUsFVHsTxte3oVCst1blUVLy/bm5bmmJ5q+wtjKloLRDSzUdSrma66InSbbw/oOagrOxP8AJvHYftarqtHF2GPB60+aR9hsTcsVTrNM+7Qps5lFO7FcezSeH1B5jWdif5Hh9QeY1fYn+TdeDtq80YY8HbV5qwb2N4SRbzvPHs03h9QeY1fYn+R4fUHmNX2J/k3Pg5a/NWDwctfmsfYN7H8JTuZvmj2aXw/ofMavsT/Jnw+ofMKzsT/JuvBy1+ax9g8HLX5rH2Dex/LPudXm+ePZpfD6g8wrOxP8jw+ofMKzsT/JuvB21+asHg7a/NWdg3sfwlHV53nj2aXw+ofMKz2U/wAjw+ofMKz2U/ybrwdtfmrOweD9r81Z2E72P5Z90dXneePZpPD+h8wq+xP8mfD+h8wrOxP8m68H7Z5pH2DwftnmkfYTvY3ln3ZRbzfPHs0vh9Q+YVnsp/keH1D931nsp/k3fg/a/NY+weD9r81j7CN7H8s+5uZvnj2aTw+oPMKzsT/I8PqDzCs7E/ybvwetnmkfYY8HbZ5qzsI3sfwk3M3zx7NL4fUHmFZ2J/keH1B5hWdif5N14O2zzVg8HbZ5qwjex/CU7mb5o9ml8PqDzCs7E/yY8P6Hmt9Z2N/ybvwdtnmrDHg5bPNWExVjd8SxmjO7q49mgnx9RrE5G0FUi6c+hq8t3Onv08yRua1dVTaTpJkmHLWi76Vi/kdyht9JRqq00DGKvFUQyqvWaaJptxPFhTi5Nd2mu7VExHhDvAA0luAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMLzlCXXfmw7+PT3oX2vOUNcd+bK/x6e9C02Zzr/TKj2zOkW/1QvWl+Rb1HIhx06aRNORCrldU8mQAGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKJztjkbjdkyRvc1II13J0KpLbdmNRwUUUbqKpcrWoi+STyst9FWKnfVPFKqcNpup03Ybsy/9BB7JYzmW7lqi3cp+X81HTsy9ayK79q5pvd0wi65m0fNbarsMLmXS/d1T2Eo8GLP5jD2DwYs/mMXYeW/jeWfd79TneePZF/GXTfd9R2GPGXS/d9T2Ep8GLP5jF2DwYs/mMXYTFeN5Z909VneePZFvGXT/AHfUdhnxlU33dU9hJ/Biz+Yxdg8F7P5lETv43ln3Y9Tn+ePZGEzLp/u6o7B4y6f7tqewk/gzZ/Moh4MWfzGMjfxvLPunqs7zx7Ix4yqf7uqOweMum+7qnsJP4MWfzGMeC9m8yjI3sbyz7nVZ3nj2Rjxl033dU9g8ZdN93VPYSfwXs3mUY8F7P5lETv43ln3R1Wf549kY8ZdN93VPYPGXTfd1R2En8GLP5lEPBiz+ZRE7+N4SdVn+ePZGfGVTfd1T2GPGXTfd1T2En8F7N5lEPBez+ZRdg38Xyz7p6rP88eyMeMum+7qnsM+Mqm+7qnsJN4MWfzGLsM+DFn8yi7Bv4vln3T1Wd549kY8ZdJ931PYZ8ZVH5hU+ySbwZs/mUXYPBm0eZRdhjNeN3Uz7sotZnfXHsjPjKpPMKn2R4yaXzCp9kk/g1aPMouweDVo8yi7CN7H8s+51WZ549kX8ZNN5jUeyZ8Y9Kqf+zqPYJP4NWjzKLsHg3afMouwb+P5Z909Vl+ePZF/GNTL/ANLUJ/4Hx4xoNf8A21Qn/gSvwbtPmcXYPBu0eZx9g6yz5UTZyvPHsii5jU/m9R7BjxjQeb1HsEr8GrP5lF2DwatHmUfYT1tnyk2Mrz/wii5jQeb1HsDxj0/m9T7BKvBmzeZRdg8F7P5lF2ExdseVjNjM7q49kU8Y0Hm9T7A8Y8H2FT7BK1wvZ/Mouwx4LWbzKPsJ63G8sseozPuR7Ir4x4PsKj2DHjHh83qPYJX4L2XzOPsHgvZfM4+wjrcfyydRm+ePZFPGPD5vU+wg8Y8P2FT7CEr8FrN5lH2DwWs3mUY63G8snUZvnj2RPxjw/YVPsIPGPB9hVewhK/BWzeZRjwVs/mUQ6zG8snUZvnj2RTxjwfYVXsIPGPB9hVewhK/Baz+ZRmfBazeZRk9bjeWTqM3zx7Ip4x4fN6n2DKZjweb1HsEq8F7N5lH2GfBezeYxdg63G8snUZvnj2RXxjwebVHsDxkQea1HsEq8F7N5jF2DwXs3mMXYR1uN5ZT1Gb549kV8ZEHmtR7BnxkQeaVHsEp8GLN5jF2DwZs/mMXYOsxvLJ1Gb549kWTMmDzSf2T68ZFN5nP7JJ/Biz+Yxdg8GbN5lF2ETcseVMWczvrj2RjxlU6f9DUL/wCJhczKdP8A46o7CU+DFn8xi7DHgxZ/MYuwjrMfylVnN7q49kWdmZRbOq0NU3/xK/t9U26Zk09XEyVElq2u0c3hvLrTDdnT/oIew7FNZ7ZTPSSGigY9ODkYmqHtazLVmKtynjMac2vd2fk5E0TdrjSmdeTvxJpGiH0AVy8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==" class="print-logo-img" alt="Bagong Pilipinas / ISO" />
        </div>
      </div>

      <!-- Summary cards -->
      <div class="print-summary">
        <div class="print-sum-box psb-total">
          <div class="psb-num">{{ printTrips.length }}</div>
          <div class="psb-lbl">Total Trips</div>
        </div>
        <div class="print-sum-box psb-completed">
          <div class="psb-num">{{ printTrips.filter(t=>normalizeStatus(t.rawStatus)==='completed').length }}</div>
          <div class="psb-lbl">Completed</div>
        </div>
        <div class="print-sum-box psb-pending">
          <div class="psb-num">{{ printTrips.filter(t=>normalizeStatus(t.rawStatus)==='pending').length }}</div>
          <div class="psb-lbl">Pending</div>
        </div>
        <div class="print-sum-box psb-cancelled">
          <div class="psb-num">{{ printTrips.filter(t=>normalizeStatus(t.rawStatus)==='cancelled').length }}</div>
          <div class="psb-lbl">Cancelled</div>
        </div>
        <div class="print-sum-box psb-disapproved">
          <div class="psb-num">{{ printTrips.filter(t=>normalizeStatus(t.rawStatus)==='disapproved').length }}</div>
          <div class="psb-lbl">Disapproved</div>
        </div>
        <div class="print-sum-box psb-days">
          <div class="psb-num">{{ new Set(printTrips.map(t=>t.date)).size }}</div>
          <div class="psb-lbl">Days Active</div>
        </div>
      </div>

      <!-- Table -->
      <table class="print-table">
        <thead>
          <tr>
            <th class="col-no">#</th>
            <th class="col-ticket">Trip Ticket</th>
            <th class="col-date">Date</th>
            <th class="col-time">Time</th>
            <th class="col-vehicle">Vehicle</th>
            <th class="col-dest">Destination</th>
            <th class="col-purpose">Purpose</th>
            <th class="col-office">Office</th>
            <th class="col-type">Type</th>
            <th class="col-status">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, i) in printTrips" :key="i" :class="i % 2 === 0 ? 'row-even' : 'row-odd'">
            <td class="col-no td-center">{{ i + 1 }}</td>
            <td class="col-ticket">{{ t.tripTicket || '—' }}</td>
            <td class="col-date td-nowrap">{{ t.date }}</td>
            <td class="col-time td-nowrap td-center">{{ t.time || '—' }}</td>
            <td class="col-vehicle"><strong>{{ t.vehicle }}</strong></td>
            <td class="col-dest">{{ t.destination || '—' }}</td>
            <td class="col-purpose">{{ t.purpose || '—' }}</td>
            <td class="col-office">{{ t.office || '—' }}</td>
            <td class="col-type td-center">
              <span :class="t.isReservation ? 'type-res' : 'type-pre'">
                {{ t.isReservation ? 'Reservation' : 'Pre-booking' }}
              </span>
            </td>
            <td class="col-status td-center">
              <span class="status-badge" :class="'badge-'+normalizeStatus(t.rawStatus)">
                {{ statusLabel(t.rawStatus) }}
              </span>
            </td>
          </tr>
          <tr v-if="printTrips.length === 0">
            <td colspan="10" class="td-empty">No records found for this period.</td>
          </tr>
        </tbody>
      </table>

      <!-- Legend -->
      <div class="print-legend">
        <span class="legend-item"><span class="legend-dot dot-completed"></span> Completed</span>
        <span class="legend-item"><span class="legend-dot dot-pending"></span> Pending</span>
        <span class="legend-item"><span class="legend-dot dot-cancelled"></span> Cancelled</span>
        <span class="legend-item"><span class="legend-dot dot-disapproved"></span> Disapproved</span>
        <span class="legend-item"><span class="legend-type type-res">Reservation</span> — Service vehicle</span>
        <span class="legend-item"><span class="legend-type type-pre">Pre-booking</span> — Pre-booked vehicle</span>
      </div>

      <!-- Signatures with space to sign -->
      <div class="print-signatures">
        <div class="sig-block">
          <div class="sig-space"></div>
          <div class="sig-line"></div>
          <div class="sig-name">Prepared by</div>
          <div class="sig-title">Records Officer</div>
        </div>
        <div class="sig-block">
          <div class="sig-space"></div>
          <div class="sig-line"></div>
          <div class="sig-name">Verified by</div>
          <div class="sig-title">GSO Staff</div>
        </div>
        <div class="sig-block">
          <div class="sig-space"></div>
          <div class="sig-line"></div>
          <div class="sig-name">Noted by</div>
          <div class="sig-title">GSO Director</div>
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
  if (s.includes('disapprov')) return 'disapproved'
  if (s.includes('cancel') || s === 'cancel') return 'cancelled'
  if (s.includes('complet') || s.includes('reimburse') || s.includes('cash advance')
    || s.includes('liquidat') || s.includes('reimburs')) return 'completed'
  return 'pending'
}
function statusBg(raw) {
  const s = normalizeStatus(raw)
  if (s === 'completed')   return '#dcfce7'
  if (s === 'cancelled')   return '#fee2e2'
  if (s === 'disapproved') return '#fdf2f8'
  return '#fef9c3'
}
function statusColor(raw) {
  const s = normalizeStatus(raw)
  if (s === 'completed')   return '#15803d'
  if (s === 'cancelled')   return '#b91c1c'
  if (s === 'disapproved') return '#be185d'
  return '#a16207'
}
function statusLabel(raw) {
  const s = normalizeStatus(raw)
  if (s === 'completed')   return 'Completed'
  if (s === 'cancelled')   return 'Cancelled'
  if (s === 'disapproved') return 'Disapproved'
  return 'Pending'
}

// Chip styling: status sets bg/text color, vehicle type sets left border
function tripChipStyle(trip) {
  const s = normalizeStatus(trip.rawStatus)
  let bg, color, borderColor
  if (s === 'completed')      { bg = '#f0fdf4'; color = '#166534'; borderColor = '#86efac' }
  else if (s === 'cancelled') { bg = '#fef2f2'; color = '#991b1b'; borderColor = '#fca5a5' }
  else if (s === 'disapproved') { bg = '#fdf2f8'; color = '#be185d'; borderColor = '#f9a8d4' }
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
    disapproved:   trips.filter(t => normalizeStatus(t.rawStatus) === 'disapproved').length,
    daysWorked:    new Set(trips.map(t => t.day)).size,
    driversActive: new Set(trips.filter(t => t.driver !== 'Unassigned').map(t => t.driver)).size,
  }
})

// Modal
function openModal(trip) { modalTrip.value = trip }
function closeModal()    { modalTrip.value = null }

// ── PRINT REPORT ────────────────────────────────
const printDriver    = ref('')
const printPeriod    = ref('monthly')
const printMonth     = ref(today.getMonth())
const printYear      = ref(today.getFullYear())
const printWeekStart = ref(today.toISOString().slice(0, 10))
const printDate      = ref(today.toISOString().slice(0, 10))

const printPeriodLabel = computed(() => {
  if (printPeriod.value === 'monthly') return `${monthNames[printMonth.value]} ${printYear.value}`
  if (printPeriod.value === 'weekly') {
    const start = new Date(printWeekStart.value)
    const end   = new Date(start); end.setDate(end.getDate() + 6)
    return `Week of ${start.toLocaleDateString('en-PH', { month:'short', day:'numeric' })} – ${end.toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' })}`
  }
  return new Date(printDate.value).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' })
})

const printTrips = computed(() => {
  if (!printDriver.value) return []
  return allTrips.value.filter(t => {
    if (t.driver !== printDriver.value) return false
    const d = new Date(t.date)
    if (printPeriod.value === 'monthly') {
      return t.month === printMonth.value && t.year === printYear.value
    }
    if (printPeriod.value === 'weekly') {
      const start = new Date(printWeekStart.value)
      const end   = new Date(start); end.setDate(end.getDate() + 6)
      return d >= start && d <= end
    }
    if (printPeriod.value === 'daily') {
      return t.date === printDate.value
    }
    return false
  }).sort((a, b) => new Date(a.date) - new Date(b.date) || (a.time || '').localeCompare(b.time || ''))
})

function printReport() {
  window.print()
}
</script>

<style>
/* ── Screen: hide print area ── */
.print-only { display: none; }

/* ══════════════════════════════════════════
   PRINT STYLES
══════════════════════════════════════════ */
@media print {
  .no-print { display: none !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .print-only {
    display: block !important;
    font-family: 'Arial', sans-serif;
    color: #1a1a1a;
    background: #fff;
    padding: 0;
    margin: 0;
  }

  /* ── Header ── */
   .pow-letterhead { display: flex !important; align-items: center; justify-content: space-between; padding-bottom: 3pt; border-bottom: 1.5pt solid #2d6127; margin-bottom: 3pt; }
  .pow-logo { height: 36pt; width: auto; object-fit: contain; }
  .pow-lh-center { flex: 1; text-align: center; }
  .pow-lh-republic { font-size: 7pt; color: #555; }
  .pow-lh-university { font-size: 11pt; font-weight: 700; color: #1a3d18; text-transform: uppercase; }
  .pow-lh-office { font-size: 8pt; color: #2d6127; font-weight: 600; }
  .pow-lh-address { font-size: 6.5pt; color: #666; }

  .print-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    padding: 10px 16px 10px;
    background: #fff;
    border-bottom: 2.5px solid #1a4a15;
    margin-bottom: 14px;
  }
  .print-header-left  { text-align: left; }
  .print-header-right { text-align: right; }
  .print-logo-img {
    height: 70pt;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    display: block;
  }
  .print-header-left  .print-logo-img { margin-right: auto; }
  .print-header-right .print-logo-img { margin-left: auto; }
  .print-header-center { text-align: center; }
  .print-doc-title {
    font-size: 16px;
    font-weight: 900;
    color: #1a4a15;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  .print-doc-sub {
    font-size: 10px;
    color: #6b7280;
    margin-top: 3px;
    font-style: italic;
  }
  .print-doc-meta {
    font-size: 9px;
    color: #374151;
    margin-top: 5px;
  }

  /* ── Summary boxes ── */
  .print-summary {
    display: flex;
    gap: 8px;
    margin: 0 20px 14px;
    flex-wrap: nowrap;
  }
  .print-sum-box {
    flex: 1;
    border-radius: 6px;
    padding: 8px 10px;
    text-align: center;
    border-top: 3px solid transparent;
  }
  .psb-total       { background: #f0fdf4; border-top-color: #1a4a15; }
  .psb-completed   { background: #dcfce7; border-top-color: #16a34a; }
  .psb-pending     { background: #fef9c3; border-top-color: #ca8a04; }
  .psb-cancelled   { background: #fee2e2; border-top-color: #dc2626; }
  .psb-disapproved { background: #fdf2f8; border-top-color: #db2777; }
  .psb-days        { background: #ede9fe; border-top-color: #7c3aed; }

  .psb-num {
    font-size: 20px;
    font-weight: 900;
    color: #111827;
    line-height: 1;
  }
  .psb-lbl {
    font-size: 8px;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-top: 3px;
  }

  /* ── Table ── */
  .print-table {
    width: calc(100% - 40px);
    margin: 0 20px;
    border-collapse: collapse;
    font-size: 9.5px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
  }

  .print-table thead tr {
    background: #1a4a15;
  }
  .print-table th {
    color: #fff;
    padding: 7px 8px;
    text-align: left;
    font-weight: 700;
    font-size: 8.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-right: 1px solid rgba(255,255,255,0.15);
  }
  .print-table th:last-child { border-right: none; }

  /* Sub-header row for column grouping feel */
  .print-table tbody tr.row-even td { background: #fff; }
  .print-table tbody tr.row-odd  td { background: #f6fef7; }

  .print-table td {
    padding: 6px 8px;
    border-bottom: 1px solid #e5e7eb;
    border-right: 1px solid #f3f4f6;
    vertical-align: middle;
    line-height: 1.4;
  }
  .print-table td:last-child { border-right: none; }

  /* Column widths */
  .col-no      { width: 22px; }
  .col-ticket  { width: 65px; }
  .col-date    { width: 68px; }
  .col-time    { width: 44px; }
  .col-vehicle { width: 85px; }
  .col-dest    { width: 100px; }
  .col-purpose { min-width: 130px; word-break: break-word; }
  .col-office  { width: 95px; }
  .col-type    { width: 68px; }
  .col-status  { width: 68px; }

  .td-center  { text-align: center; }
  .td-nowrap  { white-space: nowrap; }
  .td-empty   { text-align: center; color: #9ca3af; padding: 20px; font-style: italic; }

  /* Status badges */
  .status-badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 20px;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.3px;
  }
  .badge-completed   { background: #dcfce7; color: #15803d; }
  .badge-pending     { background: #fef9c3; color: #a16207; }
  .badge-cancelled   { background: #fee2e2; color: #b91c1c; }
  .badge-disapproved { background: #fdf2f8; color: #be185d; }

  /* Type badges */
  .type-res {
    display: inline-block;
    font-size: 8px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    background: #e0e7ff;
    color: #3730a3;
  }
  .type-pre {
    display: inline-block;
    font-size: 8px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    background: #ede9fe;
    color: #6d28d9;
  }

  /* ── Legend ── */
  .print-legend {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin: 10px 20px 0;
    font-size: 8px;
    color: #6b7280;
    align-items: center;
  }
  .legend-item { display: flex; align-items: center; gap: 4px; }
  .legend-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 2px;
  }
  .dot-completed   { background: #16a34a; }
  .dot-pending     { background: #ca8a04; }
  .dot-cancelled   { background: #dc2626; }
  .dot-disapproved { background: #db2777; }
  .legend-type { font-size: 8px; font-weight: 700; padding: 1px 5px; border-radius: 3px; }

  /* ── Signatures ── */
  .print-signatures {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin: 24px 20px 20px;
  }
  .sig-block { text-align: center; }
  .sig-space {
    height: 55px; /* room to write signature */
  }
  .sig-line {
    height: 1px;
    background: #374151;
    margin-bottom: 5px;
  }
  .sig-name  { font-size: 9px; font-weight: 700; color: #111827; }
  .sig-title { font-size: 8px; color: #6b7280; margin-top: 1px; }

  @page { margin: 10mm; size: A4 landscape; }
}
</style>