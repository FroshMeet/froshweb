
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const IncomingRequests = ({ requests, onAccept, onReject }) => {
  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=60&h=60&fit=crop&crop=face`;
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No new message requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-800">New Message Requests</h3>
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <img
                src={getUnsplashUrl(request.avatar)}
                alt={request.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-800">{request.name}</h4>
                <div className="flex space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">{request.major}</Badge>
                  <Badge variant="outline" className="text-xs">{request.dorm}</Badge>
                </div>
                <p className="text-sm text-slate-600 truncate">{request.message}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onAccept(request)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(request.id)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IncomingRequests;
