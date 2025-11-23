import React from 'react';
import { Account } from '../types';
import AccountItem from './AccountItem';

interface AccountListProps {
  accounts: Account[];
  onDeleteAccount: (id: string) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, onDeleteAccount }) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-xl font-semibold text-white">No Accounts Yet</h2>
        <p className="text-gray-400 mt-2">Click the '+' button to add your first 2FA account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map(account => (
        <AccountItem
          key={account.id}
          account={account}
          onDelete={onDeleteAccount}
        />
      ))}
    </div>
  );
};

export default AccountList;
