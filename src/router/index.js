import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import ReservationAllFiles from '../views/reservation/AllFiles.vue'
import ReservationCreate from '../views/reservation/CreateRecord.vue'
import DriverRecord from '../views/reservation/DriverRecord.vue'
import FuelAllFiles from '../views/fuel/AllFiles.vue'
import FuelCreate from '../views/fuel/CreateRecord.vue'

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/reservation/all', component: ReservationAllFiles, name: 'reservation-all' },
  { path: '/reservation/create', component: ReservationCreate, name: 'reservation-create' },
  { path: '/reservation/drivers', component: DriverRecord, name: 'reservation-drivers' },
  { path: '/fuel/all', component: FuelAllFiles, name: 'fuel-all' },
  { path: '/fuel/create', component: FuelCreate, name: 'fuel-create' },
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})