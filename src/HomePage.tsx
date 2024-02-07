import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/token/check', {
        method: 'POST',
        credentials: 'include' // クレデンシャルを含む
      });
      setAuthenticated(response.ok);
    } catch (error) {
      console.error('Error verifying token:', error);
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogin = () => {
    // 認証状態に基づいて適切なページにリダイレクト
    navigate(authenticated ? '/title' : '/login');
  };

  return (
    <div className="page-container">
      <h1>ホームページ</h1>
      {/* <button onClick={() => navigate('/signup')}>アカウント作成</button> */}
      {/* <button onClick={handleLogin}>
        {authenticated ? 'ログイン' : 'ログイン'} */}
      <button onClick={() => navigate('/analog')}>アナログ</button> {/* アナログページへのボタン */}
      <button onClick={() => navigate('/letter')}>デジタル</button>
      {/* </button> */}
    </div>
  );
}