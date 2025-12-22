# 🚀 Quick Start - Web Push Notifications

## TL;DR - 3 bước để chạy Web Push

### 1️⃣ Generate VAPID Keys
```bash
cd NotificationService
node generate-vapid-keys.js
```

### 2️⃣ Copy keys vào `.env`
```bash
# Tạo file .env và paste output từ bước 1
nano .env
```

### 3️⃣ Start và Test
```bash
# Start backend
./mvnw spring-boot:run

# Trong terminal khác, start frontend
cd ../Frontend
npm run dev

# Mở browser: http://localhost:3000
# Vào Settings → Click "Enable Browser Notifications"
```

## ✅ Verify nó hoạt động

Test bằng curl:
```bash
curl -X POST http://localhost:8080/api/v1/notifications/web-push/test-send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-USER-ID: YOUR_USER_ID" \
  -H "X-USER-ROLE: USER"
```

Bạn sẽ thấy notification popup! 🎉

## 📚 Chi tiết hơn?

- Setup đầy đủ: `WEB_PUSH_SETUP.md`
- Các fixes: `FIXES_SUMMARY.md`
- Migration notes: `README_MIGRATION.md`

## ⚠️ Common Issues

**"Failed to fetch public key"**
→ Check VAPID_PUBLIC_KEY trong .env

**"Service Worker not supported"**
→ Dùng HTTPS hoặc localhost

**No notification appears**
→ Check browser permissions

## 🔧 Environment Variables cần thiết

```properties
# Backend (.env)
VAPID_PUBLIC_KEY=<from-generate-script>
VAPID_PRIVATE_KEY=<from-generate-script>
VAPID_SUBJECT=mailto:admin@volunteerhub.com

# Frontend (.env)
VITE_API_URL=http://localhost:8080/api
```

That's it! 🎊


