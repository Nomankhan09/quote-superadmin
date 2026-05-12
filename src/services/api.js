import axios from 'axios'

export const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('sa_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sa_token')
      localStorage.removeItem('sa_admin')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── SUPER ADMIN AUTH ──────────────────────────────────────
export const superAdminLogin = (data) => api.post('/superadmin/login', data)
export const superAdminMe    = ()     => api.get('/superadmin/me')

// ── TENANTS ───────────────────────────────────────────────
export const getTenants      = ()          => api.get('/superadmin/tenants')
export const getTenant       = (id)        => api.get(`/superadmin/tenants/${id}`)
export const createTenant    = (data)      => api.post('/superadmin/tenants', data)
export const suspendTenant   = (id)        => api.post(`/superadmin/tenants/${id}/suspend`)
export const activateTenant  = (id)        => api.post(`/superadmin/tenants/${id}/activate`)
export const deleteTenant    = (id)        => api.delete(`/superadmin/tenants/${id}`)

// ── PLANS ─────────────────────────────────────────────────
export const getPlans   = ()         => api.get('/superadmin/plans')
export const createPlan = (data)     => api.post('/superadmin/plans', data)
export const updatePlan = (id, data) => api.put(`/superadmin/plans/${id}`, data)
export const deletePlan = (id)       => api.delete(`/superadmin/plans/${id}`)

// ── TENANT USER MANAGEMENT ────────────────────────────────
export const getTenantUsers  = (tenantId)        => api.get(`/superadmin/tenants/${tenantId}/users`)
export const createTenantUser= (tenantId, data)  => api.post(`/superadmin/tenants/${tenantId}/users`, data)
export const updateTenantUser= (tenantId, userId, data) => api.put(`/superadmin/tenants/${tenantId}/users/${userId}`, data)
export const deleteTenantUser= (tenantId, userId)=> api.delete(`/superadmin/tenants/${tenantId}/users/${userId}`)

export default api
