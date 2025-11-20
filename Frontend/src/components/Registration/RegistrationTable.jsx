import RegistrationRow from "./RegistrationRow";
const registrations = [
  {
    id: "reg_001",
    name: "Alex Chen",
    email: "alex@email.com",
    avatar: "https://i.pravatar.cc/150?img=10",
    eventId: "event_beach_cleanup",
    eventName: "Beach Cleanup Drive",
    registrationDate: "2025-08-20",
    skills: ["Environmental Care", "Team Work"],
    message: "I'm passionate about ocean conservation and would love to help!",
    status: "pending",
  },
  {
    id: "reg_002",
    name: "Maria Rodriguez",
    email: "maria@email.com",
    avatar: "https://i.pravatar.cc/150?img=32",
    eventId: "event_marine_workshop",
    eventName: "Marine Education Workshop",
    registrationDate: "2025-08-21",
    skills: ["Teaching", "Communication"],
    message: "Excited to help educate others about marine life!",
    status: "pending",
  },
  {
    id: "reg_003",
    name: "John Walker",
    email: "john@email.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    eventId: "event_tree_planting",
    eventName: "Tree Planting Festival",
    registrationDate: "2025-08-15",
    skills: ["Gardening", "Physical Work"],
    message: "Happy to support environmental protection activities.",
    status: "approved",
  },
  {
    id: "reg_004",
    name: "Sofia Nguyen",
    email: "sofia@email.com",
    avatar: "https://i.pravatar.cc/150?img=45",
    eventId: "event_beach_cleanup",
    eventName: "Beach Cleanup Drive",
    registrationDate: "2025-08-22",
    skills: ["Leadership", "First Aid"],
    message: "I have experience organizing cleanups and helping teams.",
    status: "rejected",
  },
  {
    id: "reg_005",
    name: "David Kim",
    email: "david@email.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    eventId: "event_marine_workshop",
    eventName: "Marine Education Workshop",
    registrationDate: "2025-08-19",
    skills: ["Photography", "Public Speaking"],
    message: "Would love to document and present marine life stories.",
    status: "approved",
  },
  {
    id: "reg_006",
    name: "Emma Johnson",
    email: "emma@email.com",
    avatar: "https://i.pravatar.cc/150?img=15",
    eventId: "event_tree_planting",
    eventName: "Tree Planting Festival",
    registrationDate: "2025-08-17",
    skills: ["Team Work"],
    message: "Happy to help wherever I can!",
    status: "pending",
  },
  {
    id: "reg_007",
    name: "Liam Brown",
    email: "liam@email.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    eventId: "event_beach_cleanup",
    eventName: "Beach Cleanup Drive",
    registrationDate: "2025-08-18",
    skills: ["Environmental Care"],
    message: "I live near the beach and want to contribute.",
    status: "approved",
  },
  {
    id: "reg_008",
    name: "Hannah Davis",
    email: "hannah@email.com",
    avatar: "https://i.pravatar.cc/150?img=27",
    eventId: "event_marine_workshop",
    eventName: "Marine Education Workshop",
    registrationDate: "2025-08-23",
    skills: ["Teaching", "Art"],
    message: "I want to teach kids about the ocean using creative activities.",
    status: "pending",
  },
];

export default function RegistrationTable({ filters, onSelect }) {
  // Giả lập dữ liệu
  const data = registrations.filter(
    (r) =>
      (filters.event === "all" || r.event === filters.event) &&
      filters.status === r.status &&
      r.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr className="border-b border-b-gray-600/20 text-base">
            <th className="p-4 text-left">Volunteer</th>
            <th className="p-4 text-left">Event</th>
            <th className="p-4 text-left">Register Date</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((reg) => (
            <RegistrationRow
              key={reg.id}
              reg={reg}
              onSelect={() => onSelect(reg)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
