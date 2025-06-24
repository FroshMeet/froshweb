
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Send, Plus } from "lucide-react";

const ChatInterface = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const chats = [
    {
      id: 1,
      name: "UCLA CS Study Group",
      type: "group",
      members: 12,
      lastMessage: "Anyone want to study for the midterm tomorrow?",
      lastTime: "2 min ago",
      unread: 3,
      avatar: "👥"
    },
    {
      id: 2,
      name: "Sarah Chen",
      type: "direct",
      lastMessage: "Hey! Want to grab coffee later?",
      lastTime: "10 min ago",
      unread: 1,
      avatar: "photo-1649972904349-6e44c42644a7"
    },
    {
      id: 3,
      name: "Westwood Roommate Search",
      type: "group",
      members: 24,
      lastMessage: "Found a great 2BR apartment near campus!",
      lastTime: "1 hour ago",
      unread: 0,
      avatar: "🏠"
    },
    {
      id: 4,
      name: "Alex Rivera",
      type: "direct",
      lastMessage: "Thanks for the study notes!",
      lastTime: "3 hours ago",
      unread: 0,
      avatar: "photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 5,
      name: "UCLA Hiking Club",
      type: "group",
      members: 8,
      lastMessage: "Weekend hike to Malibu Creek?",
      lastTime: "1 day ago",
      unread: 0,
      avatar: "⛰️"
    }
  ];

  const mockMessages = [
    {
      id: 1,
      sender: "Sarah Chen",
      message: "Hey everyone! Who's ready for the algorithms exam?",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      message: "I'm so nervous! Been studying all week 😅",
      time: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Alex Rivera",
      message: "Same here! Want to do a quick review session before?",
      time: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "Maya Patel",
      message: "Count me in! Library 3rd floor?",
      time: "10:36 AM",
      isOwn: false
    },
    {
      id: 5,
      sender: "You",
      message: "Perfect! See you there in 30 mins",
      time: "10:38 AM",
      isOwn: true
    }
  ];

  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=40&h=40&fit=crop&crop=face`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[70vh]">
      {/* Chat List */}
      <Card className="md:col-span-1 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === chat.id ? "bg-blue-50 border-r-2 border-blue-600" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {chat.avatar.startsWith("photo-") ? (
                      <img
                        src={getUnsplashUrl(chat.avatar)}
                        alt={chat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg">
                        {chat.avatar}
                      </div>
                    )}
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">{chat.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.type === "group" && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {chat.members}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm">
        {selectedChat ? (
          <>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center space-x-3">
                {selectedChat.avatar.startsWith("photo-") ? (
                  <img
                    src={getUnsplashUrl(selectedChat.avatar)}
                    alt={selectedChat.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg">
                    {selectedChat.avatar}
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{selectedChat.name}</CardTitle>
                  {selectedChat.type === "group" && (
                    <p className="text-sm text-muted-foreground">{selectedChat.members} members</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {!msg.isOwn && (
                        <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatInterface;
