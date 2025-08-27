// Mock conversations for dev mode testing - realistic profiles for UI testing
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
      content: "Hey! Are you going to the welcome event tomorrow? 🎉",
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
      content: "Thanks for the study group info! 📚 Really excited to meet everyone",
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
      major: "Business Administration"
    },
    last_message: {
      content: "Looking forward to meeting up this weekend! Maybe we can grab coffee? ☕",
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
      major: "Mechanical Engineering"
    },
    last_message: {
      content: "Perfect! See you at the library at 2pm. I'll bring the study materials 📖",
      sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      sender_id: "dev-user-123",
      read_at: new Date().toISOString()
    },
    unread_count: 0,
    is_matched: true
  },
  {
    id: "conv-5",
    other_user: {
      id: "user-5",
      name: "Maya Patel",
      avatar_url: "photo-1517841905240-472988babdf9",
      school: "UCLA",
      major: "Pre-Med"
    },
    last_message: {
      content: "OMG yes! I love that show too 😍 We should totally binge-watch it together",
      sent_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      sender_id: "user-5",
      read_at: null
    },
    unread_count: 1,
    is_matched: true
  }
];

export const mockMessageRequests = [
  {
    id: "req-1",
    from_user: {
      id: "user-6",
      name: "Sam Martinez",
      avatar_url: "photo-1500648767791-00dcc994a43e",
      school: "UCLA",
      major: "Art History"
    },
    message: "Hey! I saw we're both taking Art History 101. Want to study together sometime? I heard the midterm is pretty challenging 📚",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
  },
  {
    id: "req-2", 
    from_user: {
      id: "user-7",
      name: "Casey Wong",
      avatar_url: "photo-1535268647677-3057x4585",
      school: "UCLA",
      major: "Pre-Med"
    },
    message: "Hi! I'm also looking for a roommate for next semester. Are you still searching? I'm super clean and quiet, perfect study buddy! 🏠✨",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
  }
];

export const mockMessages = [
  // Group chat messages (for group-chat conversation)
  {
    id: "group-msg-1",
    conversation_id: "group-chat",
    sender_id: "user-alex",
    user_name: "Alex Chen",
    message: "Welcome to the group chat everyone! 🎉",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "group-msg-2",
    conversation_id: "group-chat",
    sender_id: "user-sarah",
    user_name: "Sarah Kim",
    message: "Thanks! Excited to meet everyone",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "group-msg-3",
    conversation_id: "group-chat",
    sender_id: "dev-user-123",
    user_name: "Dev Student",
    message: "This is awesome! Can't wait for orientation week",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read_at: new Date().toISOString()
  },

  // Conversation with Kim Chen (conv-1)
  {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "user-1",
    message: "Hey! Are you going to the welcome event tomorrow? 🎉",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-2",
    conversation_id: "conv-1", 
    sender_id: "user-1",
    message: "I heard there's going to be free food and some fun activities!",
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-3",
    conversation_id: "conv-1",
    sender_id: "dev-user-123",
    message: "That sounds awesome! I'll definitely be there 😊",
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-4",
    conversation_id: "conv-1",
    sender_id: "user-1",
    message: "Perfect! Should we meet at the quad at 7pm?",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read_at: null
  },
  
  // Conversation with Alex Rivera (conv-2)
  {
    id: "msg-5",
    conversation_id: "conv-2",
    sender_id: "user-2",
    message: "Hey! Do you know anything about the Computer Science study groups?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-6",
    conversation_id: "conv-2",
    sender_id: "dev-user-123",
    message: "Yeah! There's one that meets every Tuesday and Thursday at 4pm in the CS building",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-7",
    conversation_id: "conv-2",
    sender_id: "user-2",
    message: "Thanks for the study group info! 📚 Really excited to meet everyone",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read_at: new Date().toISOString()
  },

  // Conversation with Maya Patel (conv-5)
  {
    id: "msg-8",
    conversation_id: "conv-5",
    sender_id: "dev-user-123",
    message: "Have you seen the new season of Stranger Things? It's amazing!",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-9",
    conversation_id: "conv-5",
    sender_id: "user-5",
    message: "OMG yes! I love that show too 😍 We should totally binge-watch it together",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read_at: null
  }
];