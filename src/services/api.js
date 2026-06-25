import axios from 'axios'

export const API_URL = 'http://localhost:8000/api'
// export const API_URL = 'https://crmapp.flairm.com/quotepro/public/api'

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
    const isLoginRequest =
      err.config?.url?.includes('/superadmin/login');

    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('sa_token');
      localStorage.removeItem('sa_admin');
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
)

// ── SUPER ADMIN AUTH ──────────────────────────────────────
export const superAdminLogin = (data) => api.post('/superadmin/login', data)
export const superAdminMe = () => api.get('/superadmin/me')

// ── TENANTS ───────────────────────────────────────────────
export const getTenants = () => api.get('/superadmin/tenants')
export const getTenant = (id) => api.get(`/superadmin/tenants/${id}`)
export const createTenant = (data) => api.post('/superadmin/tenants', data)
export const suspendTenant = (id) => api.post(`/superadmin/tenants/${id}/suspend`)
export const activateTenant = (id) => api.post(`/superadmin/tenants/${id}/activate`)
export const deleteTenant = (id) => api.delete(`/superadmin/tenants/${id}`)

// ── PLANS ─────────────────────────────────────────────────
export const getPlans = () => api.get('/superadmin/plans')
export const createPlan = (data) => api.post('/superadmin/plans', data)
export const updatePlan = (id, data) => api.put(`/superadmin/plans/${id}`, data)
export const deletePlan = (id) => api.delete(`/superadmin/plans/${id}`)

// ── TENANT USER MANAGEMENT ────────────────────────────────
export const getTenantUsers = (tenantId) => api.get(`/superadmin/tenants/${tenantId}/users`)
export const createTenantUser = (tenantId, data) => api.post(`/superadmin/tenants/${tenantId}/users`, data)
export const updateTenantUser = (tenantId, userId, data) => api.put(`/superadmin/tenants/${tenantId}/users/${userId}`, data)
export const deleteTenantUser = (tenantId, userId) => api.delete(`/superadmin/tenants/${tenantId}/users/${userId}`)

// -- All APPS MAANAGEMENT
export const createApp = (data) => api.post('/superadmin/apps', data);
export const getApps = () => api.get('/superadmin/apps');
export const updateApp = (id, data) => api.put(`/superadmin/apps/${id}`, data);
export const deleteApp = (id) => api.delete(`/superadmin/apps/${id}`);
export const activateApp = (id) => api.patch(`/superadmin/apps/${id}/activate`);
export const deactivateApp = (id) => api.patch(`/superadmin/apps/${id}/deactivate`);

//  USERS
export const getUsers = () => api.get('/superadmin/users');
export const activateUser = (id) => api.patch(`/superadmin/users/${id}/activate`);
export const deactivateUser = (id) => api.patch(`/superadmin/users/${id}/deactivate`);

// activities
export const getAccessRequests = () => api.get(`/superadmin/accounts/access-requests`)

// -- FILE UPLOAD
export const uploadFile = (data) => api.post("/superadmin/files/upload", data,
  {
    headers: {
      "Content-Type":
        "multipart/form-data"
    }
  }
)

export default api
