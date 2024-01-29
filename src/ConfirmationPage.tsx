import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserInfo = {
    username: string;
    email: string;
};

type LetterInfo = {
    content: string;
};

type RecipientInfo = {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    postalCode: string;
    sendDate: string;
};

export default function ConfirmationPage() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [letterInfo, setLetterInfo] = useState<LetterInfo | null>(null);
    const [recipientInfo, setRecipientInfo] = useState<RecipientInfo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // APIからデータを取得する関数
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/confirmation', {
                    method: 'GET',
                    credentials: 'include', // Cookieを送信する
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data.userInfo);
                    setLetterInfo(data.letterInfo);
                    setRecipientInfo(data.recipientInfo);
                } else {
                    throw new Error('データの取得に失敗しました。');
                }
            } catch (error) {
                console.error('エラー:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>送り主の情報</h2>
            {userInfo && (
                <div>
                    <p>ユーザー名: {userInfo.username}</p>
                    <p>メール: {userInfo.email}</p>
                </div>
            )}

            <h2>手紙の内容</h2>
            {letterInfo && <p>{letterInfo.content}</p>}

            <h2>送り先の情報</h2>
            {recipientInfo && (
                <div>
                    <p>名前: {recipientInfo.name}</p>
                    <p>住所: {recipientInfo.address}</p>
                    <p>電話番号: {recipientInfo.phoneNumber}</p>
                    <p>メール: {recipientInfo.email}</p>
                    <p>郵便番号: {recipientInfo.postalCode}</p>
                    <p>送信日: {recipientInfo.sendDate}</p>
                </div>
            )}

            <button onClick={() => navigate('/done')}>完了</button>
        </div>
    );
}
