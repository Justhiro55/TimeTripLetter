import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpFormData {
  email: string;
  name: string;
  address: string;
  password: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    name: '',
    address: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

    const validatePassword = (password: string) => {
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return false;
    }
    return true;
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();  // フォームのデフォルト送信動作を防止

    if (!validatePassword(formData.password)) {
      setError('パスワードは8文字以上で、数字と文字を含む必要があります。');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // フォームデータをJSONに変換して送信
      });

      if (!response.ok) {
        throw new Error('サインアップに失敗しました');
      }

      navigate('/login'); // サインアップ成功後のページへ移動
    } catch (error) {
      console.error('サインアップエラー:', error);
      setError(error instanceof Error ? error.message : 'エラーが発生しました'); // エラーメッセージをセット
    }
  };

  return (
    <div className="form-container">
      <h1>アカウント作成</h1>
      {error && <div className="error-message">{error}</div>} {/* エラーメッセージを表示 */}
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="氏名"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="住所"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="パスワード"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">アカウント作成</button>
      </form>
    </div>
  );
}
