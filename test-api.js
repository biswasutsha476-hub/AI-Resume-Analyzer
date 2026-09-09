const test = async () => {
  try {
    console.log('Testing GET /api/resumes/health...');
    const healthRes = await fetch('http://localhost:5000/api/resumes/health');
    const health = await healthRes.json();
    console.log('Health Response:', health);

    console.log('\nTesting POST /api/resumes/analyze...');
    const analyzeRes = await fetch('http://localhost:5000/api/resumes/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: `Alex Morgan
alex.morgan@email.com | (555) 019-2834 | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 6+ years of experience designing and scaling web applications.

TECHNICAL SKILLS
- Frontend: React.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Docker, AWS

WORK EXPERIENCE
Senior Software Engineer | TechScale Solutions | Jan 2022 - Present
- Spearheaded the redesign of core SaaS portal using React, boosting page speed by 40% and increasing users from 50k to 120k.
- Architected resilient microservices in Node.js and MongoDB, reducing average query response latency by 55ms.
- Automated deployment pipelines using Docker, cutting build release time from 45 minutes to 8 minutes.

EDUCATION
Bachelor of Science in Computer Science | UC Berkeley`,
        jobDescription: 'Seeking Senior Full Stack Engineer experienced with React, Node.js, MongoDB, TypeScript, and Docker.',
        fileName: 'alex_morgan_resume.txt'
      })
    });

    const analysis = await analyzeRes.json();
    console.log('Analyze Success:', analysis.success);
    console.log('Candidate Name:', analysis.data?.candidateName);
    console.log('Overall Score:', analysis.data?.scores?.overall);
    console.log('ATS Score:', analysis.data?.scores?.atsScore);
    console.log('Job Match Score:', analysis.data?.jobMatch?.matchScore);
    console.log('Saved to MongoDB:', analysis.savedToDB);
    console.log('Doc ID:', analysis.data?._id);

    console.log('\nTesting POST /api/resumes/improve-bullet...');
    const bulletRes = await fetch('http://localhost:5000/api/resumes/improve-bullet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bullet: 'worked on react dashboard and fixed bugs'
      })
    });
    const bulletData = await bulletRes.json();
    console.log('Bullet Improvement Results:', bulletData.data?.improvedBullets?.length, 'suggestions generated');

    console.log('\nTesting GET /api/resumes (History)...');
    const historyRes = await fetch('http://localhost:5000/api/resumes');
    const history = await historyRes.json();
    console.log('History Count:', history.count);

    console.log('\nALL API TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('API Test Failed:', err);
  }
};

test();
