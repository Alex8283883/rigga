import { useEffect, useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState(null);
  const login = 'myinbox'; // Your inbox name
  const domain = '1secmail.com';

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
        const messages = await res.json();
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
    const interval = setInterval(fetchEmail, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Email Viewer</h1>
        <p><strong>Inbox:</strong> {login}@{domain}</p>
        {email ? (
          <div>
            <h2>{email.subject}</h2>
            <div dangerouslySetInnerHTML={{ __html: email.htmlBody || email.textBody }} />
          </div>
        ) : (
          <p>Waiting for an email from <strong>no-reply@skinape.com</strong>...</p>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#f0f0f0'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '600px'
  },
  title: {
    marginBottom: '1rem'
  }
};
