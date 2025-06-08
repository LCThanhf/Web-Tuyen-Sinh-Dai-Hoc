// Test script to verify API endpoints
const { default: fetch } = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cccd: '123456789012',
        password: 'Student123456'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (data.success) {
      console.log('Login successful! Token:', data.token);
      
      // Test applications endpoint
      const appsResponse = await fetch('http://localhost:5001/api/student/applications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const appsData = await appsResponse.json();
      console.log('Applications response:', appsData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
