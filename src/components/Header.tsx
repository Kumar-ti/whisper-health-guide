
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show back button only if not on home page
  const showBackButton = location.pathname !== '/';
  
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center">
          <span className="text-health-primary font-bold text-xl">MediConnect</span>
        </div>
      </div>
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/history')}
          className="text-health-primary hover:text-health-primary hover:bg-health-light"
        >
          View History
        </Button>
      </div>
    </header>
  );
};

export default Header;
