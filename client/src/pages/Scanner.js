import React from 'react';
import QRScanner from '../components/QRScanner';

const Scanner = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">QR Code Scanner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Use this scanner to verify QR codes and check-in attendees at the event venue. 
          You can either scan a QR code using your camera or manually enter the QR code data.
        </p>
      </div>
      
      <QRScanner />
    </div>
  );
};

export default Scanner;