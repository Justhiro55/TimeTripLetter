import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import PersonalInfoForm from './PersonalInfoForm'; // PersonalInfoFormをインポート

const LoginPage = () => {
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [letterID, setLetterID] = useState<number | null>(null); // letterIDの状態を保持する

  const navigate = useNavigate();
  const location = useLocation();
  const tempLetterId = location.state ? location.state.tempLetterId : null;

  useEffect(() => {
    console.log('Temporary letter ID:', tempLetterId);
  }, [tempLetterId]);

  const handleLoginSuccess = async (letterID: number) => {
    setIsLoggedIn(true);
    console.log('Login successful');
    console.log('Received letterID:', letterID);
    navigate('/personal-info', { state: { letterID: letterID } });
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
          body: JSON.stringify({ email, password, tempLetterId: tempLetterId ? tempLetterId.toString() : null }), // tempLetterIdを文字列に変換する
        });
    
        console.log('Login request sent:', response); // リクエスト送信時のログを追加
    
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Login failed');
        }
        
        // ログイン成功時の処理を実行
        const { letterID } = await response.json(); // レスポンスからletterIDを取得
        console.log('Temporary letter ID:', letterID);
        handleLoginSuccess(letterID);
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
      {/* PersonalInfoFormを呼び出し、letterIDをpropsとして渡す */}
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
