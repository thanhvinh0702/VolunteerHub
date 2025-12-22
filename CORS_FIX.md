# 🚨 CORS Error Fix - Duplicate Access-Control-Allow-Origin

## Lỗi

```
The 'Access-Control-Allow-Origin' header contains multiple values 
'http://localhost:3000, http://localhost:3000', but only one is allowed.
```

## Nguyên nhân

**2 nơi đang set CORS headers:**
1. API Gateway ✅ (nên giữ)
2. NotificationService ❌ (nên tắt)

Khi request đi qua API Gateway → NotificationService, cả 2 đều thêm CORS headers → duplicate!

## ✅ Đã sửa

### 1. NotificationService - Disable CORS

**File**: `NotificationService/src/main/java/com/volunteerhub/notificationservice/config/SecurityConfig.java`

```java
// BEFORE
.cors(cors -> cors.configurationSource(corsConfigurationSource()))

// AFTER
.cors(AbstractHttpConfigurer::disable)  // API Gateway handles CORS
```

### 2. API Gateway - Cải thiện CORS config

**File**: `ApiGateway/src/main/java/com/volunteerhub/apigateway/config/SecurityConfig.java`

```java
http.cors(c -> {
    CorsConfigurationSource source = request -> {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        // Split comma-separated origins if multiple
        String[] origins = allowedOrigins.split(",");
        corsConfiguration.setAllowedOrigins(List.of(origins));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);
        return corsConfiguration;
    };
    c.configurationSource(source);
});
```

## 🔧 HÀNH ĐỘNG CẦN LÀM

### 1️⃣ Restart NotificationService (Terminal 8)

```bash
# Ctrl+C để stop, rồi:
cd NotificationService
./mvnw spring-boot:run
```

### 2️⃣ Restart API Gateway (Terminal 6)

```bash
# Ctrl+C để stop, rồi:
cd ApiGateway
./mvnw spring-boot:run
```

### 3️⃣ Clear browser cache

1. Mở DevTools (F12)
2. Right-click Refresh button
3. Chọn "Empty Cache and Hard Reload"

## ✅ Kiểm tra

### Test trong browser:

1. Mở Settings page
2. DevTools → Network tab
3. Click "Enable Browser Notifications"
4. Check response headers:

```
✅ access-control-allow-origin: http://localhost:3000  (CHỈ 1 LẦN!)
✅ Status: 200 OK
```

### Test với curl:

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:8080/api/v1/notifications/web-push/public-key -v
```

Phải thấy:
```
< access-control-allow-origin: http://localhost:3000
```

## Kiến trúc CORS

```
Frontend (localhost:3000)
    ↓ Request with Origin header
API Gateway (localhost:8080)
    ↓ Adds CORS headers ✅
    ↓ Forwards to service
NotificationService (localhost:8085)
    ↓ CORS disabled ✅ (không thêm headers nữa)
    ↓ Response
API Gateway
    ↓ Response with CORS headers (1 lần)
Frontend ✅
```

## Best Practice

**Trong microservices architecture:**
- ✅ API Gateway handles CORS
- ❌ Individual services should NOT add CORS headers
- ✅ Services trust requests from API Gateway

## Checklist

- [x] Disable CORS trong NotificationService
- [x] Cải thiện CORS config trong API Gateway
- [ ] Restart NotificationService
- [ ] Restart API Gateway
- [ ] Clear browser cache
- [ ] Test lại

---

**TL;DR**: Disable CORS ở NotificationService, chỉ để API Gateway handle. Restart cả 2 services!


