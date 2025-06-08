// Test script to verify student login and profile APIs
const BASE_URL = 'http://localhost:5001/api';

async function testStudentLogin() {
  try {
    console.log('🔐 Testing student login...');
      // Test with different student credentials
    const testCredentials = [
      { cccd: '123456789012', password: 'Student123456' }
      // { cccd: '234567890123', password: 'Student123456' },
      // { cccd: '345678901234', password: 'Student123456' }
    ];

    for (const credentials of testCredentials) {
      try {
        console.log(`\n📝 Testing login for CCCD: ${credentials.cccd}`);
        
        // Login
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });
        
        const loginData = await loginResponse.json();
          if (loginData.success) {
          console.log(`✅ Login successful for ${credentials.cccd}`);
          console.log(`   Response: ${JSON.stringify(loginData, null, 2)}`);
          
          if (loginData.user) {
            console.log(`   User: ${loginData.user.fullName}`);
            console.log(`   Role: ${loginData.user.role}`);
          }
          
          const token = loginData.token;
          if (!token) {
            console.log(`   ❌ No token received`);
            continue;
          }
          
          const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          };
          
          // Test profile endpoint
          try {
            const profileResponse = await fetch(`${BASE_URL}/auth/profile`, { headers });
            const profileData = await profileResponse.json();
            
            if (profileData.success) {
              console.log(`   Profile API: ✅ Success`);
              console.log(`   Profile Data: ${JSON.stringify(profileData.user, null, 2)}`);
            } else {
              console.log(`   Profile API: ❌ Error - ${profileData.message}`);
            }
          } catch (profileError) {
            console.log(`   Profile API: ❌ Error - ${profileError.message}`);
          }
          
          // Test student personal info endpoint
          try {
            const personalInfoResponse = await fetch(`${BASE_URL}/student/personal-info`, { headers });
            const personalInfoData = await personalInfoResponse.json();
            
            if (personalInfoData.success) {
              console.log(`   Personal Info API: ✅ Success`);
              console.log(`   Personal Info Data: ${JSON.stringify(personalInfoData.data, null, 2)}`);
            } else {
              console.log(`   Personal Info API: ❌ Error - ${personalInfoData.message}`);
            }
          } catch (personalError) {
            console.log(`   Personal Info API: ❌ Error - ${personalError.message}`);
          }
          
        } else {
          console.log(`❌ Login failed for ${credentials.cccd}: ${loginData.message}`);
        }
          } catch (error) {
        console.log(`❌ Login error for ${credentials.cccd}: ${error.message}`);
      }
      
      // Add delay between requests to avoid rate limiting
      if (credentials !== testCredentials[testCredentials.length - 1]) {
        console.log('   Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n🎉 Student login test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the test
testStudentLogin();
