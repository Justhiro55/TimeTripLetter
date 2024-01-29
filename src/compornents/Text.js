import '../Letter.css';

const Text = ({fontState,textState}) => {

	const [fontSize,setFontSize] = fontState;
	const [text, setText] = textState;
	const handleChange = (e) => {
		const textarea = e.target;
		const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
		const maxHeight = textarea.clientHeight;
		const maxLines = Math.floor(maxHeight / lineHeight);
	
		const newText = textarea.value;
		const numNewLines = newText.split('\n').length - 1;
	
		if (numNewLines <= maxLines) {
		  setText(newText);
		}
	  };

	return (
	<div className="letter-container">
            <textarea
              className="letter-textarea"
              style={{ fontSize: fontSize }}
              value={text}
              onChange={handleChange}
              placeholder="ここにお手紙を書いてください..."
            />
          </div>
	);
};

export default Text;