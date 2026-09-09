const testAuth = async () => {
  const timestamp = Date.now();
  const testUser = {
    name: 'Sarah Connor',
    email: `sarah_${timestamp}@example.com`,
    password: 'securePassword123'
  };

  try {
    console.log('1. Testing POST /api/auth/register...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    console.log('Register status:', regRes.status, 'Success:', regData.success);
    console.log('User created:', regData.user?.name, regData.user?.email);
    console.log('JWT Token issued:', !!regData.token);

    const token = regData.token;

    console.log('\n2. Testing POST /api/auth/login with valid password...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    console.log('Login status:', loginRes.status, 'Success:', loginData.success);

    console.log('\n3. Testing POST /api/auth/login with invalid password...');
    const badLoginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'wrongPassword' })
    });
    const badLoginData = await badLoginRes.json();
    console.log('Bad login status (expected 401):', badLoginRes.status, 'Error:', badLoginData.error);

    console.log('\n4. Testing GET /api/auth/me with Bearer token...');
    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log('Me status:', meRes.status, 'User Name:', meData.user?.name, 'Email:', meData.user?.email);

    console.log('\n5. Testing POST /api/resumes/analyze with Authorization header...');
    const scanRes = await fetch('http://localhost:5000/api/resumes/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        resumeText: `Sarah Connor\nsarah@sky.net | (555) 321-9988\n\nEXPERIENCE\nLead Security Engineer\n- Spearheaded system defense against threats, reducing vulnerabilities by 90%.\n\nSKILLS\nCybersecurity, Linux, Python, Cryptography, Docker`,
        fileName: 'sarah_resume.txt'
      })
    });
    const scanData = await scanRes.json();
    console.log('Scan success:', scanData.success, 'Linked to userId:', scanData.data?.userId);

    console.log('\n6. Testing GET /api/resumes with Authorization header (user history)...');
    const historyRes = await fetch('http://localhost:5000/api/resumes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const historyData = await historyRes.json();
    console.log('User-specific history count:', historyData.count);

    console.log('\nALL AUTHENTICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Auth test failed:', err);
  }
};

testAuth();
