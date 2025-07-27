// Mock conversations for dev mode testing
export const mockConversations = [
  {
    id: "conv-1",
    other_user: {
      id: "user-1",
      name: "Kim Chen",
      avatar_url: "photo-1494790108755-2616b169ad66",
      school: "UCLA",
      major: "Psychology"
    },
    last_message: {
      content: "Hey! Are you going to the welcome event tomorrow?",
      sent_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      sender_id: "user-1",
      read_at: null
    },
    unread_count: 2,
    is_matched: true
  },
  {
    id: "conv-2",
    other_user: {
      id: "user-2",
      name: "Alex Rivera",
      avatar_url: "photo-1507003211169-0a1dd7228f2d",
      school: "UCLA", 
      major: "Computer Science"
    },
    last_message: {
      content: "Thanks for the study group info! 📚",
      sent_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      sender_id: "dev-user-123",
      read_at: new Date().toISOString()
    },
    unread_count: 0,
    is_matched: true
  },
  {
    id: "conv-3",
    other_user: {
      id: "user-3",
      name: "Taylor Johnson",
      avatar_url: "photo-1438761681033-6461ffad8d80",
      school: "UCLA",
      major: "Business"
    },
    last_message: {
      content: "Looking forward to meeting up this weekend!",
      sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      sender_id: "user-3",
      read_at: new Date().toISOString()
    },
    unread_count: 0,
    is_matched: false
  },
  {
    id: "conv-4",
    other_user: {
      id: "user-4",
      name: "Jordan Kim",
      avatar_url: "photo-1472099645785-5658abf4ff4e",
      school: "UCLA",
      major: "Engineering"
    },
    last_message: {
      content: "Perfect! See you at the library at 2pm",
      sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      sender_id: "dev-user-123",
      read_at: new Date().toISOString()
    },
    unread_count: 0,
    is_matched: true
  }
];

export const mockMessageRequests = [
  {
    id: "req-1",
    from_user: {
      id: "user-5",
      name: "Sam Martinez",
      avatar_url: "photo-1500648767791-00dcc994a43e",
      school: "UCLA",
      major: "Art History"
    },
    message: "Hey! I saw we're both taking Art History 101. Want to study together sometime?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
  },
  {
    id: "req-2", 
    from_user: {
      id: "user-6",
      name: "Casey Wong",
      avatar_url: "photo-1517841905240-472988babdf9",
      school: "UCLA",
      major: "Pre-Med"
    },
    message: "Hi! I'm also looking for a roommate for next semester. Are you still searching?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
  }
];

export const mockMessages = [
  {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "user-1",
    message: "Hey! Are you going to the welcome event tomorrow?",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read_at: null
  },
  {
    id: "msg-2",
    conversation_id: "conv-1", 
    sender_id: "user-1",
    message: "I heard there's going to be free food and some fun activities!",
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    read_at: null
  },
  {
    id: "msg-3",
    conversation_id: "conv-1",
    sender_id: "dev-user-123",
    message: "That sounds awesome! I'll definitely be there 😊",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read_at: new Date().toISOString()
  }
];