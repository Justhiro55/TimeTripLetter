import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import html2canvas from 'html2canvas';
import 'react-quill/dist/quill.snow.css';
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

  const saveLetterTemporarily = async () => {
    // 送信するデータの内容をログに出力
    const requestData = { content: text, fontSize: parseInt(fontSize, 10), filename: file ? file.name : '' };
    console.log('Sending request data:', requestData);

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
    } catch (error) {
      console.error('Error saving letter temporarily:', error);
    }
};

  const handleNavigateToLogin = () => {
    setFontSize("16px"); // フォントサイズを設定
    saveLetterTemporarily().then(() => navigate('/login'));
  };
  

  const handleNavigateToSignup = () => {
    setFontSize("16px"); // フォントサイズを設定
    saveLetterTemporarily().then(() => navigate('/signup'));
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
    fontSize: fontSize, // フォントサイズの値をここで設定
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
