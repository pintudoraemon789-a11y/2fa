import { useState, useEffect, useMemo } from 'react';
import { TOTP } from 'otpauth';

export const useTOTP = (secret: string) => {
  const [code, setCode] = useState<string>('------');
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const period = 30; // Standard TOTP period

  const totp = useMemo(() => {
    // Basic Base32 validation
    const base32Regex = /^[A-Z2-7=]+$/i;
    if (!secret || !base32Regex.test(secret)) {
      return null;
    }
    try {
      // otpauth.js handles Base32 decoding internally
      return new TOTP({
        algorithm: 'SHA1',
        digits: 6,
        period: period,
        secret: secret,
      });
    } catch (e) {
      console.error('Invalid secret key:', e);
      return null;
    }
  }, [secret]);

  useEffect(() => {
    if (!totp) {
        setCode('Invalid');
        setRemainingTime(0);
        return;
    }

    const updateCode = () => {
      try {
        const newCode = totp.generate();
        const seconds = Math.floor(Date.now() / 1000);
        const newRemaining = period - (seconds % period);
        
        setCode(newCode);
        setRemainingTime(newRemaining);
      } catch (e) {
        console.error("Error generating token:", e);
        setCode('Error');
        setRemainingTime(0);
      }
    };

    updateCode(); // Initial update
    const intervalId = setInterval(updateCode, 1000);

    return () => clearInterval(intervalId);
  }, [totp]);

  return { code, remainingTime, period };
};