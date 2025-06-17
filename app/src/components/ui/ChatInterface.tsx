import React from 'react';
import styled from '@emotion/styled';
import { designTokens } from '../../lib/design-tokens';

const MainContainer = styled.div`
  min-height: 100vh;
  background: ${designTokens.colors.background};
  padding: ${designTokens.spacing.lg};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 3px;
    background: ${designTokens.colors.gradients.border};
    border-radius: ${designTokens.borderRadius.lg};
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
  }
`;

const ContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${designTokens.spacing.lg};
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${designTokens.spacing.md};
  padding: ${designTokens.spacing.lg} 0;
`;

const SparkleIcon = styled.span`
  font-size: 24px;
  color: ${designTokens.colors.primary};
`;

const Title = styled.h1`
  font-family: ${designTokens.typography.fontFamily};
  font-size: ${designTokens.typography.heading.size};
  font-weight: ${designTokens.typography.heading.weight};
  color: ${designTokens.colors.text.primary};
  text-align: center;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${designTokens.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${designTokens.spacing.md};
`;

const UserMessage = styled.div`
  align-self: flex-end;
  background: ${designTokens.colors.surface};
  padding: ${designTokens.spacing.md} ${designTokens.spacing.lg};
  border-radius: ${designTokens.borderRadius.lg} ${designTokens.borderRadius.lg} ${designTokens.borderRadius.sm} ${designTokens.borderRadius.lg};
  max-width: 70%;
  margin-bottom: ${designTokens.spacing.sm};
  font-family: ${designTokens.typography.fontFamily};
  font-size: ${designTokens.typography.chat.size};
  color: ${designTokens.colors.text.primary};
`;

const AIMessage = styled.div`
  align-self: flex-start;
  background: ${designTokens.colors.gradients.aiMessage};
  padding: ${designTokens.spacing.lg} ${designTokens.spacing.xl};
  border-radius: ${designTokens.borderRadius.lg} ${designTokens.borderRadius.lg} ${designTokens.borderRadius.lg} ${designTokens.borderRadius.sm};
  max-width: 80%;
  margin-bottom: ${designTokens.spacing.md};
  font-family: ${designTokens.typography.fontFamily};
  font-size: ${designTokens.typography.chat.size};
  color: ${designTokens.colors.text.primary};
  
  .ai-label {
    font-size: 12px;
    font-weight: 600;
    color: ${designTokens.colors.primary};
    margin-bottom: ${designTokens.spacing.sm};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  gap: ${designTokens.spacing.md};
  align-items: center;
  background: ${designTokens.colors.surface};
  border: 1px solid #E5E7EB;
  border-radius: ${designTokens.borderRadius.xl};
  padding: ${designTokens.spacing.md} ${designTokens.spacing.lg};
  margin-top: auto;
  
  &:focus-within {
    border-color: ${designTokens.colors.primary};
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const ChatInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-family: ${designTokens.typography.fontFamily};
  font-size: ${designTokens.typography.chat.size};
  color: ${designTokens.colors.text.primary};
  
  &::placeholder {
    color: ${designTokens.colors.text.secondary};
  }
  
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  background: ${designTokens.colors.primary};
  border: none;
  border-radius: ${designTokens.borderRadius.full};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #7C3AED;
    transform: scale(1.05);
  }
  
  svg {
    color: white;
    width: 16px;
    height: 16px;
  }
`;

const EmergencyAlert = styled.div`
  background: ${designTokens.colors.gradients.emergency};
  border: 2px solid #EF4444;
  border-radius: ${designTokens.borderRadius.md};
  padding: ${designTokens.spacing.lg};
  margin: ${designTokens.spacing.md} 0;
  
  .emergency-icon {
    color: #EF4444;
    font-size: 20px;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: ${designTokens.spacing.xs};
  padding: ${designTokens.spacing.lg} ${designTokens.spacing.xl};
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${designTokens.colors.primary};
    animation: pulse 1.4s infinite;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.5; }
  }
`;

interface ChatInterfaceProps {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    isEmergency?: boolean;
  }>;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <Header>
          <SparkleIcon>✨</SparkleIcon>
          <Title>Ask our AI anything</Title>
        </Header>
        
        <ChatContainer>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {message.isEmergency && (
                <EmergencyAlert>
                  <span className="emergency-icon">⚠️</span>
                  <p>This appears to be a medical emergency. Please seek immediate medical attention.</p>
                </EmergencyAlert>
              )}
              {message.role === 'user' ? (
                <UserMessage>{message.content}</UserMessage>
              ) : (
                <AIMessage>
                  <div className="ai-label">HealthGPT</div>
                  {message.content}
                </AIMessage>
              )}
            </React.Fragment>
          ))}
          {isLoading && (
            <TypingIndicator>
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </TypingIndicator>
          )}
        </ChatContainer>
        
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <ChatInput
              type="text"
              placeholder="Ask me anything about your health..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <SendButton type="submit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </SendButton>
          </InputContainer>
        </form>
      </ContentWrapper>
    </MainContainer>
  );
}; 