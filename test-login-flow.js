// Test script to verify the complete login flow
const testLoginFlow = async () => {
  console.log('🧪 Testing Login Flow...\n');

  try {
    // Test 1: Student Login
    console.log('1. Testing Student Login...');
    const studentResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cccd: '123456789',
        password: 'Password123'
      })
    });

    const studentData = await studentResponse.json();
    
    if (studentData.success) {
      console.log('✅ Student login successful');
      console.log(`   User: ${studentData.data.user.fullName}`);
      console.log(`   Role: ${studentData.data.user.role}`);
      console.log(`   Token received: ${studentData.data.token ? 'Yes' : 'No'}`);
      
      // Expected redirect should be to /student/dashboard for STUDENT role
      const expectedRoute = studentData.data.user.role === 'STUDENT' ? '/student/dashboard' : '/admin';
      console.log(`   Expected redirect: ${expectedRoute}\n`);
    } else {
      console.log('❌ Student login failed:', studentData.message);
    }

    // Test 2: Admin Login
    console.log('2. Testing Admin Login...');
    const adminResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cccd: '999999999',
        password: 'Admin123456'
      })
    });

    const adminData = await adminResponse.json();
    
    if (adminData.success) {
      console.log('✅ Admin login successful');
      console.log(`   User: ${adminData.data.user.fullName}`);
      console.log(`   Role: ${adminData.data.user.role}`);
      console.log(`   Token received: ${adminData.data.token ? 'Yes' : 'No'}`);
      
      // Expected redirect should be to /admin for ADMIN/SUPER_ADMIN role
      const expectedRoute = adminData.data.user.role === 'SUPER_ADMIN' || adminData.data.user.role === 'ADMIN' ? '/admin' : '/student/dashboard';
      console.log(`   Expected redirect: ${expectedRoute}\n`);
    } else {
      console.log('❌ Admin login failed:', adminData.message);
    }

    // Test 3: Verify frontend server is running
    console.log('3. Testing Frontend Server...');
    try {
      const frontendResponse = await fetch('http://localhost:5173');
      if (frontendResponse.ok) {
        console.log('✅ Frontend server running on http://localhost:5173');
      } else {
        console.log(`❌ Frontend server returned status: ${frontendResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Frontend server not accessible:', error.message);
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. Open browser and navigate to http://localhost:5173');
    console.log('2. Should auto-redirect to /login');
    console.log('3. Try logging in with:');
    console.log('   Student: CCCD = 123456789, Password = Password123');
    console.log('   Admin: CCCD = 999999999, Password = Admin123456');
    console.log('4. Should redirect to appropriate dashboard after successful login');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
};

// Run if this is the main module
if (require.main === module) {
  testLoginFlow();
}

module.exports = testLoginFlow;
