import { useEffect, useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState(null);
  const login = 'myinbox';
  const domain = '1secmail.com';

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const listRes = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
        const messages = await listRes.json();
        const latest = messages.find(msg => msg.from.includes('no-reply@skinape.com'));

        if (latest) {
          const msgRes = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${latest.id}`);
          const data = await msgRes.json();
          setEmail(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmail();
    const interval = setInterval(fetchEmail, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>Email Viewer</h1>
      <p>Email: {login}@{domain}</p>
      {email ? (
        <div>
          <h2>{email.subject}</h2>
          <div dangerouslySetInnerHTML={{ __html: email.htmlBody || email.textBody }} />
        </div>
      ) : (
        <p>Waiting for an email from no-reply@skinape.com...</p>
      )}
    </main>
  );
}
