
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';

interface Message {
  content: string;
  sender: 'bot' | 'user';
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { content: 'How can I help?', sender: 'bot' }
  ]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { content: message, sender: 'user' }]);
    
    // Clear input
    setMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "I'm an AI assistant for Index Insights. How can I help you with indices today?",
        "You can ask me about index calculations, data sources, or general index questions.",
        "Would you like to know more about a specific index?",
        "I can help you understand the index construction methodology.",
        "Is there something specific about this index you'd like to know?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { content: randomResponse, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full p-3 bg-teal-500 hover:bg-teal-600 shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
          <CardHeader className="py-3 px-4 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Index Insights Assistant</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-3">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="sm" className="bg-teal-500 hover:bg-teal-600">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
