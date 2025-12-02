const ALL_USERS = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex@email.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    type: "volunteer",
    status: "active",
    joinDate: "2025-01-15T00:00:00Z",
    lastActive: "2025-08-28T00:00:00Z",
    activity: { hours: 124, events: 18, volunteers: null },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 2,
    name: "Green Earth Initiative",
    email: "contact@greenearth.org",
    avatar: "https://i.pravatar.cc/150?img=10",
    type: "organization",
    status: "pending",
    joinDate: "2025-08-20T00:00:00Z",
    lastActive: "2025-08-27T00:00:00Z",
    activity: { hours: null, events: 0, volunteers: 0 },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    email: "maria@email.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    type: "volunteer",
    status: "active",
    joinDate: "2024-12-10T00:00:00Z",
    lastActive: "2025-08-15T00:00:00Z",
    activity: { hours: 67, events: 8, volunteers: null },
    flags: { hasWarning: true, isSuspended: false },
  },
  {
    id: 4,
    name: "Community Food Bank",
    email: "admin@foodbank.org",
    avatar: "https://i.pravatar.cc/150?img=20",
    type: "organization",
    status: "active",
    joinDate: "2024-06-15T00:00:00Z",
    lastActive: "2025-08-28T00:00:00Z",
    activity: { hours: null, events: 23, volunteers: 145 },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james@email.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    type: "volunteer",
    status: "active",
    joinDate: "2024-08-10T00:00:00Z",
    lastActive: "2025-08-26T00:00:00Z",
    activity: { hours: 87, events: 12, volunteers: null },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 6,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    type: "volunteer",
    status: "ban",
    joinDate: "2024-03-22T00:00:00Z",
    lastActive: "2025-07-10T00:00:00Z",
    activity: { hours: 45, events: 6, volunteers: null },
    flags: { hasWarning: true, isSuspended: true },
  },
  {
    id: 7,
    name: "Ocean Care Foundation",
    email: "info@oceancare.org",
    avatar: "https://i.pravatar.cc/150?img=25",
    type: "organization",
    status: "active",
    joinDate: "2024-02-01T00:00:00Z",
    lastActive: "2025-08-29T00:00:00Z",
    activity: { hours: null, events: 45, volunteers: 230 },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 8,
    name: "David Kim",
    email: "david.kim@email.com",
    avatar: "https://i.pravatar.cc/150?img=14",
    type: "volunteer",
    status: "active",
    joinDate: "2024-05-18T00:00:00Z",
    lastActive: "2025-03-12T00:00:00Z",
    activity: { hours: 156, events: 22, volunteers: null },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 9,
    name: "Youth Education Center",
    email: "contact@youthcenter.org",
    avatar: "https://i.pravatar.cc/150?img=30",
    type: "organization",
    status: "pending",
    joinDate: "2025-08-15T00:00:00Z",
    lastActive: "2025-08-20T00:00:00Z",
    activity: { hours: null, events: 0, volunteers: 0 },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 10,
    name: "Emily Chen",
    email: "emily.chen@email.com",
    avatar: "https://i.pravatar.cc/150?img=16",
    type: "volunteer",
    status: "active",
    joinDate: "2024-07-03T00:00:00Z",
    lastActive: "2025-08-29T00:00:00Z",
    activity: { hours: 203, events: 34, volunteers: null },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 11,
    name: "Tech for Good",
    email: "hello@techforgood.org",
    avatar: "https://i.pravatar.cc/150?img=35",
    type: "organization",
    status: "active",
    joinDate: "2024-09-10T00:00:00Z",
    lastActive: "2025-08-30T00:00:00Z",
    activity: { hours: null, events: 12, volunteers: 85 },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 12,
    name: "Lucas Martinez",
    email: "lucas.m@email.com",
    avatar: "https://i.pravatar.cc/150?img=18",
    type: "volunteer",
    status: "pending",
    joinDate: "2025-08-25T00:00:00Z",
    lastActive: "2025-08-28T00:00:00Z",
    activity: { hours: 0, events: 0, volunteers: null },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 13,
    name: "Animal Rescue League",
    email: "rescue@animalleague.org",
    avatar: "https://i.pravatar.cc/150?img=40",
    type: "organization",
    status: "active",
    joinDate: "2024-04-20T00:00:00Z",
    lastActive: "2025-08-29T00:00:00Z",
    activity: { hours: null, events: 38, volunteers: 120 },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 14,
    name: "Sophie Williams",
    email: "sophie.w@email.com",
    avatar: "https://i.pravatar.cc/150?img=22",
    type: "volunteer",
    status: "active",
    joinDate: "2024-11-05T00:00:00Z",
    lastActive: "2025-08-27T00:00:00Z",
    activity: { hours: 92, events: 15, volunteers: null },
    flags: { hasWarning: false, isSuspended: false },
  },
  {
    id: 15,
    name: "Michael Brown",
    email: "michael.b@email.com",
    avatar: "https://i.pravatar.cc/150?img=28",
    type: "volunteer",
    status: "ban",
    joinDate: "2024-06-12T00:00:00Z",
    lastActive: "2025-05-20T00:00:00Z",
    activity: { hours: 34, events: 4, volunteers: null },
    flags: { hasWarning: true, isSuspended: true },
  },
  {
    id: 16,
    name: "Habitat Heroes",
    email: "info@habitatheroes.org",
    avatar: "https://i.pravatar.cc/150?img=45",
    type: "organization",
    status: "pending",
    joinDate: "2025-08-22T00:00:00Z",
    lastActive: "2025-08-26T00:00:00Z",
    activity: { hours: null, events: 0, volunteers: 0 },
    flags: { hasWarning: false, isSuspended: false },
  },
];

// Paginated API function
export const mockUserData = async ({
  page = 1,
  pageSize = 6,
  search = "",
  status = "all",
} = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Filter by search and status
  let filtered = ALL_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || user.status === status;
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

// Legacy function for backward compatibility
export const mockData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    users: ALL_USERS,
    statistics: {
      totalUsers: ALL_USERS.length,
      activeVolunteers: ALL_USERS.filter(
        (u) => u.type === "volunteer" && u.status === "active"
      ).length,
      activeOrganizations: ALL_USERS.filter(
        (u) => u.type === "organization" && u.status === "active"
      ).length,
      pendingApprovals: ALL_USERS.filter((u) => u.status === "pending").length,
      suspendedUsers: ALL_USERS.filter((u) => u.status === "ban").length,
      totalEvents: 138,
      totalVolunteerHours: 682,
      newUsersThisMonth: 3,
      activeEventsCount: 45,
    },
  };
};

export const USER_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  BAN: "ban",
};

export const STATUS_CONFIG = {
  [USER_STATUS.PENDING]: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    description: "Waiting for approval",
  },
  [USER_STATUS.ACTIVE]: {
    label: "Active",
    color: "bg-green-100 text-green-700",
    description: "User is active",
  },
  [USER_STATUS.BAN]: {
    label: "Ban",
    color: "bg-red-100 text-red-700",
    description: "User is banned",
  },
};

export const getStatusColor = (status) => {
  return STATUS_CONFIG[status]?.color || "bg-gray-100 text-gray-700";
};

// Check if event can be cancelled
export const canBan = (status) => {
  return status === USER_STATUS.ACTIVE;
};
