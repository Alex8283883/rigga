import { useEffect, useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      const res = await fetch('/api/latest-email');
      const data = await res.json();
      setEmail(data);
    };

    fetchEmail();
    const interval = setInterval(fetchEmail, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Latest Email</h1>
      {email ? (
        <>
          <h2>{email.subject}</h2>
          <pre>{email.body}</pre>
        </>
      ) : (
        <p>Loading or no email found...</p>
      )}
    </div>
  );
}
