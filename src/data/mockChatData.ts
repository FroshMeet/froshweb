/**
 * Mock Chat Data Generator
 * 
 * Generates realistic mock data for dev mode:
 * - 50-120 messages across multiple conversations
 * - 15-30 unique users with realistic names and majors
 * - Group chat with high activity
 * - DM conversations with various activity levels
 */

import { ChatMessage, Conversation, GroupChatSummary } from '../types/chat';

const firstNames = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Avery', 'Morgan', 'Quinn', 'Sage', 'River',
  'Phoenix', 'Skylar', 'Rowan', 'Emery', 'Finley', 'Hayden', 'Lennox', 'Remy', 'Wren', 'Blake',
  'Cameron', 'Drew', 'Ellis', 'Frankie', 'Gray', 'Harper', 'Indie', 'Jude', 'Kai', 'Lane',
  'Max', 'Nova', 'Oakley', 'Parker', 'Rain', 'Scout', 'Tate', 'Uma', 'Vale', 'Xen', 'Yale', 'Zara'
];

const lastNames = [
  'Johnson', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson', 'Garcia', 'Martinez', 'Anderson', 'Taylor',
  'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Lee', 'Rodriguez', 'Lewis', 'Walker',
  'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams'
];

const majors = [
  'Computer Science', 'Business Administration', 'Psychology', 'Biology', 'Engineering',
  'Economics', 'English Literature', 'Political Science', 'Mathematics', 'Art History',
  'Pre-Med', 'Communications', 'Philosophy', 'Chemistry', 'Physics', 'Sociology',
  'International Relations', 'Film Studies', 'Environmental Science', 'Music Theory'
];

const messageTemplates = [
  // Questions
  "Hey everyone! Anyone know what time the library closes today?",
  "Does anyone have the notes from today's lecture?",
  "Anyone want to study for the midterm together?",
  "What's everyone doing for spring break?",
  "Has anyone taken Professor Johnson's class?",
  "Where's the best place to get coffee on campus?",
  "Anyone know if the gym is open late tonight?",
  
  // Responses
  "I think it's 11 PM on weekdays!",
  "Yeah, I can share my notes with you",
  "I'm down to study! Library at 3?",
  "Going home to see family",
  "Professor Johnson is amazing, highly recommend!",
  "The coffee shop in the student center is great",
  "It closes at 10 PM I believe",
  
  // Social/casual
  "Just finished my paper, finally! 🎉",
  "Anyone else stressed about finals?",
  "The dining hall food is actually good today lol",
  "Can't wait for the weekend",
  "This weather is perfect for studying outside",
  "Just saw the most amazing sunset from my dorm",
  "Who's going to the basketball game tomorrow?",
  
  // Academic
  "That assignment was harder than expected",
  "Office hours tomorrow at 2 PM if anyone needs help",
  "Don't forget the quiz next week!",
  "Group project meeting at 4?",
  "The reading for tomorrow is really interesting",
  "Anyone else finding this course challenging?",
  "Study group forming for organic chemistry",
  
  // Events/activities
  "There's a great concert this Friday",
  "Club meeting moved to next Wednesday",
  "Intramural soccer signups are open!",
  "Movie night in the common room tonight",
  "Free pizza at the career fair!",
  "Yoga class starts in 20 minutes",
  "Anyone interested in hiking this weekend?"
];

const generateUser = (id: string) => ({
  id,
  name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
  major: majors[Math.floor(Math.random() * majors.length)],
  avatar: undefined,
  isOnline: Math.random() > 0.6
});

const generateMessage = (id: string, senderId: string, senderName: string, timestamp: Date): ChatMessage => ({
  id,
  sender_id: senderId,
  sender_name: senderName,
  message: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
  timestamp: timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }),
  created_at: timestamp.toISOString(),
  is_own: senderId === 'current-user'
});

export const generateMockChatData = (schoolName: string) => {
  // Generate 15-30 users
  const userCount = Math.floor(Math.random() * 16) + 15;
  const users = Array.from({ length: userCount }, (_, i) => generateUser(`user-${i}`));
  
  // Add current user
  const currentUser = {
    id: 'current-user',
    name: 'You',
    major: 'Computer Science',
    avatar: undefined,
    isOnline: true
  };
  
  users.push(currentUser);

  // Generate group chat messages (60-120 messages)
  const groupMessageCount = Math.floor(Math.random() * 61) + 60;
  const groupMessages: ChatMessage[] = [];
  
  for (let i = 0; i < groupMessageCount; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const timestamp = new Date(Date.now() - (groupMessageCount - i) * 15 * 60 * 1000); // 15 min intervals
    
    groupMessages.push(generateMessage(
      `group-msg-${i}`,
      user.id,
      user.name,
      timestamp
    ));
  }

  // Generate DM conversations (5-8 conversations)
  const conversationCount = Math.floor(Math.random() * 4) + 5;
  const conversations: Conversation[] = [];
  const dmMessages: { [key: string]: ChatMessage[] } = {};

  for (let i = 0; i < conversationCount; i++) {
    const otherUser = users[i % (users.length - 1)]; // Exclude current user
    const conversationId = `conv-${i}`;
    
    // Generate 5-20 messages per conversation
    const messageCount = Math.floor(Math.random() * 16) + 5;
    const convMessages: ChatMessage[] = [];
    
    for (let j = 0; j < messageCount; j++) {
      const isFromOther = Math.random() > 0.4; // 60% from other user, 40% from current user
      const sender = isFromOther ? otherUser : currentUser;
      const timestamp = new Date(Date.now() - (messageCount - j) * 30 * 60 * 1000); // 30 min intervals
      
      convMessages.push(generateMessage(
        `${conversationId}-msg-${j}`,
        sender.id,
        sender.name,
        timestamp
      ));
    }
    
    dmMessages[conversationId] = convMessages;
    
    const lastMessage = convMessages[convMessages.length - 1];
    conversations.push({
      conversation_id: conversationId,
      title: otherUser.name,
      type: 'dm',
      last_message_at: lastMessage.created_at,
      last_message_text: lastMessage.message,
      unread_count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      other_user_avatar: otherUser.avatar
    });
  }

  // Sort conversations by last message time
  conversations.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

  const groupChat: GroupChatSummary = {
    conversation_id: 'group-chat',
    title: `${schoolName} Group Chat`,
    member_count: userCount + 1,
    is_member: true
  };

  return {
    users,
    groupChat,
    groupMessages,
    conversations,
    dmMessages
  };
};