import React, { useEffect } from 'react';
import DoctorLoginComponent from '@/components/DoctorLogin';
import { useDoctor } from '@/context/DoctorContext';
import { useNavigate } from 'react-router-dom';

const DoctorLoginPage: React.FC = () => {
  const { isAuthenticated } = useDoctor();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/doctor-dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-health-primary">Doctor Portal</h1>
        <p className="text-muted-foreground mt-2">
          Access your appointments and patient information
        </p>
      </div>
      <DoctorLoginComponent />
    </div>
  );
};

export default DoctorLoginPage; 