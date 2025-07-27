export const mockConversations = [
  {
    id: "1",
    other_user: {
      id: "user-kim",
      name: "Kim",
      avatar_url: undefined,
      school: "UCLA",
      major: "Business"
    },
    last_message: {
      content: "Hey! Are you going to the mixer tonight?",
      sent_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      sender_id: "user-kim",
      read_at: undefined
    },
    unread_count: 1,
    is_matched: true
  },
  {
    id: "2", 
    other_user: {
      id: "user-alex",
      name: "Alex",
      avatar_url: undefined,
      school: "UCLA",
      major: "Computer Science"
    },
    last_message: {
      content: "Thanks for helping with the CS assignment!",
      sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      sender_id: "current-user",
      read_at: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    },
    unread_count: 0,
    is_matched: true
  },
  {
    id: "3",
    other_user: {
      id: "user-maya",
      name: "Maya",
      avatar_url: undefined,
      school: "UCLA", 
      major: "Pre-Med"
    },
    last_message: {
      content: "Study group tomorrow at 3pm?",
      sent_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      sender_id: "user-maya",
      read_at: undefined
    },
    unread_count: 2,
    is_matched: false
  },
  {
    id: "4",
    other_user: {
      id: "user-jordan",
      name: "Jordan",
      avatar_url: undefined,
      school: "UCLA",
      major: "Psychology"
    },
    last_message: {
      content: "See you at the dining hall!",
      sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      sender_id: "current-user",
      read_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
    },
    unread_count: 0,
    is_matched: true
  }
];

export const mockMessageRequests = [
  {
    id: "req-1",
    from_user: {
      id: "user-sarah",
      name: "Sarah",
      avatar_url: undefined,
      school: "UCLA",
      major: "Art History"
    },
    message: "Hi! I saw we're both in Professor Johnson's class. Want to study together?",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
  }
];