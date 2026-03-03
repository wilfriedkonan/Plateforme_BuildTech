// Test file to debug API issues
// Run this in browser console to test different request formats

export const testApiRequests = async () => {
  const baseUrl = 'http://localhost:5292/api/plans';
  const apiKey = 'VotreCléAPISecrète123!';

  console.log('=== Testing different request formats ===\n');

  // Test 1: Simple fetch without headers
  console.log('Test 1: Fetch without headers');
  try {
    const res = await fetch(baseUrl);
    const data = await res.json();
    console.log('✓ Success:', data);
  } catch (e) {
    console.log('✗ Failed:', (e as Error).message);
  }

  // Test 2: Fetch with ApiKey header
  console.log('\nTest 2: Fetch with ApiKey header');
  try {
    const res = await fetch(baseUrl, {
      headers: { 'ApiKey': apiKey },
    });
    const data = await res.json();
    console.log('✓ Success:', data);
  } catch (e) {
    console.log('✗ Failed:', (e as Error).message);
  }

  // Test 3: Fetch with Authorization header
  console.log('\nTest 3: Fetch with Authorization header');
  try {
    const res = await fetch(baseUrl, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const data = await res.json();
    console.log('✓ Success:', data);
  } catch (e) {
    console.log('✗ Failed:', (e as Error).message);
  }

  // Test 4: Via proxy
  console.log('\nTest 4: Via Vite proxy');
  try {
    const res = await fetch('/api/plans');
    const data = await res.json();
    console.log('✓ Success:', data);
  } catch (e) {
    console.log('✗ Failed:', (e as Error).message);
  }
};

// Call in browser console: window.testApiRequests?.()
(window as any).testApiRequests = testApiRequests;
