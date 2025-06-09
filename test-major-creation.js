const axios = require('axios');

async function testMajorCreation() {
  console.log('Starting major creation test...');
  
  try {
    // First, login as admin to get token
    console.log('Logging in as admin...');    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      cccd: '999999999',
      password: 'Admin123456'
    });    const token = loginResponse.data.data.token;
    console.log('Login successful, token obtained');
    console.log('Login response:', loginResponse.data);

    // Get available schools
    console.log('Fetching schools...');
    const schoolsResponse = await axios.get('http://localhost:5001/api/admin/schools', {
      headers: { Authorization: `Bearer ${token}` }
    });
      console.log('Available schools count:', schoolsResponse.data.data ? schoolsResponse.data.data.length : 'No data');
    if (schoolsResponse.data.data && schoolsResponse.data.data.length > 0) {
      console.log('First school:', schoolsResponse.data.data[0]);
    }    if (schoolsResponse.data.data.length === 0) {
      console.log('No schools available. Creating a test school first...');
      
      const schoolData = {
        name: 'Test University',
        code: 'TEST_UNI',
        totalQuota: 1000,
        admissionMethods: [
          { name: 'Điểm THPT', percentage: 50 },
          { name: 'Học bạ', percentage: 30 },
          { name: 'ĐGNL/TD', percentage: 20 }
        ]
      };

      console.log('Creating test school with data:', schoolData);
      const createSchoolResponse = await axios.post('http://localhost:5001/api/admin/schools', schoolData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('School created successfully:', createSchoolResponse.data);
      
      // Refresh schools list
      const updatedSchoolsResponse = await axios.get('http://localhost:5001/api/admin/schools', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Updated schools list:', updatedSchoolsResponse.data.data.slice(0, 1));
    }

    // Get admission combinations
    console.log('Fetching admission combinations...');
    const combinationsResponse = await axios.get('http://localhost:5001/api/admin/combinations', {
      headers: { Authorization: `Bearer ${token}` }
    });
      console.log('Available combinations:', combinationsResponse.data.data ? combinationsResponse.data.data.slice(0, 2) : 'No data'); // Show first 2

    // Now test major creation
    const schoolsData = await axios.get('http://localhost:5001/api/admin/schools', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (schoolsData.data.data.length === 0) {
      console.log('Still no schools available!');
      return;
    }

    const firstSchool = schoolsData.data.data[0];
    const combinations = combinationsResponse.data.data;

    const majorData = {
      name: 'Computer Science Test',
      code: 'CS_TEST_001',
      schoolId: firstSchool.id,
      quota: 50,
      admissionCombinationIds: combinations.length > 0 ? [combinations[0].id] : []
    };

    console.log('Creating major with data:', majorData);

    const response = await axios.post('http://localhost:5001/api/admin/majors', majorData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Major created successfully:', response.data);
  } catch (error) {
    console.error('ERROR OCCURRED:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('No response received:', error);
    }
  }
}

console.log('Script starting...');
testMajorCreation()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Unhandled error:', err));
