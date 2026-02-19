'use client';

import { useEffect } from 'react';

// This is necessary to make TypeScript happy with the custom web component
// and to prevent it from stripping props.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vipps-mobilepay-button': any;
    }
  }
}

interface VippsDonateButtonProps {
  amount: number;
  onClick: () => void;
  loading: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  verb?: 'donate' | 'pay' | 'checkout';
  stretched?: boolean;
}

export function VippsDonateButton({
  amount,
  onClick,
  loading,
  variant = 'primary',
  verb = 'donate',
  stretched = true,
}: VippsDonateButtonProps) {
  useEffect(() => {
    const scriptId = 'vipps-checkout-script';
    // Check if the script is already in the document to avoid duplicates
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.vipps.no/checkout-button/v1/vipps-checkout-button.js';
      script.type = 'module';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <vipps-mobilepay-button
      variant={variant}
      verb={verb}
      language="no"
      brand="vipps"
      amount={amount}
      loading={loading.toString()}
      onClick={onClick}
      stretched={stretched}
    ></vipps-mobilepay-button>
  );
}
