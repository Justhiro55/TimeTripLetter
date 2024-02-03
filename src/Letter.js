import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import html2canvas from 'html2canvas';
import 'react-quill/dist/quill.snow.css'; // スタイルシートをインポート
import Sent from "./compornents/Sent.js"
import './Letter.css';

const Letter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState("16px");
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [sendDate, setSendDate] = useState("");
  const navigate = useNavigate();
  const captureRef = useRef(null);

  const handleClick = () => {
    setIsOpen(true);
  };

  // ページにアクセスした際にトークンを確認する
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/token/check', {
          credentials: 'include'
        });

        if (response.status === 401) {
          alert('Session expired. Redirecting to login.');
          navigate('/login');
        }
      } catch (error) {
        alert('Session expired. Redirecting to login.');
        console.error('Error:', error);
        navigate('/login');
      }
    };

    checkToken();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSaveDraft = () => {
    saveLetterToServer();
    localStorage.setItem("sendDate", sendDate);
    navigate('/personal-info');
  };

  const takeScreenshot = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current, { scrollY: -window.scrollY }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'letter_capture.png'; // ファイル名を設定
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const saveLetterToServer = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', text);
    const fontSizeValue = parseInt(fontSize.replace('px', ''), 10);
    formData.append('fontSize', fontSizeValue);

    const requestOptions = {
      method: 'POST',
      body: formData,
      credentials: 'include',
    };

    fetch('http://localhost:8080/api/letter', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json(); // 正常なレスポンスをJSONとして解析
      })
      .then(data => {
        if (data.letterID) {
          localStorage.setItem("letterID", data.letterID.toString()); // 保存された手紙のIDをローカルストレージに保存
          alert('Draft saved successfully!'); // ここで正常にアラートが表示される
        } else {
          throw new Error('Letter ID not found in response.'); // サーバーからのレスポンスにletterIDが含まれていない場合のエラー
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to save the draft.'); // エラー発生時にユーザーに通知
      });
  };

  const editorContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // 上端に寄せる
    alignItems: 'center',
    background: 'url(/images/letter.jpg) no-repeat center center',
    backgroundSize: 'cover',
    padding: '20px',
    width: '80%',
    margin: '0 auto',
    marginTop: '10px', // 上のマージンを適宜調整
    minHeight: '700px', // コンテナの最小高さを設定
  };

  const quillStyle = {
    width: '100%',
    height: '600px',
    paddingTop: '0px',
    backgroundColor: 'transparent',
    border: 'none',
  };

  return (
    <>
      {!isOpen && (
        <div className="letter" onClick={() => setIsOpen(true)}>
          Click to Open Letter Editor
        </div>
      )}
      {isOpen && (
        <div ref={captureRef} style={{ width: '100%', height: '100%' }}>
          <div style={{ ...editorContainerStyle }}>
            <ReactQuill theme="snow" value={text} onChange={setText} style={quillStyle} />
            {/* その他の入力フィールド... */}
          </div>
          {/* Sent コンポーネントを追加して、sendDate ステートを渡す */}
          <div className="date-picker-container">
            <Sent sentState={[sendDate, setSendDate]} />
            {/* その他のコンテンツ */}
          </div>
            <div className="save-draft-button-container">
            <button onClick={handleSaveDraft} className="save-draft-button">
              Complete Draft
            </button>
            <button onClick={takeScreenshot} className="save-draft-button">Save as Image</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Letter;