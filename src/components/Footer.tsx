
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="w-full py-6 px-6 mt-auto bg-muted">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © 2025 MediConnect. Privacy-Focused Healthcare
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button onClick={() => navigate('/')} className="text-health-primary hover:underline">
              Home
            </button>
            <button onClick={() => navigate('/privacy')} className="text-health-primary hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/terms')} className="text-health-primary hover:underline">
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
