import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import html2canvas from 'html2canvas';
import 'react-quill/dist/quill.snow.css';
import Sent from "./compornents/Sent.js";
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
  const location = useLocation();
  const { imageUrl1, imageUrl2 } = location.state || { imageUrl1: '', imageUrl2: '' };

  useEffect(() => {
    console.log("Text:", text);
    console.log("FontSize:", fontSize);
  }, [text, fontSize]);

  const takeScreenshot = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current, { scrollY: -window.scrollY }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'letter_capture.png';
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

  const saveLetterTemporarily = async () => {
    const requestData = { content: text, fontSize: parseInt(fontSize, 10), filename: file ? file.name : '' };
  
    try {
      const response = await fetch('http://localhost:8080/api/temp-letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save the letter temporarily.');
      }
  
      const responseData = await response.json();
      console.log('Temporary letter ID:', responseData.tempLetterId);
      return responseData.tempLetterId; // tempLetterId を返す
    } catch (error) {
      console.error('Error saving letter temporarily:', error);
      throw error;
    }
  };
  
  const handleNavigateToLogin = async () => {
    setFontSize("16px"); // フォントサイズを設定
    try {
      const tempLetterId = await saveLetterTemporarily(); // tempLetterId を取得
      navigate('/login', { state: { tempLetterId } }); // 手紙の ID を渡してログインページに遷移
    } catch (error) {
      // エラー処理
    }
  };

  const handleNavigateToSignup = async () => {
    setFontSize("16px"); // フォントサイズを設定
    try {
      const tempLetterId = await saveLetterTemporarily(); // tempLetterId を取得
      navigate('/signup', { state: { tempLetterId } }); // 手紙の ID を渡してサインアップページに遷移
    } catch (error) {
      // エラー処理
    }
  };

  const closedLetterStyle = {
    backgroundImage: `url(${imageUrl1})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    width: '100%',
    height: '100vh',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    perspective: '1000px',
    transition: 'transform 0.5s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transformStyle: 'preserve-3d',
  };
  const editorContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    background: 'url(/images/letter.jpg) no-repeat center center',
    backgroundSize: 'cover',
    padding: '20px',
    width: '80%',
    margin: '0 auto',
    marginTop: '10px',
    minHeight: '700px',
  };



  const quillStyle = {
    width: '100%',
    height: '600px',
    paddingTop: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: fontSize,
  };

  return (
    <>
      {!isOpen && (
        <div className="letter" onClick={() => setIsOpen(true)} style={closedLetterStyle}>
          Click to Open Letter Editor
        </div>
      )}
      {isOpen && (
        <div ref={captureRef} style={{ width: '100%', height: '100%' }}>
          <div style={{ ...editorContainerStyle }}>
            <ReactQuill theme="snow" value={text} onChange={setText} style={quillStyle} />
          </div>
          <Sent sentState={[sendDate, setSendDate]} />
          <div className="button-container">
          <div className="login-signup-guide">
            <p>アカウントをお持ちの方はこちら</p>
            <button onClick={handleNavigateToLogin} className="login-button">ログイン</button>
          </div>
          <div className="login-signup-guide">
            <p>アカウントをお持ちでない方はこちら</p>
            <button onClick={handleNavigateToSignup} className="signup-button">サインアップ</button>
          </div>
          <button onClick={takeScreenshot} className="save-draft-button">Save as Image</button>
        </div>
        </div>
      )}
    </>
  );
};

export default Letter;

