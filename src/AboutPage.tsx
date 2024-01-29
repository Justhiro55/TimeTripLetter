import React from 'react';
import './AboutPage.css'; // 追加されたCSSファイルをインポート

export default function AboutPage() {
  return (
    <div className="about-container">
      <h1>会社概要</h1>
      
      <section className="basic-info">
        <h2>基本情報</h2>
        <table>
          <tbody>
            <tr>
              <td>設立年度</td>
              <td>2000年</td>
            </tr>
            <tr>
              <td>住所</td>
              <td>1234 会社ストリート, シティー名, 国名</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>info@company.com</td>
            </tr>
            <tr>
              <td>電話</td>
              <td>123-456-7890</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="team-members">
        <h2>チームメンバー</h2>
        <ul>
          <li>山田 太郎 - CEO</li>
          <li>鈴木 花子 - マーケティングディレクター</li>
          <li>田中 一郎 - チーフエンジニア</li>
          {/* 他のメンバー */}
        </ul>
      </section>
    </div>
  );
}
