# Web Push Notification Setup Guide

## Overview
This guide explains how to set up and configure Web Push notifications for VolunteerHub.

## Prerequisites
- Node.js installed (for generating VAPID keys)
- PostgreSQL database running
- RabbitMQ running
- Modern browser with Push API support

## Step 1: Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for Web Push notifications.

```bash
cd NotificationService
node generate-vapid-keys.js
```

This will output something like:
```
VAPID_PUBLIC_KEY=BNxW8Tn...
VAPID_PRIVATE_KEY=3yKh9m...
VAPID_SUBJECT=mailto:admin@volunteerhub.com
```

## Step 2: Configure Environment Variables

Add the generated keys to your `.env` file in the NotificationService directory:

```properties
# VAPID Keys for Web Push
VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
VAPID_SUBJECT=mailto:admin@volunteerhub.com
```

**⚠️ IMPORTANT**: 
- Never commit the private key to version control
- Keep the private key secure
- Change the VAPID_SUBJECT to your actual email address

## Step 3: Configure Frontend

Update your Frontend `.env` file with the API URL:

```properties
VITE_API_URL=http://localhost:8080/api
```

Or use your production URL when deploying.

## Step 4: Verify Service Worker

Ensure the Service Worker file is accessible at `/sw.js` in your frontend public directory.

The file should be at: `Frontend/public/sw.js`

## Step 5: Start the Services

1. Start NotificationService:
```bash
cd NotificationService
./mvnw spring-boot:run
```

2. Start Frontend:
```bash
cd Frontend
npm run dev
```

## Step 6: Test Web Push

1. Open the application in your browser
2. Navigate to Settings page
3. Click "Enable Browser Notifications"
4. Accept the browser permission prompt
5. Test by calling the test endpoint:

```bash
curl -X POST http://localhost:8080/api/v1/notifications/web-push/test-send \
  -H "Authorization: Bearer <your-token>" \
  -H "X-USER-ID: <your-user-id>" \
  -H "X-USER-ROLE: USER"
```

## Troubleshooting

### Issue: "Service Worker is not supported"
- Make sure you're using HTTPS (or localhost for development)
- Check browser compatibility

### Issue: "Failed to fetch public key"
- Verify NotificationService is running
- Check CORS configuration
- Verify VAPID_PUBLIC_KEY is set in environment variables

### Issue: "Failed to save subscription"
- Check authentication token is valid
- Verify database connection
- Check server logs for detailed errors

### Issue: Notifications not appearing
- Check browser notification permissions
- Verify subscription was saved in database
- Check browser console for errors
- Verify Service Worker is registered

## API Endpoints

### Get Public Key (Public)
```
GET /api/v1/notifications/web-push/public-key
```

### Subscribe (Authenticated)
```
POST /api/v1/notifications/web-push/subscribe
Content-Type: application/json
Authorization: Bearer <token>

{
  "endpoint": "https://...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}
```

### Test Send (Authenticated)
```
POST /api/v1/notifications/web-push/test-send
Authorization: Bearer <token>
```

### Broadcast (Admin only)
```
POST /api/v1/notifications/web-push/broadcast
Content-Type: application/json

{
  "title": "Notification Title",
  "body": "Notification message",
  "url": "/path/to/page"
}
```

## Security Considerations

1. **VAPID Keys**: Keep private key secure and never expose it
2. **CORS**: Configure appropriate origins in production
3. **Authentication**: All endpoints (except public-key) require authentication
4. **HTTPS**: Always use HTTPS in production for Service Workers

## Browser Support

Web Push is supported in:
- Chrome 50+
- Firefox 44+
- Edge 17+
- Safari 16+ (macOS 13+)
- Opera 37+

## Production Deployment

1. Generate production VAPID keys (different from development)
2. Update CORS configuration to allow only your production domain
3. Use HTTPS for both frontend and backend
4. Set appropriate VAPID_SUBJECT with your domain email
5. Monitor subscription cleanup for expired/invalid subscriptions

## Database Schema

The subscription table stores:
- `id`: Primary key
- `user_id`: User identifier
- `endpoint`: Push service endpoint URL
- `p256dh`: Public key for encryption
- `auth`: Authentication secret

## Additional Resources

- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)
- [Push API MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)


