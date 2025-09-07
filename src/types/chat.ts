/**
 * Type definitions for the chat system
 */

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  avatar_url?: string;
  message: string;
  timestamp: string;
  created_at: string;
  is_own: boolean;
  reply_to_id?: string;
}

export interface Conversation {
  conversation_id: string;
  title: string;
  type: 'dm' | 'group';
  last_message_at: string;
  last_message_text: string;
  unread_count: number;
  other_user_avatar?: string;
}

export interface GroupChatSummary {
  conversation_id: string;
  title: string;
  member_count: number;
  is_member: boolean;
}

export interface User {
  id: string;
  name: string;
  major: string;
  avatar?: string;
  isOnline: boolean;
}