
## **🔄 Complete User Journeys:**

### **Journey 1: Brand New User (Never Applied)**
```
1. User clicks "Become CP" → /cp/apply
2. Not logged in → Can fill form OR redirected to /login (your choice)
3. Fills application → Submits
4. Backend creates CPApplication, user.is_cp = true, cp_status = 'pending'
5. User logs in
6. AuthContext checks: is_cp = true, cp_status = 'pending'
7. Tries to access /cp/dashboard → Redirected to /cp/application-status
8. Sees "Application Under Review" message
```

### **Journey 2: User with Pending Application**
```
1. User logs in
2. AuthContext checks: is_cp = true, cp_status = 'pending'
3. navigateByRole() → Redirects to /cp/application-status
4. Sees application status
5. Tries to visit /cp/dashboard → Redirected back to /cp/application-status
6. Waits for admin approval
```

### **Journey 3: Newly Approved CP**
```
1. Admin approves application
2. Backend updates: cp_status = 'approved', is_active_cp = true
3. CP receives notification
4. CP logs in
5. AuthContext checks: is_cp = true, cp_status = 'approved'
6. navigateByRole() → Redirects to /cp/dashboard
7. Full access to all CP features
8. Visits /cp/application-status → Auto-redirected to /cp/dashboard
```

### **Journey 4: Rejected Application**
```
1. Admin rejects application
2. Backend updates: cp_status = 'rejected'
3. User logs in
4. Redirected to /cp/application-status
5. Sees "Application Rejected" with reason
6. Can click "Reapply" → Goes to /cp/apply
7. Can submit new application