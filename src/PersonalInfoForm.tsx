import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './App.css';

type FormData = {
  recipientName: string;
  recipientZip: string;
  recipientAddress: string;
  recipientEmail: string;
  cardName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
};

export default function PersonalInfoForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const sendDate = localStorage.getItem("sendDate");
    const letterID = localStorage.getItem("letterID"); // letterID をローカルストレージから取得
    const completeData = { 
      ...data, 
      sendDate, 
      letterID: letterID ? parseInt(letterID, 10) : null // letterID を整数に変換して追加
    };
  
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeData),
      credentials: 'include'
    };
  
    fetch('http://localhost:8080/api/personal-info', requestOptions)
      .then(response => {
        if (response.status === 401) {
          // トークンが期限切れまたは存在しない場合
          alert('Session expired. Redirecting to login.');
          navigate('/login');
          return Promise.reject('Unauthorized'); // これにより後続のthenは実行されない
        }
        if (!response.ok) {
          // その他のエラー
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        navigate('/confirm');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend>送り先の個人情報</legend>
          <div className="form-group">
            <input {...register("recipientName", { required: "相手の名前は必須です" })} placeholder="相手の名前" />
            {errors.recipientName && <p className="form-error">{errors.recipientName.message}</p>}
          </div>
          <div className="form-group">
            <input {...register("recipientZip", { required: "相手の郵便番号は必須です" })} placeholder="相手の郵便番号" />
            {errors.recipientZip && <p className="form-error">{errors.recipientZip.message}</p>}
          </div>
          <div className="form-group">
            <input {...register("recipientAddress", { required: "相手の住所は必須です" })} placeholder="相手の住所" />
            {errors.recipientAddress && <p className="form-error">{errors.recipientAddress.message}</p>}
          </div>
          <div className="form-group">
            <input {...register("recipientEmail", { required: "相手のメールアドレスは必須です", pattern: { value: /^\S+@\S+$/i, message: "有効なメールアドレスを入力してください" } })} placeholder="相手のメールアドレス" />
            {errors.recipientEmail && <p className="form-error">{errors.recipientEmail.message}</p>}
          </div>
        </fieldset>

        <fieldset>
          <legend>決済情報</legend>
          <div className="form-group">
            <input {...register("cardName", { required: "カード名義人は必須です" })} placeholder="カード名義人" />
            {errors.cardName && <p className="form-error">{errors.cardName.message}</p>}
          </div>
          <div className="form-group">
            <input {...register("cardNumber", { required: "カード番号は必須です" })} placeholder="カード番号" />
            {errors.cardNumber && <p className="form-error">{errors.cardNumber.message}</p>}
          </div>
          <div className="form-group">
            <select {...register("expiryMonth", { required: "有効期限の月は必須です" })}>
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
            {errors.expiryMonth && <p className="form-error">{errors.expiryMonth.message}</p>}
          </div>
          <div className="form-group">
            <select {...register("expiryYear", { required: "有効期限の年は必須です" })}>
              <option value="">年</option>
              {Array.from({ length: 10 }, (_, i) => <option key={i} value={new Date().getFullYear() + i}>{new Date().getFullYear() + i}</option>)}
            </select>
            {errors.expiryYear && <p className="form-error">{errors.expiryYear.message}</p>}
          </div>
          <div className="form-group">
            <input {...register("cvc", { required: "CVCは必須です" })} placeholder="CVC" />
            {errors.cvc && <p className="form-error">{errors.cvc.message}</p>}
          </div>
        </fieldset>

        <button type="submit">送信</button>
      </form>
    </div>
  );
}
