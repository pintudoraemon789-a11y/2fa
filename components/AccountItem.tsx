import React, { useState } from 'react';
import { Account } from '../types';
import { useTOTP } from '../hooks/useTOTP';
import { CopyIcon, CheckIcon, TrashIcon } from './icons';

interface AccountItemProps {
  account: Account;
  onDelete: (id: string) => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ account, onDelete }) => {
  const { code, remainingTime, period } = useTOTP(account.secret);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const plainCode = code.replace(/\s/g, '');
    if (navigator.clipboard && plainCode.match(/^\d{6}$/)) {
      navigator.clipboard.writeText(plainCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const progressPercentage = (remainingTime / period) * 100;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-gray-700/50">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{account.issuer}</p>
          <p className="font-medium text-white">{account.accountName}</p>
        </div>
        <button 
          onClick={() => onDelete(account.id)}
          className="text-gray-500 hover:text-red-500 p-1 rounded-full transition-colors"
          aria-label="Delete account"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="text-4xl font-mono tracking-wider text-indigo-400">{code}</p>
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-lg transition-colors"
          aria-label="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1 mt-4">
        <div
          className="bg-indigo-500 h-1 rounded-full transition-all duration-1000 linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AccountItem;
