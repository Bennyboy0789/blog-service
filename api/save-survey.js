module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const survey = req.body;

  // Log to console (Vercel captures this)
  console.log('=== NEW BLOG SERVICE SIGNUP ===');
  console.log(JSON.stringify(survey, null, 2));
  console.log('===============================');

  // In production, save to DB, Airtable, email, etc.
  // For now: write to /tmp for retrieval
  const fs = require('fs');
  const path = require('path');
  const file = path.join('/tmp', `survey-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(survey, null, 2));

  res.json({ success: true });
};
