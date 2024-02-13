import React from 'react';
import { useLocation } from 'react-router-dom'; // useLocationをインポート
import '../Letter.css';

const Text = ({ fontState, textState }) => {
  const location = useLocation();
  const { imageUrl } = location.state || {};

  const [fontSize, setFontSize] = fontState;
  const [text, setText] = textState;

  const handleChange = (e) => {
    const textarea = e.target;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const maxHeight = textarea.clientHeight;
    const maxLines = Math.floor(maxHeight / lineHeight);

    const newText = textarea.value;
    const numNewLines = newText.split('\n').length - 1;

    if (numNewLines <= maxLines) {
      setText(newText);
    }
  };

  // 背景画像を設定するためのスタイルオブジェクト
  const backgroundStyle = {
    width: '100%', // 背景画像を含むdivの幅
    height: 'auto', // 高さは自動調整（テキストエリアの内容に応じて変化するため）
    backgroundImage: `url(${imageUrl})`, // 背景画像としてimageUrlを設定
    backgroundSize: 'cover', // 背景画像をdivにフィットさせる
    backgroundPosition: 'center', // 背景画像の位置を中央に設定
    padding: '20px', // パディングを追加してテキストエリアを少し内側に配置
    boxSizing: 'border-box', // パディングを含めたサイズ計算を行う
  };

  return (
    <div className="letter-container" style={backgroundStyle}>
      <textarea
        className="letter-textarea"
        style={{ fontSize: fontSize }}
        value={text}
        onChange={handleChange}
        placeholder="ここにお手紙を書いてください..."
      />
    </div>
  );
};

export default Text;