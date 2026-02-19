import { NextResponse, type NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get an access token from Vipps
async function getVippsAccessToken(clientId: string, clientSecret: string, subKey: string, env: 'test' | 'prod') {
  const url = env === 'test' 
    ? 'https://apitest.vipps.no/accesstoken/get'
    : 'https://api.vipps.no/accesstoken/get';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'client_id': clientId,
      'client_secret': clientSecret,
      'Ocp-Apim-Subscription-Key': subKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to get Vipps access token:', errorText);
    throw new Error(`Failed to get Vipps access token. Status: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  const { 
    VIPPS_CLIENT_ID, 
    VIPPS_CLIENT_SECRET, 
    VIPPS_SUB_KEY, 
    VIPPS_MSN,
    VIPPS_ENVIRONMENT 
  } = process.env;

  // 1. Check if Vipps environment variables are configured
  if (!VIPPS_CLIENT_ID || !VIPPS_CLIENT_SECRET || !VIPPS_SUB_KEY || !VIPPS_MSN) {
    return NextResponse.json({
      status: 'not_configured',
      message: 'Vipps er ikke aktivert enda.',
    });
  }

  try {
    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number' || amount < 10) {
      return NextResponse.json(
          { status: 'error', message: 'Ugyldig beløp. Minimumsbeløp er 10 NOK.' },
          { status: 400 }
      );
    }
    const amountInOere = amount * 100;

    // 2. Get Access Token
    const accessToken = await getVippsAccessToken(
      VIPPS_CLIENT_ID,
      VIPPS_CLIENT_SECRET,
      VIPPS_SUB_KEY,
      VIPPS_ENVIRONMENT === 'prod' ? 'prod' : 'test'
    );

    const orderId = uuidv4();
    const fallbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/takk`;
    
    const vippsApiUrl = VIPPS_ENVIRONMENT === 'test'
      ? 'https://apitest.vipps.no/epayment/v1/payments'
      : 'https://api.vipps.no/epayment/v1/payments';

    // 3. Create Payment Session
    const paymentResponse = await fetch(vippsApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Ocp-Apim-Subscription-Key': VIPPS_SUB_KEY,
        'Idempotency-Key': orderId
      },
      body: JSON.stringify({
        amount: {
          currency: 'NOK',
          value: amountInOere,
        },
        paymentMethod: {
          type: 'WALLET',
        },
        userFlow: 'WEB_REDIRECT',
        returnUrl: fallbackUrl,
        transaction: {
          reference: orderId,
          paymentDescription: `Donasjon til GameNight (${amount} NOK)`,
        },
      }),
    });

    if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('Failed to create Vipps payment:', errorText);
        throw new Error(`Failed to create Vipps payment. Status: ${paymentResponse.status}`);
    }

    const paymentData = await paymentResponse.json();

    // 4. Return the checkout URL to the frontend
    return NextResponse.json({
      status: 'success',
      checkoutFrontendUrl: paymentData.redirectUrl,
    });

  } catch (error) {
    console.error('Vipps donation process failed:', error);
    return NextResponse.json(
      { status: 'error', message: 'En feil oppstod under donasjonsprosessen.' },
      { status: 500 }
    );
  }
}
