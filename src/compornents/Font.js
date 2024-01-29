import '../Letter.css';

const Font = ({fontState}) => {
	const [font,setFontSize] = fontState;

	const handleFontSizeChange = (event) => {
		setFontSize(event.target.value);
	  };
	
	return (
	<>
          <div className="font-size-container"> {/* コンテナにクラス名を追加 */}
      <label htmlFor="fontsize-selector">フォントサイズ:</label>
      <select id="fontsize-selector" onChange={handleFontSizeChange} value={font}>
        <option value="12px">小さい</option>
        <option value="16px">標準</option>
        <option value="20px">大きい</option>
        <option value="24px">とても大きい</option>
      </select>
	  </div>
	  </>
	  );
}

export default Font;