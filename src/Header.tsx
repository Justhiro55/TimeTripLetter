import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // AuthContextからuseAuthをインポート

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // AuthContextからisLoggedInを取得
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // トークン検証
    fetch('http://localhost:8080/api/token/check', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        setIsLoggedIn(true); // トークンが有効な場合、ログイン状態をtrueに設定
      } else {
        setIsLoggedIn(false); // トークンが無効な場合、ログイン状態をfalseに設定
      }
    })
    .catch(error => {
      console.error('Token verification error:', error);
      setIsLoggedIn(false);
    });
  })

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // ログアウト処理を実行
    fetch('http://localhost:8080/api/logout', {
      method: 'POST',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        // ログアウトに成功した場合、状態を更新
        setIsLoggedIn(false);
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f3f3f3', borderBottom: '1px solid #ddd' }}>
      <div className="logo" style={{ fontWeight: 'bold', fontSize: '24px' }}>
        <Link to="/" className="header-link" style={{ textDecoration: 'none', color: 'black' }}>
          My App
        </Link>
      </div>
      <div className="hamburger-menu" onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '36px' }}>
        ☰
      </div>
      {isOpen && (
        <nav style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white', border: '1px solid #ddd', padding: '5px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '5px 0' }}><Link to="/" onClick={toggleMenu} style={{ textDecoration: 'none', color: 'black' }}>ホーム</Link></li>
            <li style={{ padding: '5px 0' }}><Link to="/about" onClick={toggleMenu} style={{ textDecoration: 'none', color: 'black' }}>会社概要</Link></li>
            {isLoggedIn ? (
              <>
                <li style={{ padding: '5px 0' }}><Link to="/mypage" onClick={toggleMenu} style={{ textDecoration: 'none', color: 'black' }}>マイページ</Link></li>
                <li style={{ padding: '5px 0' }}>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, margin: 0, textDecoration: 'underline', cursor: 'pointer', color: 'darkslategray' }}>
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <li style={{ padding: '5px 0' }}><Link to="/login" onClick={toggleMenu} style={{ textDecoration: 'none', color: 'black' }}>ログイン</Link></li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}