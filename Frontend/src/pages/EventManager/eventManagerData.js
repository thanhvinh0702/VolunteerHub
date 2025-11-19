// Mock data for Event Manager
export const mockEventManagerData = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return [
        {
            id: 1,
            title: "Beach Cleanup Drive",
            category: "Environment",
            date: "2025-09-15T08:00:00",
            endTime: "11:00:00",
            location: "Sunset Beach",
            registered: 12,
            capacity: 25,
            status: "approved", // Active event
            imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800",
        },
        {
            id: 2,
            title: "Marine Education Workshop",
            category: "Education",
            date: "2025-09-20T14:00:00",
            endTime: "17:00:00",
            location: "Community Center",
            registered: 5,
            capacity: 15,
            status: "pending", // Waiting for approval
            imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        },
        {
            id: 3,
            title: "Tree Planting Initiative",
            category: "Environment",
            date: "2025-09-25T09:00:00",
            endTime: "12:00:00",
            location: "City Park",
            registered: 30,
            capacity: 30,
            status: "approved", // Active event
            imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
        },
        {
            id: 4,
            title: "Youth Coding Workshop",
            category: "Education",
            date: "2025-10-01T10:00:00",
            endTime: "16:00:00",
            location: "Tech Hub",
            registered: 18,
            capacity: 25,
            status: "approved", // Active event
            imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        },
        {
            id: 5,
            title: "Community Food Drive",
            category: "Community",
            date: "2025-10-05T08:00:00",
            endTime: "14:00:00",
            location: "Downtown Square",
            registered: 8,
            capacity: 20,
            status: "cancelled", // Cancelled event
            imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
        },
        {
            id: 6,
            title: "Elderly Care Visit",
            category: "Community",
            date: "2025-10-10T09:00:00",
            endTime: "12:00:00",
            location: "Golden Age Center",
            registered: 0,
            capacity: 15,
            status: "pending", // Waiting for approval
            imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
        },
    ];
};

// New simplified status workflow:
// Pending → (Admin approves) → Approved → (Org can cancel) → Cancelled
export const EVENT_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    CANCELLED: "cancelled",
};

export const STATUS_CONFIG = {
    [EVENT_STATUS.PENDING]: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-700",
        description: "Waiting for approval",
    },
    [EVENT_STATUS.APPROVED]: {
        label: "Approved",
        color: "bg-green-100 text-green-700",
        description: "Event is active",
    },
    [EVENT_STATUS.CANCELLED]: {
        label: "Cancelled",
        color: "bg-red-100 text-red-700",
        description: "Event cancelled",
    },
};

export const getStatusColor = (status) => {
    return STATUS_CONFIG[status]?.color || "bg-gray-100 text-gray-700";
};

// Check if event can be cancelled
export const canCancelEvent = (status) => {
    return status === EVENT_STATUS.APPROVED;
};

