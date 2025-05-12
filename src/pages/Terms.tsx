
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Terms: React.FC = () => {
  return (
    <div className="container px-4 py-6 mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            By using the MediConnect application, you agree to these Terms of Use.
            Please read them carefully.
          </p>
          
          <Separator className="my-4" />
          
          <h3>Service Description</h3>
          <p>
            MediConnect is a healthcare consultation booking platform that connects users with healthcare
            professionals. Our service allows you to describe your symptoms, receive doctor recommendations,
            and book consultations without creating an account.
          </p>
          
          <Separator className="my-4" />
          
          <h3>Medical Disclaimer</h3>
          <p>
            MediConnect is not a substitute for professional medical advice, diagnosis, or treatment.
            The content provided through our service is for informational purposes only. Always seek
            the advice of your physician or other qualified health provider with any questions you
            may have regarding a medical condition.
          </p>
          
          <Separator className="my-4" />
          
          <h3>User Responsibilities</h3>
          <ul className="space-y-2">
            <li>
              Provide accurate symptom information to receive appropriate recommendations.
            </li>
            <li>
              Keep your appointment details in a safe place, as they are only stored on your device.
            </li>
            <li>
              Respect healthcare professionals during consultations and follow their medical advice.
            </li>
            <li>
              Do not use our service for emergency medical conditions that require immediate attention.
            </li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3>Anonymity and Local Storage</h3>
          <p>
            MediConnect uses anonymous identifiers stored locally on your device to maintain your
            consultation history. These identifiers are not linked to any personally identifiable
            information. By using our service, you acknowledge that:
          </p>
          <ul className="space-y-2">
            <li>
              If you clear your browser data or use a different device, your consultation history will not be accessible.
            </li>
            <li>
              We cannot recover your consultation history if the local data is lost.
            </li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3>Intellectual Property</h3>
          <p>
            All content, features, and functionality of MediConnect, including but not limited to
            text, graphics, logos, icons, and software, are the exclusive property of MediConnect
            and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          
          <Separator className="my-4" />
          
          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, MediConnect shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
            whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
            intangible losses resulting from your use or inability to use the service.
          </p>
          
          <Separator className="my-4" />
          
          <h3>Changes to Terms</h3>
          <p>
            We may update our Terms of Use from time to time. We will notify you of any changes by
            posting the new Terms of Use on this page.
          </p>
          
          <Separator className="my-4" />
          
          <h3>Contact Information</h3>
          <p>
            If you have any questions about these Terms of Use, please contact us at terms@mediconnect-example.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;
