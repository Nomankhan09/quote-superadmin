# Flairm — Super Admin Portal

React + Tailwind CSS + shadcn-style UI

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:5173
```

## ⚙️ API URL Config

Edit `src/services/api.js`:

```js
// Local:
export const API_URL = 'http://localhost:8000/api'

// Production:
export const API_URL = 'https://crmapp.flairm.com/api'
```

## 📦 Build for Production

```bash
npm run build
# Output in /dist folder — upload to server
```
 
## 📋 Features

### Dashboard
- Stats: Total, Active, Trial, Suspended tenants
- Bar chart: Tenants by Plan
- Status breakdown bar
- Recent tenants table

### Tenants
- Search & filter by status
- Add new tenant (creates DB automatically)
- View tenant details
- Manage users per tenant (add/edit/delete)
- Suspend / Activate tenants
- Delete tenant + database

### Plans
- View all plans as cards
- Create / Edit / Delete plans
- Shows max users, quotations

## 🛠️ Backend — User Management API

Add these routes to `routes/api.php`:

```php
// Inside superadmin middleware group:
Route::get('/tenants/{tenant}/users', [TenantController::class, 'getUsers']);
Route::post('/tenants/{tenant}/users', [TenantController::class, 'createUser']);
Route::put('/tenants/{tenant}/users/{userId}', [TenantController::class, 'updateUser']);
Route::delete('/tenants/{tenant}/users/{userId}', [TenantController::class, 'deleteUser']);
```

Add these methods to `TenantController.php`:

```php
public function getUsers(Tenant $tenant)
{
    $this->manager->connect($tenant);
    $users = User::on('tenant')->get();
    return response()->json(['users' => $users]);
}

public function createUser(Request $request, Tenant $tenant)
{
    $request->validate([
        'first_name' => 'required|string',
        'email'      => 'required|email',
        'password'   => 'required|min:8',
    ]);
    $this->manager->connect($tenant);
    $user = User::on('tenant')->create([
        'first_name' => $request->first_name,
        'last_name'  => $request->last_name ?? '',
        'email'      => $request->email,
        'phone'      => $request->phone,
        'password'   => bcrypt($request->password),
    ]);
    return response()->json(['user' => $user], 201);
}

public function updateUser(Request $request, Tenant $tenant, $userId)
{
    $this->manager->connect($tenant);
    $user = User::on('tenant')->findOrFail($userId);
    $data = $request->only(['first_name','last_name','email','phone']);
    if ($request->password) $data['password'] = bcrypt($request->password);
    $user->update($data);
    return response()->json(['user' => $user]);
}

public function deleteUser(Tenant $tenant, $userId)
{
    $this->manager->connect($tenant);
    User::on('tenant')->findOrFail($userId)->delete();
    return response()->json(['message' => 'User deleted']);
}
```
