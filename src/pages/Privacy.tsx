
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Privacy: React.FC = () => {
  return (
    <div className="container px-4 py-6 mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h3>Our Privacy-First Approach</h3>
          <p>
            At MediConnect, we believe healthcare should be accessible without compromising your privacy.
            Our application is designed to collect minimal personal information while still providing
            high-quality healthcare consultation services.
          </p>
          
          <Separator className="my-4" />
          
          <h3>How We Protect Your Privacy</h3>
          <ul className="space-y-2">
            <li>
              <strong>No Account Required:</strong> Use our service without creating an account or providing
              personal identifiers like email or phone number.
            </li>
            <li>
              <strong>Anonymous Identifier:</strong> We generate a random token stored only on your device
              to maintain your consultation history.
            </li>
            <li>
              <strong>Minimal Data Collection:</strong> We only collect information necessary for your
              consultation (symptoms and doctor preferences).
            </li>
            <li>
              <strong>Device-Only Storage:</strong> Your consultation history is stored locally on your
              device, not on our servers.
            </li>
            <li>
              <strong>Encryption:</strong> All data transmitted is encrypted using industry-standard protocols.
            </li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3>Data We Collect</h3>
          <ul className="space-y-2">
            <li>
              <strong>Symptom Information:</strong> To provide appropriate doctor recommendations.
            </li>
            <li>
              <strong>Consultation Preferences:</strong> Your selected doctor, appointment time, and
              consultation mode.
            </li>
            <li>
              <strong>Device Token:</strong> A randomly generated anonymous identifier stored on your device.
            </li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3>Data Retention</h3>
          <p>
            Since all your data is stored locally on your device, data retention is controlled by you.
            You can clear your browser data at any time to remove all stored information.
          </p>
          
          <Separator className="my-4" />
          
          <h3>Your Rights</h3>
          <ul className="space-y-2">
            <li>
              <strong>Right to Access:</strong> Your data is already accessible to you through the app interface.
            </li>
            <li>
              <strong>Right to Delete:</strong> Clear your browser data to remove all stored information.
            </li>
            <li>
              <strong>Right to Portability:</strong> Currently not applicable as data is stored only on your device.
            </li>
          </ul>
          
          <Separator className="my-4" />
          
          <h3>Changes to This Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page.
          </p>
          
          <Separator className="my-4" />
          
          <h3>Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@mediconnect-example.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
