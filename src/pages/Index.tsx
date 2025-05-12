
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, MessageCircle } from 'lucide-react';
import SymptomChecker from '@/components/SymptomChecker';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container px-4 py-2 mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-2 bg-health-light text-health-primary border-health-primary">No Login Required</Badge>
          <h1 className="text-4xl font-bold text-health-dark mb-4">Private Healthcare Made Simple</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Get connected to healthcare professionals quickly and anonymously without creating an account.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/history')}
              variant="outline" 
              className="border-health-primary text-health-primary"
            >
              View My History
            </Button>
            <Button 
              onClick={() => navigate('/privacy')}
              variant="outline"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-health-light border-0">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-full bg-health-primary text-white flex items-center justify-center mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">Privacy Focused</h3>
              <p className="text-sm text-muted-foreground">
                No login required. Everything stays anonymous and only on your device.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-health-light border-0">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-full bg-health-primary text-white flex items-center justify-center mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">Secure by Design</h3>
              <p className="text-sm text-muted-foreground">
                All data is encrypted and we collect only what's needed for your consultation.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-health-light border-0">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-full bg-health-primary text-white flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">Simple Booking</h3>
              <p className="text-sm text-muted-foreground">
                Describe symptoms, get matched with specialists, and book consultations in minutes.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-health-primary/10 p-4 border-b border-health-primary/20">
              <h2 className="text-xl font-semibold text-health-dark mb-1">Tell us about your symptoms</h2>
              <p className="text-sm text-muted-foreground">
                Chat with our symptom checker to find the right specialist for your needs.
              </p>
            </div>
            <div className="h-[500px] overflow-y-auto">
              <SymptomChecker />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
