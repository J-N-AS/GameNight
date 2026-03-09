import { withBasePath } from './base-path';

export type DonationResponse = {
  status: 'success' | 'not_configured' | 'error';
  message?: string;
  checkoutFrontendUrl?: string;
};

const donationApiUrl = (() => {
  const configured = process.env.NEXT_PUBLIC_DONATION_API_URL?.trim();
  if (!configured) {
    return undefined;
  }

  if (configured.startsWith('/')) {
    return withBasePath(configured as `/${string}`);
  }

  return configured;
})();

export async function requestDonation(amount: number): Promise<DonationResponse> {
  if (!donationApiUrl) {
    return {
      status: 'not_configured',
      message: 'Donasjoner er ikke konfigurert.',
    };
  }

  const response = await fetch(donationApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  let data: DonationResponse;
  try {
    data = (await response.json()) as DonationResponse;
  } catch {
    data = {
      status: 'error',
      message: 'Ugyldig respons fra donasjonstjenesten.',
    };
  }

  if (!response.ok && data.status !== 'error') {
    return {
      status: 'error',
      message: 'Kunne ikke starte donasjon.',
    };
  }

  return data;
}
