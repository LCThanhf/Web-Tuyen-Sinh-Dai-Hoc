// Test script to verify the profile integration
async function testProfileIntegration() {
  console.log('🔄 Testing Profile Integration...\n');
  
  try {
    // Test 1: Student Login
    console.log('1. Testing Student Login...');
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cccd: '123456789012',
        password: 'Student123456'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Student login successful');
      console.log(`   User: ${loginData.data.user.fullName}`);
      console.log(`   Role: ${loginData.data.user.role}`);
      const token = loginData.data.token;
      
      // Test 2: Get Profile from Auth API
      console.log('\n2. Testing Auth Profile API...');
      const authProfileResponse = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const authProfileData = await authProfileResponse.json();
      if (authProfileData.success) {
        console.log('✅ Auth profile API successful');
        console.log('   Profile data:', JSON.stringify(authProfileData.data.user, null, 2));
      } else {
        console.log('❌ Auth profile API failed:', authProfileData.message);
      }
      
      // Test 3: Get Personal Info from Student API
      console.log('\n3. Testing Student Personal Info API...');
      const personalInfoResponse = await fetch('http://localhost:5001/api/student/personal-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const personalInfoData = await personalInfoResponse.json();
      if (personalInfoData.success) {
        console.log('✅ Student personal info API successful');
        console.log('   Personal info:', JSON.stringify(personalInfoData.data, null, 2));
      } else {
        console.log('❌ Student personal info API failed:', personalInfoData.message);
      }
      
    } else {
      console.log('❌ Student login failed:', loginData.message);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testProfileIntegration();
