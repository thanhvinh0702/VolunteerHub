// mockApi.js — mô phỏng backend API
export async function mockApiFetch(path) {
    console.log("Fetching:", path);
    await new Promise((r) => setTimeout(r, 800)); // fake network delay

    if (path.includes("/applied")) {
        return [
            {
                id: 1,
                title: "Community Cleanup Drive",
                organization: "GreenFuture Org",
                date: "Nov 12, 2025 • 08:00 AM - 11:00 AM",
                location: "District 3 Park",
                status: "Pending",
                statusVariant: "dark",
                notes: "Bring gloves and water bottle.",
            },
            {
                id: 2,
                title: "Tree Planting Event",
                organization: "Urban Earth Foundation",
                date: "Nov 15, 2025 • 09:00 AM - 12:00 PM",
                location: "City Arboretum",
                status: "Pending",
                statusVariant: "light",
                notes: "Waiting for slot confirmation.",
            },
            {
                id: 3,
                title: "Tree Planting Event",
                organization: "Urban Earth Foundation",
                date: "Nov 15, 2025 • 09:00 AM - 12:00 PM",
                location: "City Arboretum",
                status: "Pending",
                statusVariant: "light",
                notes: "Waiting for slot confirmation.",
            },
            {
                id: 3,
                title: "Tree Planting Event",
                organization: "Urban Earth Foundation",
                date: "Nov 15, 2025 • 09:00 AM - 12:00 PM",
                location: "City Arboretum",
                status: "Pending",
                statusVariant: "light",
                notes: "Waiting for slot confirmation.",
            },

        ];
    }

    if (path.includes("/upcoming")) {
        return [
            {
                id: 3,
                title: "Tech Workshop for Youth",
                organization: "Code4Good",
                date: "Dec 5, 2025 • 10:00 AM - 02:00 PM",
                location: "Youth Innovation Hub",
                status: "Approved",
                statusVariant: "dark",
            },
            {
                id: 4,
                title: "Animal Shelter Volunteering",
                organization: "PawPal Foundation",
                date: "Dec 12, 2025 • 09:00 AM - 01:00 PM",
                location: "PawPal Animal Shelter",
                status: "Pending",
                statusVariant: "light",
            },
        ];
    }

    if (path.includes("/completed")) {
        return [
            {
                id: 5,
                title: "Food Drive Distribution",
                organization: "HopeHands",
                date: "Oct 20, 2025",
                hours: "5 hours contributed",
                status: "Verified",
                statusVariant: "accent",
            },
            {
                id: 6,
                title: "Senior Care Center Visit",
                organization: "GoldenAge",
                date: "Oct 10, 2025",
                hours: "3 hours contributed",
                status: "Pending Verification",
                statusVariant: "light",
            },
        ];
    }

    throw new Error("Unknown endpoint: " + path);
}
