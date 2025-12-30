import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.catalog.beer';
const API_KEY = '16c4b8eb-6036-4dea-844f-e01d1ee2a435';

// Create base64 encoded API key for Basic Auth
const encodedApiKey = Buffer.from(`${API_KEY}:`).toString('base64');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const beerId = resolvedParams.id;
  
  // Debug: Log the incoming request
  // console.log('Individual beer request - Beer ID:', beerId);
  // console.log('Resolved params:', resolvedParams);
  // console.log('Request URL:', request.url);

  if (!beerId) {
    console.log('No beer ID provided');
    return NextResponse.json(
      { error: true, error_msg: 'Beer ID is required' },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `${API_BASE_URL}/beer/${beerId}`;
    console.log('Calling external API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${encodedApiKey}`,
      },
    });

    // console.log('External API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('External API error response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('External API success - got data for:', data.name);
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Individual beer proxy API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
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
