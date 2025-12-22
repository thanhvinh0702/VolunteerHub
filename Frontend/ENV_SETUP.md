# Frontend Environment Setup

## Tạo file `.env` hoặc `.env.local`

Tạo file `.env.local` trong thư mục `Frontend/` với nội dung sau:

```properties
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_API_LOGIN=http://localhost:7070/api
```

## Giải thích

- `VITE_API_URL`: Base URL cho API Gateway (bao gồm `/api` prefix)
- `VITE_API_LOGIN`: URL cho Login Service

## Lưu ý

- File `.env.local` sẽ không được commit vào git (đã có trong .gitignore)
- Sau khi tạo file, cần restart dev server: `npm run dev`

## Kiểm tra

Sau khi tạo file và restart, mở browser console và check:
```javascript
console.log(import.meta.env.VITE_API_URL)
// Should output: http://localhost:8080/api
```


