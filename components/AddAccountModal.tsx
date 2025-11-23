import React, { useState } from 'react';
import { Account } from '../types';
import { XIcon } from './icons';

interface AddAccountModalProps {
  onAddAccount: (account: Omit<Account, 'id'>) => void;
  onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ onAddAccount, onClose }) => {
  const [issuer, setIssuer] = useState('');
  const [accountName, setAccountName] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuer.trim() || !accountName.trim() || !secret.trim()) {
      setError('All fields are required.');
      return;
    }
    const sanitizedSecret = secret.replace(/\s/g, '').toUpperCase();
    const base32Regex = /^[A-Z2-7=]+$/;
    if (!base32Regex.test(sanitizedSecret)) {
        setError('Invalid secret key format. It should only contain Base32 characters (A-Z, 2-7).');
        return;
    }

    onAddAccount({ issuer, accountName, secret: sanitizedSecret });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full"
          aria-label="Close modal"
        >
          <XIcon />
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">Add New Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="issuer" className="block text-sm font-medium text-gray-300">Issuer</label>
            <input
              type="text"
              id="issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g., Google, GitHub"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-300">Account Name</label>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., user@example.com"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-gray-300">Secret Key</label>
            <input
              type="text"
              id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your secret key"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end pt-2 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
