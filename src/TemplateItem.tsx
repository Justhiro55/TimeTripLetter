import React from 'react';

interface TemplateItemProps {
  imageUrl: string;
  title: string;
  price: string;
  handleItemClick: () => void;
}

const TemplateItem: React.FC<TemplateItemProps> = ({ imageUrl, title, price, handleItemClick }) => {
  return (
    <div className="template-item" onClick={handleItemClick}>
      <img src={imageUrl} alt={title} />
      <h3 className="template-title">{title}</h3>
      <p className="template-price">{price}</p>
    </div>
  );
};

export default TemplateItem;