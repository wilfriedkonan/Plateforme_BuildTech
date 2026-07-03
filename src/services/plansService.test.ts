// Test file to debug API issues
// Run this in browser console to test different request formats

export const testApiRequests = async () => {
  const baseUrl = 'http://localhost:5292/api/plans';
  const apiKey = 'VotreClÃ©APISecrÃ¨te123!';


  // Test 1: Simple fetch without headers
  try {
    const res = await fetch(baseUrl);
    const data = await res.json();
  } catch (e) {
  }

  // Test 2: Fetch with ApiKey header
  try {
    const res = await fetch(baseUrl, {
      headers: { 'ApiKey': apiKey },
    });
    const data = await res.json();
  } catch (e) {
  }

  // Test 3: Fetch with Authorization header
  try {
    const res = await fetch(baseUrl, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const data = await res.json();
  } catch (e) {
  }

  // Test 4: Via proxy
  try {
    const res = await fetch('/api/plans');
    const data = await res.json();
  } catch (e) {
  }
};

// Call in browser console: window.testApiRequests?.()
(window as any).testApiRequests = testApiRequests;
