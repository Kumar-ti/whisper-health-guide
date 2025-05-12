
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useConsultation } from '@/context/ConsultationContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetBookingData, pastConsultations } = useConsultation();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Show back button only if not on home page
  const showBackButton = location.pathname !== '/';
  const isHome = location.pathname === '/';
  const isBooking = location.pathname === '/booking';
  
  // Custom message based on current route
  const getDialogMessage = () => {
    if (isBooking) {
      return "If you navigate to home now, your current booking will be canceled. Are you sure you want to proceed?";
    }
    return "Are you sure you want to go back to the home page?";
  };

  // Handle home button click
  const handleHomeClick = () => {
    if (isHome) {
      // If already at home, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // For other pages, show dialog
      setDialogOpen(true);
    }
  };

  // Handle confirmation to go home
  const confirmGoHome = () => {
    if (isBooking) {
      // If in booking flow, reset booking data
      resetBookingData();
    }
    navigate('/');
    setDialogOpen(false);
  };
  
  // History count for badge
  const scheduledCount = pastConsultations.filter(c => c.status === 'scheduled').length;
  
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
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHomeClick}
          className="text-health-primary hover:text-health-primary hover:bg-health-light"
          aria-label="Go to home"
        >
          <Home className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/history')}
          className="text-health-primary hover:text-health-primary hover:bg-health-light relative"
        >
          View History
          {scheduledCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-health-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {scheduledCount}
            </span>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return to Home?</AlertDialogTitle>
            <AlertDialogDescription>
              {getDialogMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGoHome}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
