import React, { useState } from 'react';
import TemplateItem from './TemplateItem';
import { useNavigate } from 'react-router-dom'; // useNavigate フックをインポート

const templates = [
  {
    id: 1,
    imageUrl: '/images/letter.jpg', // 絶対パスに変更
    title: 'Product 1',
    price: '¥1,000',
  },
  {
    id: 2,
    imageUrl: '/images/open.jpg', // 絶対パスに変更
    title: 'Product 2',
    price: '¥2,000',
  }
  // 必要に応じて他の製品を追加
];

const TemplateList = () => {
  const navigate = useNavigate(); // useNavigate フックを使用
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleItemClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
     // ここでログ出力
     
    navigate('/letter', { state: { imageUrl } });
  };
  return (
    <div>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <TemplateItem
              imageUrl={template.imageUrl}
              title={template.title}
              price={template.price}
              handleItemClick={() => handleItemClick(template.imageUrl)}
            />
          </li>
        ))}
      </ul>
      {selectedImageUrl && (
       <div>
     
       選択された画像: {selectedImageUrl}
       <img src={selectedImageUrl} alt="Selected" />
       console.log("Selected Image URL:", selectedImageUrl);

     </div>
      )}
    </div>
  );
};

export default TemplateList;