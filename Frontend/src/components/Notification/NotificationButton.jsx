import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';

const NotificationButton = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    // 1. Fetch danh sách thông báo
    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/v1/notifications?pageNum=0&pageSize=10', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Kiểm tra xem trình duyệt đã đăng ký Push chưa
        navigator.serviceWorker.ready.then(reg => {
            reg.pushManager.getSubscription().then(sub => {
                setIsSubscribed(!!sub);
            });
        });
    }, []);

    // 2. Logic Đăng ký Web Push (Kết nối với WebPushController.java)
    const handleSubscribe = async () => {
        setLoading(true);
        try {
            // Lấy Public Key từ Backend
            const keyRes = await fetch('/api/v1/notifications/web-push/public-key');
            const publicKey = await keyRes.text();

            const register = await navigator.serviceWorker.register('/sw.js');
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                });

                // Lưu subscription vào DB qua Backend
                await fetch('/api/v1/notifications/web-push/subscribe', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(subscription)
                });
                setIsSubscribed(true);
                alert("Đã bật thông báo thành công!");
            }
        } catch (error) {
            console.error("Push registration failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Convert VAPID key
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Nút bật/tắt Web Push trong Settings */}
            <button
                onClick={handleSubscribe}
                disabled={isSubscribed || loading}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isSubscribed 
                    ? "bg-emerald-50 text-emerald-600 cursor-default" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                }`}
            >
                {loading ? "Processing..." : isSubscribed ? (
                    <><ShieldCheck className="h-4 w-4" /> Push Notifications Enabled</>
                ) : (
                    <><Bell className="h-4 w-4" /> Enable Browser Notifications</>
                )}
            </button>

            {/* Icon Chuông thông báo (Thường dùng trên Navbar, nhưng có thể để ở đây để test) */}
            <div className="relative inline-block mt-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Recent Notifications</h4>
                <div className="border rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50">
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <div key={n.id} className={`p-3 text-sm ${!n.isRead ? "bg-white border-l-4 border-blue-500" : "opacity-60"}`}>
                                <div className="font-semibold">{n.title}</div>
                                <div className="text-slate-600 text-xs">{n.body}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-slate-400">No recent activities</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationButton;