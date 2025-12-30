import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.catalog.beer';
const API_KEY = '16c4b8eb-6036-4dea-844f-e01d1ee2a435';

// Create base64 encoded API key for Basic Auth
const encodedApiKey = Buffer.from(`${API_KEY}:`).toString('base64');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Build the target URL with query parameters
  const targetUrl = new URL(`${API_BASE_URL}/beer`);
  
  // Forward all query parameters
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  try {
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${encodedApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Debug: Log the actual API response
    // console.log('External API Response:', data);
    // console.log('Response type:', typeof data);
    // console.log('Is array:', Array.isArray(data));
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy API Error:', error);
    return NextResponse.json(
      { error: true, error_msg: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
