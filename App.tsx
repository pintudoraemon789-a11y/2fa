import React, { useState, useCallback } from 'react';
import { useTOTP } from './hooks/useTOTP';
import { CopyIcon, CheckIcon, ArrowLeftIcon } from './components/icons';

// Komponen untuk menampilkan kode
const CodeDisplay = ({ secret, onClear }: { secret: string; onClear: () => void; }) => {
  const { code, remainingTime } = useTOTP(secret);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (code !== 'Invalid' && code.match(/^\d{6}$/)) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [code]);

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center text-white w-full max-w-sm flex flex-col items-center relative transition-all duration-300 animate-fade-in">
      <button 
        onClick={onClear} 
        className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors"
        aria-label="Kembali"
      >
        <ArrowLeftIcon />
      </button>
      <div 
        className="cursor-pointer group"
        onClick={handleCopy}
        role="button"
        tabIndex={0}
        aria-label="Salin kode"
      >
        <p className="text-6xl md:text-7xl font-mono tracking-widest">{code === 'Invalid' ? '------' : code}</p>
        <div className="flex items-center justify-center h-6 mt-2 text-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          {copied ? (
            <div className="flex items-center text-green-300 animate-fade-in-up">
              <CheckIcon />
              <span className="ml-2">Tersalin!</span>
            </div>
          ) : (
             <div className="flex items-center">
              <CopyIcon />
              <span className="ml-2">Salin</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-black bg-opacity-25 px-4 py-2 rounded-full text-base">
        Berlaku {remainingTime} detik lagi
      </div>
    </div>
  );
};

// Komponen untuk mengatur kunci rahasia
const SecretSetup = ({ onSave }: { onSave: (secret: string) => void; }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedSecret = inputValue.replace(/\s/g, '').toUpperCase();
    const base32Regex = /^[A-Z2-7=]+$/;

    if (!sanitizedSecret) {
      setError('Kunci Bom Nuklir tidak boleh kosong.');
      return;
    }
    if (!base32Regex.test(sanitizedSecret)) {
      setError('Format Kunci Bom Nuklir tidak valid. Gunakan karakter Base32 (A-Z, 2-7).');
      return;
    }
    
    onSave(sanitizedSecret);
  };

  return (
     <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-sm transition-all duration-300 animate-fade-in">
        <h1 className="text-2xl font-bold text-center text-white mb-6">Jangan Kepo Bujang!!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-gray-200 mb-1">Kunci Bom Nuklir</label>
            <input
              type="text"
              id="secret"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError('');
              }}
              placeholder="Masukkan Kunci Bom Nuklir Anda"
              className="mt-1 block w-full bg-gray-900/30 border border-gray-500/50 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              aria-describedby="secret-error"
            />
          </div>
          {error && <p id="secret-error" className="text-red-300 text-sm">{error}</p>}
          <div className="flex justify-end pt-2">
            <button type="submit" className="w-full px-4 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">
              Tampilkan Kode
            </button>
          </div>
        </form>
     </div>
  );
};


const App: React.FC = () => {
  const [secret, setSecret] = useState<string | null>(null);

  const handleSetSecret = useCallback((newSecret: string) => {
    setSecret(newSecret);
  }, []);

  const handleGoBack = useCallback(() => {
    setSecret(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-md flex-grow flex items-center justify-center">
        {secret ? (
          <CodeDisplay secret={secret} onClear={handleGoBack} />
        ) : (
          <SecretSetup onSave={handleSetSecret} />
        )}
      </main>
    </div>
  );
};

export default App;
