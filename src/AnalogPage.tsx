import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnalogPage = () => {
  const navigate = useNavigate();

  // 必要に応じて他のロジックを追加

  return (
    <div>
      <h1>アナログページ</h1>
      <p>ここではアナログに関する情報を扱います。</p>
      <button onClick={() => navigate('/')}>ホームに戻る</button>
    </div>
  );
};

export default AnalogPage;