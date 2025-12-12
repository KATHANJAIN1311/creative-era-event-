import React, { useState, useRef } from 'react';
import { checkinsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { QrCode, Camera, CheckCircle, XCircle, User } from 'lucide-react';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const fileInputRef = useRef(null);

  const handleScan = async (qrData) => {
    try {
      const response = await checkinsAPI.verify(qrData);
      
      if (response.data.alreadyCheckedIn) {
        toast.error('Already checked in!');
        setResult({
          success: false,
          message: 'Already checked in',
          registration: response.data.registration
        });
      } else {
        toast.success('Check-in successful!');
        setResult({
          success: true,
          message: 'Check-in successful',
          registration: response.data.registration
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid QR code';
      toast.error(errorMessage);
      setResult({
        success: false,
        message: errorMessage
      });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
      setManualInput('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // This is a simplified approach - in production, you'd use a proper QR code reader library
          toast.info('Please use manual input for QR code data');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setScanning(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <QrCode className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">QR Code Scanner</h2>
        <p className="text-gray-600">Scan or enter QR code data for check-in</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          {/* Manual Input */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR Code Data or Registration ID
              </label>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter QR data or Registration ID..."
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: registrationId|eventId or just registrationId
              </p>
            </div>
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Verify & Check In
            </button>
          </form>

          <div className="text-center text-gray-500">
            <span>or</span>
          </div>

          {/* File Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Upload QR Code Image</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {result.success ? (
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          ) : (
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          )}
          
          <h3 className={`text-xl font-semibold mb-2 ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.message}
          </h3>
          
          {result.registration && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-medium">{result.registration.name}</span>
              </div>
              <p className="text-sm text-gray-600">{result.registration.email}</p>
              <p className="text-sm text-gray-600">{result.registration.phone}</p>
            </div>
          )}
          
          <button
            onClick={resetScanner}
            className="btn-primary"
          >
            Scan Another Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;