import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Letter.css';
import Font from "./compornents/Font.js"
import Sent from "./compornents/Sent.js"
import Text from "./compornents/Text.js"

const Letter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState("16px");
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [sendDate, setSendDate] = useState("");
  const navigate = useNavigate();

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
        if(data.letterID) {
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

  return (
    <>
      {!isOpen && (
        <div className="letter" onClick={handleClick}>
          {/* Letter front content */}
        </div>
      )}
      {isOpen && (
        <div>
          <Font fontState={[fontSize, setFontSize]} />
          <Text fontState={[fontSize, setFontSize]} textState={[text, setText]} />
          <div>
            <input type="file" onChange={handleFileChange} />
            {fileUploaded && <div>File uploaded successfully.</div>}
          </div>
          <div>
            <label>Sending Date:</label>
            <input
              type="date"
              value={sendDate}
              onChange={(e) => setSendDate(e.target.value)}
            />
          </div>
          <div className="save-draft-button-container">
            <button onClick={handleSaveDraft} className="save-draft-button">
              Complete Draft
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Letter;