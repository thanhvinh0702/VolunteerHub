# 🚨 URGENT FIX - Web Push API Errors

## Lỗi hiện tại

```
GET http://localhost:8080/v1/notifications?pageNum=0&pageSize=10 404 (Not Found)
GET http://localhost:8080/v1/notifications/web-push/public-key 401 (Unauthorized)
```

## Nguyên nhân

1. **404 Error**: URL thiếu `/api` prefix → Đang gọi `/v1/...` thay vì `/api/v1/...`
2. **401 Error**: Security filter đang block public-key endpoint

## ✅ Đã sửa

### 1. SecurityConfig.java - Disable HTTP Basic và Form Login

```java
.httpBasic(AbstractHttpConfigurer::disable)
.formLogin(AbstractHttpConfigurer::disable)
```

Vấn đề: Spring Security đang yêu cầu Bearer token authentication (thấy `www-authenticate: Bearer` trong response headers). Cần disable các authentication mechanisms mặc định.

### 2. Custom Filter - Đơn giản hóa logic

Filter chỉ set authentication khi có headers, không block request:

```java
if (role != null && !role.isBlank() && userId != null && !userId.isBlank()) {
    // Set authentication
}
// Luôn cho request đi tiếp
filterChain.doFilter(request, response);
```

### 3. Frontend Environment Variable

Code đã đúng, nhưng cần **TẠO FILE `.env.local`**

## 🔧 HÀNH ĐỘNG CẦN LÀM NGAY

### Bước 1: Tạo file `.env.local` trong thư mục Frontend

```bash
cd Frontend
```

Tạo file `.env.local` với nội dung:

```properties
VITE_API_URL=http://localhost:8080/api
VITE_API_LOGIN=http://localhost:7070/api
```

**Trên Windows:**

```powershell
# Dùng notepad
notepad .env.local

# Hoặc dùng echo
echo VITE_API_URL=http://localhost:8080/api > .env.local
echo VITE_API_LOGIN=http://localhost:7070/api >> .env.local
```

**Trên Mac/Linux:**

```bash
cat > .env.local << EOF
VITE_API_URL=http://localhost:8080/api
VITE_API_LOGIN=http://localhost:7070/api
EOF
```

### Bước 2: Restart NotificationService

```bash
cd NotificationService
./mvnw spring-boot:run
```

Hoặc nếu đang chạy, stop và start lại để load SecurityConfig mới.

### Bước 3: Restart Frontend Dev Server

```bash
cd Frontend
npm run dev
```

**QUAN TRỌNG**: Phải restart sau khi tạo `.env.local`!

### Bước 4: Clear Browser Cache

1. Mở DevTools (F12)
2. Right-click vào Refresh button
3. Chọn "Empty Cache and Hard Reload"

## ✅ Kiểm tra đã fix chưa

### Test 1: Check Environment Variable

Mở browser console:

```javascript
console.log(import.meta.env.VITE_API_URL);
// Phải output: http://localhost:8080/api
```

### Test 2: Check API Call

Trong Network tab, khi load Settings page, phải thấy:

```
✅ GET http://localhost:8080/api/v1/notifications?pageNum=0&pageSize=10
✅ GET http://localhost:8080/api/v1/notifications/web-push/public-key
```

### Test 3: Click "Enable Browser Notifications"

Phải thấy:

1. Browser permission prompt
2. Console log: "Public key received: ..."
3. Console log: "Service Worker registered successfully"
4. Alert: "Đã bật thông báo thành công!"

## 🐛 Nếu vẫn lỗi

### Lỗi: "VITE_API_URL is undefined"

→ Chưa tạo file `.env.local` hoặc chưa restart dev server

### Lỗi: Vẫn 404

→ Check file `.env.local` có đúng format không:

```properties
VITE_API_URL=http://localhost:8080/api
```

(Không có dấu cách, không có quotes)

### Lỗi: Vẫn 401 Unauthorized

→ NotificationService chưa restart sau khi sửa SecurityConfig

### Lỗi: "Failed to fetch public key"

→ Check VAPID keys đã được set trong NotificationService/.env chưa

## 📋 Checklist

- [ ] Tạo file `Frontend/.env.local` với VITE_API_URL
- [ ] Restart NotificationService
- [ ] Restart Frontend dev server
- [ ] Clear browser cache
- [ ] Test lại trong browser
- [ ] Generate VAPID keys (nếu chưa có)
- [ ] Set VAPID keys trong NotificationService/.env

## 🎯 Expected Result

Sau khi làm đúng các bước trên:

- ✅ No 404 errors
- ✅ No 401 errors on public-key endpoint
- ✅ Notification button works
- ✅ Can enable push notifications

## 📞 Quick Commands

```bash
# Terminal 1 - Backend
cd NotificationService
./mvnw spring-boot:run

# Terminal 2 - Frontend (sau khi tạo .env.local)
cd Frontend
npm run dev

# Terminal 3 - Generate VAPID keys (nếu chưa có)
cd NotificationService
node generate-vapid-keys.js
```

---

**TÓM TẮT**: Tạo file `Frontend/.env.local`, restart cả backend và frontend, clear cache, test lại!
