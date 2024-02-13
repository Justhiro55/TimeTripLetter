import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TitlePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/name', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
          setIsLoading(false);
        } else if (response.status === 401) {
          alert('Session expired. Redirecting to login.');
          navigate('/login');
        } else {
          throw new Error('Failed to fetch user name.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserName();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <h1>Welcome, {userName}!</h1>
      <button onClick={() => navigate('/template')}>Write a Letter</button>
    </div>
  );
}
