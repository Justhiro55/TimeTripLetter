import React from 'react';
import './style.css'; // スタイルシートのパスを適切に設定してください。
import TemplateList from './TemplateList';

const Template: React.FC = () => {
  return (
    <div className="wrapper">
      <main>
        <div className="content">
          <h1 className="page-title">Products</h1>
          <TemplateList />
          {/* ページネーションなど */}
        </div>
      </main>
    </div>
  );
};

export default Template;