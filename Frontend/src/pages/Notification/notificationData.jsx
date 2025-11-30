const icons = ["⏰", "🏅", "💬", "📢", "📌", "🔔"];

function randomTime() {
  const hours = Math.floor(Math.random() * 48) + 1;
  return `${hours} hours ago`;
}

function randomContent() {
  const samples = [
    "Beach Cleanup Drive starts in 2 days",
    "You've earned a new community badge!",
    "Thank you for joining our volunteering drive.",
    "Your registration has been approved.",
    "New update available for your event dashboard.",
    "Reminder: Your event is starting soon.",
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}

function randomTitle() {
  const samples = [
    "Upcoming Event Reminder",
    "New Badge Earned!",
    "Message from Ocean Care Foundation",
    "Notification Update",
    "System Alert",
    "Participation Reminder",
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}

export const notifications = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  icon: icons[i % icons.length],
  title: randomTitle(),
  content: randomContent(),
  time: randomTime(),
  unread: Math.random() > 0.5,
}));
