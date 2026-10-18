import React from 'react';

export default function BrandLogo({ className = 'h-24 w-24', alt = 'PocketLedger Expense Manager' }) {
  return <img src="/brand/pocketledger-logo-final.png" className={`block object-contain bg-transparent border-0 ${className}`} alt={alt} />;
}
