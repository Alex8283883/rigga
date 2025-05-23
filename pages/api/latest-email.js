export default async function handler(req, res) {
  const login = "rsveqry974";
  const domain = "1secmail.cc";
  const base = "https://www.1secmail.cc/api/v1/";

  try {
    const inboxRes = await fetch(`${base}?action=getMessages&login=${login}&domain=${domain}`);
    const inbox = await inboxRes.json();

    if (inbox.length === 0) {
      return res.status(200).json({ message: "No emails received." });
    }

    const latest = inbox[0];
    const messageRes = await fetch(`${base}?action=readMessage&login=${login}&domain=${domain}&id=${latest.id}`);
    const email = await messageRes.json();

    res.status(200).json(email);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch email." });
  }
}
