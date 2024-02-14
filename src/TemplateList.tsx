import React, { useState } from 'react';
import TemplateItem from './TemplateItem';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: number;
  imageUrl1: string;
  imageUrl2: string;
  title: string;
  price: string;
}

const templates = [
  {
    id: 1,
    imageUrl1: '/images/open.jpg',
    imageUrl2: '/images/letter.jpg',
    title: 'Product 1',
    price: '¥1,000',
  },
  {
    id: 2,
    imageUrl1: '/images/letter2.jpeg',
    imageUrl2: '/images/letter2-test.jpeg',
    title: 'Product 2',
    price: '¥2,000',
  }
  // 必要に応じて他の製品を追加
];

const TemplateList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<{ imageUrl1: string; imageUrl2: string }>({ imageUrl1: '', imageUrl2: '' });

  const handleItemClick = (template: Template) => {
    setSelectedImages({ imageUrl1: template.imageUrl1, imageUrl2: template.imageUrl2 });
    console.log("Selected Image URLs:", template.imageUrl1, template.imageUrl2);
    navigate('/letter', { state: { imageUrl1: template.imageUrl1, imageUrl2: template.imageUrl2 } });
  };

  return (
    <div>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <TemplateItem
              imageUrl1={template.imageUrl1}
              imageUrl2={template.imageUrl2}
              title={template.title}
              price={template.price}
              handleItemClick={() => handleItemClick(template)}
            />
          </li>
        ))}
      </ul>
      {selectedImages.imageUrl1 && (
        <div>
          <div>選択された画像1: {selectedImages.imageUrl1}</div>
          <img src={selectedImages.imageUrl1} alt="Selected 1" />
          <div>選択された画像2: {selectedImages.imageUrl2}</div>
          <img src={selectedImages.imageUrl2} alt="Selected 2" />
        </div>
      )}
    </div>
  );
};

export default TemplateList;
