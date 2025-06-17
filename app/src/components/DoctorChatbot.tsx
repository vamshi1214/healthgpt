import React, { useState, useEffect } from 'react';
import { ChatInterface } from './ui/ChatInterface';
import { designTokens } from '../lib/design-tokens';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isEmergency?: boolean;
}

export const DoctorChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m HealthGPT, your medical AI assistant. How can I help you today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      // Call your API endpoint here
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      // Add AI response
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          isEmergency: data.isEmergency,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
    />
  );
};