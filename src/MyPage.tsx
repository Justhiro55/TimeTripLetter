import React, { useState, useEffect } from 'react';
import './MyPage.module.css'; // CSSモジュールをインポート

type LetterRecipientInfo = {
  letter_id: number;
  recipient_name: string;
  send_date: string;
};

type UserInfo = {
  username: string;
  email: string;
};

const MyPage = () => {
  const [letterRecipients, setLetterRecipients] = useState<LetterRecipientInfo[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchLetterRecipients = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/mypage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setLetterRecipients(data.letterRecipients || []);
      setUserInfo(data.userInfo || null);
    } catch (error) {
      console.error('Fetch letter recipients failed:', error);
      setLetterRecipients([]);
    }
  };

  useEffect(() => {
    fetchLetterRecipients();
  }, []);

  return (
    <div className="container">
      <h1>マイページ</h1>
      {userInfo && (
        <div className="user-info-box">
          <h2>ユーザー情報</h2>
          <div className="user-info">
            <p><strong>ユーザー名:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
          </div>
        </div>
      )}
      <h2>送信したレターと受取人情報</h2>
      <div className="letter-info-box">
        <ul className="letter-list">
          {letterRecipients && letterRecipients.length > 0 ? (
            letterRecipients.map(({ recipient_name, send_date }) => (
              <li key={send_date + recipient_name} className="listItem">
                <div className="listItemHeader">受取人: {recipient_name}</div>
                <div>送信日: {send_date}</div>
              </li>
            ))
          ) : (
            <p>送信したレター情報はありません。</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyPage;
