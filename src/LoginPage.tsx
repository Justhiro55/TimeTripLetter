import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // ログイン成功時にisLoggedInをtrueに設定
    setIsLoggedIn(true);
    console.log('Login successful'); // ログイン成功時にコンソールに表示

    // ログイン成功時にタイトルページに移動
    navigate('/title'); // '/title' ページに移動
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // ログインリクエストをサーバーに送信
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      // ログイン成功時の処理を実行
      handleLoginSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('予期せぬエラーが発生しました。');
      }
    }
  };

  return (
    <div className="form-container">
      <h1>ログイン</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default LoginPage;