// Mock data for Event Manager
const ALL_EVENTS = [
    {
        id: 1,
        title: "Beach Cleanup Drive",
        category: "Environment",
        date: "2025-09-15T08:00:00",
        endTime: "11:00:00",
        location: "Sunset Beach",
        registered: 12,
        capacity: 25,
        status: "approved",
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
        status: "pending",
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
        status: "approved",
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
        status: "approved",
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
        status: "cancelled",
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
        status: "pending",
        imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    },
    {
        id: 7,
        title: "River Cleanup Campaign",
        category: "Environment",
        date: "2025-10-15T07:00:00",
        endTime: "11:00:00",
        location: "Riverside Park",
        registered: 22,
        capacity: 40,
        status: "approved",
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    },
    {
        id: 8,
        title: "Digital Literacy for Seniors",
        category: "Education",
        date: "2025-10-18T13:00:00",
        endTime: "16:00:00",
        location: "Public Library",
        registered: 10,
        capacity: 20,
        status: "approved",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    },
    {
        id: 9,
        title: "Animal Shelter Support",
        category: "Community",
        date: "2025-10-20T09:00:00",
        endTime: "13:00:00",
        location: "City Animal Shelter",
        registered: 15,
        capacity: 25,
        status: "pending",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
    },
    {
        id: 10,
        title: "Homeless Outreach Program",
        category: "Community",
        date: "2025-10-22T06:00:00",
        endTime: "10:00:00",
        location: "Central Station",
        registered: 8,
        capacity: 15,
        status: "approved",
        imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
    },
    {
        id: 11,
        title: "School Garden Project",
        category: "Environment",
        date: "2025-10-25T08:00:00",
        endTime: "12:00:00",
        location: "Lincoln Elementary",
        registered: 12,
        capacity: 20,
        status: "pending",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    },
    {
        id: 12,
        title: "Blood Donation Drive",
        category: "Health",
        date: "2025-10-28T09:00:00",
        endTime: "17:00:00",
        location: "Red Cross Center",
        registered: 45,
        capacity: 100,
        status: "approved",
        imageUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800",
    },
    {
        id: 13,
        title: "Disaster Preparedness Training",
        category: "Education",
        date: "2025-11-01T10:00:00",
        endTime: "15:00:00",
        location: "Community Hall",
        registered: 28,
        capacity: 50,
        status: "approved",
        imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
    },
    {
        id: 14,
        title: "Neighborhood Watch Setup",
        category: "Community",
        date: "2025-11-05T18:00:00",
        endTime: "20:00:00",
        location: "Oak Street Community Center",
        registered: 6,
        capacity: 30,
        status: "cancelled",
        imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
    },
    {
        id: 15,
        title: "Art Therapy for Kids",
        category: "Education",
        date: "2025-11-08T14:00:00",
        endTime: "17:00:00",
        location: "Children's Hospital",
        registered: 5,
        capacity: 10,
        status: "pending",
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
    },
    {
        id: 16,
        title: "Recycling Awareness Campaign",
        category: "Environment",
        date: "2025-11-10T09:00:00",
        endTime: "14:00:00",
        location: "Shopping Mall Plaza",
        registered: 18,
        capacity: 30,
        status: "approved",
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    },
];

// Paginated API function
export const mockEventManagerData = async ({ page = 1, pageSize = 6, search = "", status = "all" } = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter by search and status
    let filtered = ALL_EVENTS.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.location.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "all" || event.status === status;
        return matchesSearch && matchesStatus;
    });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
        items,
        totalItems,
        totalPages,
        currentPage: page,
    };
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

