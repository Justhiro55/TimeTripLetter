import React from 'react';

interface TemplateItemProps {
  imageUrl1: string;
  imageUrl2: string;
  title: string;
  price: string;
  handleItemClick: () => void;
}

const TemplateItem: React.FC<TemplateItemProps> = ({ imageUrl1,  imageUrl2, title, price, handleItemClick }) => {
  return (
    <div className="template-item" onClick={handleItemClick}>
      <img src={imageUrl1} alt={title} />
      <img src={imageUrl2} alt={title} />
      <h3 className="template-title">{title}</h3>
      <p className="template-price">{price}</p>
    </div>
  );
};

export default TemplateItem;