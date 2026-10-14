import React from 'react';

export default function BrandMark({ className = 'h-7 w-7', alt = 'PocketLedger' }) {
  return <img src="/brand/pocketledger-mark.svg" className={className} alt={alt} />;
}
