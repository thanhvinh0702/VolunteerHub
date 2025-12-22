# Notification Card Improvements

## ✨ Tính năng mới

### 1. **Navigation khi click vào notification**

Mỗi loại notification sẽ navigate đến trang tương ứng:

| Notification Type | Navigate To | Description |
|------------------|-------------|-------------|
| `EVENT_REQUESTED` | `/event-manager/{contextId}` | View event request details |
| `EVENT_APPROVED` | `/event-manager` | View all events |
| `EVENT_REJECTED` | `/event-manager` | View all events |
| `EVENT_UPDATED` | `/event-manager` | View all events |
| `EVENT_DELETED` | `/event-manager` | View all events |
| `USER_EVENT_APPROVED` | `/opportunities/overview/{contextId}` | View approved event |
| `USER_EVENT_REJECTED` | `/opportunities/overview/{contextId}` | View rejected event |
| `USER_EVENT_COMPLETED` | `/opportunities/overview/{contextId}` | View completed event |
| `USER_EVENT_REQUESTED` | `/event-manager/{contextId}` | View registration request |
| `COMMENT` | `/opportunities/overview/{contextId}` | View post with comment |
| `REACTION` | `/opportunities/overview/{contextId}` | View post with reaction |
| `POST_CREATED` | `/opportunities/overview/{contextId}` | View new post |
| `POST_UPDATED` | `/opportunities/overview/{contextId}` | View updated post |
| `USER_ACTIVE` | `/Setting` | View account settings |
| `USER_BANNED` | `/Setting` | View account settings |

### 2. **Icon động theo loại notification**

Mỗi loại notification có icon và màu riêng:

- 🔔 **EVENT_REQUESTED**: Orange AlertCircle
- ✅ **EVENT_APPROVED**: Green CheckCircle
- ❌ **EVENT_REJECTED**: Red AlertCircle
- 🔔 **EVENT_UPDATED**: Blue Bell
- 🗑️ **EVENT_DELETED**: Red Trash
- ✅ **USER_EVENT_APPROVED**: Green CheckCircle
- ❌ **USER_EVENT_REJECTED**: Red AlertCircle
- ✅ **USER_EVENT_COMPLETED**: Green CheckCircle
- 👤 **USER_EVENT_REQUESTED**: Blue UserCheck
- 💬 **COMMENT**: Purple MessageCircle
- ❤️ **REACTION**: Pink Heart
- 🔔 **POST_CREATED/UPDATED**: Blue Bell
- ✅ **USER_ACTIVE**: Green CheckCircle
- ❌ **USER_BANNED**: Red AlertCircle

### 3. **Nội dung chi tiết cho từng loại**

#### EVENT_UPDATED
```javascript
{
  title: "Event Updated",
  content: "Event has been updated",
  detail: "Event name if available"
}
```

#### USER_EVENT_APPROVED
```javascript
{
  title: "Registration Approved",
  content: "Your registration has been approved",
  detail: "Reviewed at [timestamp]"
}
```

#### USER_EVENT_REQUESTED
```javascript
{
  title: "New Registration Request",
  content: "Someone requested to join your event",
  detail: "Requested at [timestamp]"
}
```

#### COMMENT
```javascript
{
  title: "New Comment",
  content: "Comment content or default message",
  detail: null
}
```

#### REACTION
```javascript
{
  title: "New Reaction",
  content: "Someone reacted to your post",
  detail: null
}
```

### 4. **Auto mark as read khi click**

Khi click vào notification card, nó sẽ tự động:
1. Mark notification as read (nếu chưa đọc)
2. Navigate đến trang tương ứng

### 5. **Prevent propagation cho action buttons**

Buttons "Mark read" và "Delete" có `stopPropagation()` để không trigger card click.

### 6. **Improved hover effects**

```css
hover:shadow-md hover:scale-[1.01]
```

Card sẽ có hiệu ứng nổi lên và phóng to nhẹ khi hover.

## 🎨 UI Improvements

### Before:
- Tất cả notifications đều dùng Bell icon màu xanh/xám
- Không có navigation
- Nội dung generic

### After:
- Icon động theo loại notification với màu sắc phù hợp
- Click để navigate
- Nội dung chi tiết và có ý nghĩa
- Hover effects mượt mà

## 📝 Payload Structure

### EVENT_UPDATED
```json
{
  "updated_fields": {
    "name": "Event name",
    "address": "...",
    "capacity": 20,
    "category": "environment",
    "start_time": [2025, 12, 25, 9, 25],
    "end_time": [2025, 12, 26, 22, 26]
  }
}
```

### USER_EVENT_APPROVED
```json
{
  "reviewed_at": [2025, 12, 22, 9, 15, 31, 31399200]
}
```

### USER_EVENT_REQUESTED
```json
{
  "requested_at": [2025, 12, 21, 23, 49, 17, 761428000]
}
```

### COMMENT
```json
{
  "content": "Comment text"
}
```

### EVENT_APPROVED
```json
{
  "name": "Event name",
  "category": "environment",
  "approved_time": [2025, 12, 21, 23, 54, 57, 768724200]
}
```

## 🔧 Technical Details

### New imports:
```javascript
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Heart,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
```

### New functions:
- `getNavigationPath()`: Returns navigation path based on notification type
- `handleCardClick()`: Handles card click, marks as read, and navigates

### Updated functions:
- `getNotificationMessage()`: Now returns icon and iconColor in addition to title, content, detail

## 🧪 Testing

Test các scenarios sau:

1. **Click notification** → Should navigate to correct page
2. **Click "Mark read"** → Should NOT navigate, only mark as read
3. **Click "Delete"** → Should NOT navigate, only delete
4. **Hover notification** → Should show hover effects
5. **Different notification types** → Should show correct icon, color, and message

## 📱 Responsive

- Mobile: Actions stack vertically
- Desktop: Full layout with hover effects
- Icons scale appropriately on all screen sizes

## 🎯 User Experience

1. **Visual feedback**: Different colors and icons help users quickly identify notification types
2. **Quick navigation**: One click to go to relevant page
3. **Smart marking**: Auto-mark as read when navigating
4. **Prevent accidents**: Action buttons don't trigger navigation

