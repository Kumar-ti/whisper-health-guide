
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Check, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConsultation } from '@/context/ConsultationContext';
import { getCommonSymptoms, extractKeywords } from '@/utils/symptomMatching';

// Chat message types
type MessageType = 'bot' | 'user' | 'action';

interface Message {
  type: MessageType;
  text: string;
}

const SymptomChecker: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentSymptoms, addSymptom, clearSymptoms } = useConsultation();
  
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hi there! I\'m here to help you find the right doctor. Could you describe your symptoms?' }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedSymptoms, setSuggestedSymptoms] = useState<string[]>([]);
  const [readyForRecommendation, setReadyForRecommendation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load common symptoms for suggestions
  useEffect(() => {
    setSuggestedSymptoms(getCommonSymptoms().slice(0, 5));
  }, []);
  
  // Check if we have enough symptoms to show recommendation button
  useEffect(() => {
    if (currentSymptoms.length >= 3) {
      setReadyForRecommendation(true);
    } else {
      setReadyForRecommendation(false);
    }
  }, [currentSymptoms]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle user input submission
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue('');
    setIsProcessing(true);
    
    // Extract symptoms from user input with more comprehensive analysis
    setTimeout(() => {
      const keywords = extractKeywords(userMessage);
      
      // If keywords found, add them as symptoms
      if (keywords.length > 0) {
        keywords.forEach(keyword => {
          addSymptom(keyword);
        });
        
        // Update messages based on total symptoms count
        const updatedSymptomCount = [...currentSymptoms, ...keywords.filter(k => !currentSymptoms.includes(k))].length;
        
        if (updatedSymptomCount >= 3) {
          setMessages(prev => [
            ...prev,
            { 
              type: 'bot', 
              text: `I've identified these symptoms: ${keywords.join(', ')}. Based on your symptoms, I can recommend suitable doctors now.` 
            },
            {
              type: 'action',
              text: 'view_doctors'
            }
          ]);
        } else {
          // We need more symptoms
          const remainingSymptoms = 3 - updatedSymptomCount;
          setMessages(prev => [
            ...prev, 
            { 
              type: 'bot', 
              text: `I've identified these symptoms: ${keywords.join(', ')}. To provide accurate doctor recommendations, I need ${remainingSymptoms} more symptom${remainingSymptoms > 1 ? 's' : ''}. Could you tell me more about how you're feeling?` 
            }
          ]);
        }
      } else {
        // No keywords found, ask for more specific symptoms
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'I need some more specific information about your symptoms. Could you provide more details about what you\'re experiencing?' 
        }]);
      }
      
      setIsProcessing(false);
    }, 1000);
  };
  
  // Add a suggested symptom
  const handleAddSuggestion = (symptom: string) => {
    // Add to current symptoms
    addSymptom(symptom.toLowerCase());
    
    // Add to chat
    setMessages(prev => [
      ...prev, 
      { type: 'user', text: `I have ${symptom}` },
      { type: 'bot', text: `Got it, I've added ${symptom} to your symptoms.` }
    ]);
    
    // Update suggested symptoms (remove the one selected)
    setSuggestedSymptoms(prev => prev.filter(s => s !== symptom));
    
    // Check if we have enough symptoms now
    if (currentSymptoms.length + 1 >= 3) {  // +1 because the current symptom might not be in state yet
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          text: 'Great! I now have enough information to recommend suitable doctors for you.'
        },
        {
          type: 'action',
          text: 'view_doctors'
        }
      ]);
    } else {
      // We need more symptoms
      const remainingSymptoms = 3 - (currentSymptoms.length + 1);
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          text: `I need ${remainingSymptoms} more symptom${remainingSymptoms > 1 ? 's' : ''} to provide accurate doctor recommendations. Any other symptoms you're experiencing?`
        }
      ]);
    }
  };
  
  // Handle finding doctors
  const handleFindDoctors = () => {
    if (currentSymptoms.length < 3) {
      toast({
        title: "Not enough symptoms",
        description: "Please describe at least 3 symptoms so we can recommend the right doctors.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to doctor recommendations
    navigate('/doctors');
  };
  
  // Handle clearing symptoms
  const handleClearSymptoms = () => {
    clearSymptoms();
    setMessages([{ type: 'bot', text: 'I\'ve cleared your symptoms. Could you describe your symptoms again? I\'ll need at least 3 symptoms to recommend doctors.' }]);
    setSuggestedSymptoms(getCommonSymptoms().slice(0, 5));
    setReadyForRecommendation(false);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="chat-container">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat-message ${message.type === 'bot' ? 'bot-message' : message.type === 'user' ? 'user-message' : ''}`}
            >
              {message.type === 'action' && message.text === 'view_doctors' && readyForRecommendation ? (
                <Button 
                  onClick={handleFindDoctors} 
                  className="bg-health-primary hover:bg-health-dark mt-2 w-full"
                >
                  View Recommended Doctors
                </Button>
              ) : (
                message.text
              )}
            </div>
          ))}
          {isProcessing && (
            <div className="chat-message bot-message">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-health-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-health-primary animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-health-primary animate-pulse delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Symptom suggestions */}
      {suggestedSymptoms.length > 0 && (
        <div className="px-4 py-2 border-t">
          <p className="text-sm text-muted-foreground mb-2">Common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSymptoms.map((symptom, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddSuggestion(symptom)}
                className="flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" />
                {symptom}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Current symptoms */}
      {currentSymptoms.length > 0 && (
        <Card className="mx-4 my-2 p-3 bg-health-light border border-health-primary">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Your symptoms ({currentSymptoms.length}/3 required):</h4>
            <Button variant="ghost" size="sm" onClick={handleClearSymptoms} className="h-6 text-xs">
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentSymptoms.map((symptom, index) => (
              <div 
                key={index} 
                className="bg-white text-health-primary text-xs rounded-full px-3 py-1 flex items-center border border-health-primary"
              >
                <Check className="h-3 w-3 mr-1 text-health-primary" />
                {symptom}
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Input area */}
      <div className="p-4 border-t flex items-center gap-2">
        <Input
          placeholder="Type your symptoms here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1"
          disabled={isProcessing}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isProcessing || !inputValue.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SymptomChecker;
