
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Hello! I\'m your ESG assistant. You can ask me about sustainability metrics, compliance requirements, or how to improve your ESG performance.',
      timestamp: new Date(),
    }
  ]);

  const handleSendMessage = async () => {
    if (!query.trim() || !user) return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: query,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Simulate AI response (in real app, this would call an AI service)
      // For now, use mock responses based on keywords
      let aiResponse = "I'm still learning about that topic. Can you ask something about ESG metrics, compliance, or sustainability goals?";
      
      if (query.toLowerCase().includes('sdg')) {
        aiResponse = "The Sustainable Development Goals (SDGs) are 17 global goals designed to be a blueprint for achieving a better and more sustainable future. Your company is currently tracking progress on 5 SDGs.";
      } else if (query.toLowerCase().includes('compliance')) {
        aiResponse = "Your company currently has 3 pending compliance issues that need attention. Would you like to review them?";
      } else if (query.toLowerCase().includes('ghg') || query.toLowerCase().includes('emission')) {
        aiResponse = "Your company's GHG emissions are currently being tracked across Scope 1, 2, and 3. Your Scope 1 emissions reduced by 5% compared to last quarter.";
      } else if (query.toLowerCase().includes('risk')) {
        aiResponse = "I've identified 4 ESG risks in your current operations. The highest risk area is in your supply chain sustainability.";
      }
      
      // Create AI response message
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      // Add to messages state
      setMessages((prev) => [...prev, aiMessage]);
      
      // Store in Supabase (in a real app)
      if (user) {
        await supabase.from('enterprise_ai_chats').insert([
          { 
            enterprise_id: user.id, 
            user_query: query,
            ai_response: aiResponse
          }
        ]);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-fandoro-green">
          AI Sustainability Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto pb-0">
        <ScrollArea className="h-[350px] pr-4">
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex items-center w-full gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your ESG metrics, compliance, or sustainability goals..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!query.trim() || isLoading}
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
