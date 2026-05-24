module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const survey = req.body;

  // Build Telegram message
  const fields = [
    { label: 'Name', value: survey.name },
    { label: 'Email', value: survey.email },
    { label: 'Phone', value: survey.phone },
    null, // separator
    { label: 'Business', value: survey.bizName },
    { label: 'Website', value: survey.bizUrl },
    { label: 'Industry', value: survey.industry },
    { label: 'What they do', value: survey.description },
    { label: 'Ideal customer', value: survey.audience },
    { label: 'Brand voice', value: survey.voice },
    null,
    { label: 'Topics wanted', value: survey.topics },
    { label: 'Topics to avoid', value: survey.avoid },
    { label: 'Target keywords', value: survey.keywords },
    null,
    { label: 'Competitors', value: survey.competitors },
    { label: 'What makes them different', value: survey.usp },
    null,
    { label: 'Frequency', value: survey.frequency },
    { label: 'Approver', value: survey.approver },
    { label: 'CTA', value: survey.cta },
    { label: 'Offers', value: survey.offers },
    { label: 'Notes', value: survey.notes },
  ];

  let text = '🚨 <b>NEW BLOG SERVICE SIGNUP</b>\n\n';
  for (const f of fields) {
    if (f === null) {
      text += '\n';
      continue;
    }
    if (f.value && f.value.trim()) {
      text += `<b>${f.label}:</b> ${f.value.trim()}\n`;
    }
  }

  // Send to Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = '8576544235';

  const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const tgBody = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });

  try {
    const tgRes = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: tgBody,
    });
    const tgData = await tgRes.json();
    if (!tgData.ok) console.error('Telegram error:', tgData);
  } catch (e) {
    console.error('Telegram send failed:', e);
  }

  res.json({ success: true });
};
