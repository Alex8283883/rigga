// Example using Mail.tm API
export default async function handler(req, res) {
  const inbox = process.env.MAIL_TM_EMAIL;
  const password = process.env.MAIL_TM_PASSWORD;

  // Authenticate
  const login = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: inbox, password }),
  }).then(r => r.json());

  // Fetch messages
  const messages = await fetch('https://api.mail.tm/messages', {
    headers: { Authorization: `Bearer ${login.token}` },
  }).then(r => r.json());

  // Filter by sender
  const fromSkinape = messages['hydra:member'].filter(
    m => m.from && m.from.address === 'no-reply@skinape.com'
  );

  const latest = fromSkinape[0];
  if (!latest) return res.status(404).json({ error: "No email found" });

  const emailDetail = await fetch(`https://api.mail.tm/messages/${latest.id}`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).then(r => r.json());

  res.status(200).json({ subject: emailDetail.subject, body: emailDetail.text });
}
