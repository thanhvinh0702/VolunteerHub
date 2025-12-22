# 🚨 CRITICAL FIX - API Gateway Blocking Public Key Endpoint

## Vấn đề phát hiện

API Gateway đang yêu cầu authentication cho **TẤT CẢ** requests, bao gồm cả endpoint public-key!

```java
// ApiGateway SecurityConfig
.anyRequest().authenticated()  // ← Đang block public-key endpoint!
```

## ✅ Đã sửa

Thêm permitAll cho public-key endpoint trong `ApiGateway/src/main/java/com/volunteerhub/apigateway/config/SecurityConfig.java`:

```java
http.authorizeHttpRequests(
    c -> c.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
            .requestMatchers("/api/v1/notifications/web-push/public-key").permitAll()  // ← ADDED
            .anyRequest().authenticated()
);
```

## 🔧 HÀNH ĐỘNG CẦN LÀM NGAY

### ⚠️ QUAN TRỌNG: Restart API Gateway

API Gateway đang chạy ở **Terminal 6**. Cần restart:

```bash
# Trong Terminal 6:
# 1. Stop service (Ctrl+C)
# 2. Rồi start lại:
cd ApiGateway
./mvnw spring-boot:run
```

### Hoặc nếu không thấy terminal:

```bash
# Mở terminal mới
cd ApiGateway
./mvnw spring-boot:run
```

## ✅ Kiểm tra sau khi restart

### Test 1: Direct call to API Gateway
```bash
curl http://localhost:8080/api/v1/notifications/web-push/public-key
```

**Expected**: Trả về public key (200 OK)

### Test 2: Trong browser
1. Mở Settings page
2. Mở DevTools → Network tab
3. Click "Enable Browser Notifications"
4. Check request:

```
✅ GET http://localhost:8080/api/v1/notifications/web-push/public-key → 200 OK
✅ Response: <public-key-string>
```

## Kiến trúc hệ thống

```
Frontend (port 3000)
    ↓
API Gateway (port 8080)  ← ĐANG BLOCK TẠI ĐÂY!
    ↓
NotificationService (port 8085)
```

## Tại sao cần fix cả 2 nơi?

1. **API Gateway**: Cần permitAll để cho request đi qua
2. **NotificationService**: Cần disable HTTP Basic/Form Login để không yêu cầu authentication

## Services cần restart

- [x] NotificationService - ĐÃ RESTART
- [ ] **API Gateway - CẦN RESTART NGAY** ← BẠN Ở ĐÂY!

## Sau khi restart API Gateway

Mọi thứ sẽ hoạt động:
- ✅ Public key endpoint accessible
- ✅ No 401 errors
- ✅ Web Push registration works
- ✅ Notifications enabled

---

**TL;DR**: Restart API Gateway ở Terminal 6 (Ctrl+C rồi `./mvnw spring-boot:run`)


