import '../Letter.css';

const Sent = ({sentState}) => {
	const [sent,setSent] = sentState;

	const sentChange = (event) => {
		setSent(event.target.value);
	  };

	  const today = new Date();
	  const minDate = new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0];
	

	return (
	<>
          <div className="font-size-container"> {/* コンテナにクラス名を追加 */}
      <label htmlFor="fontsize-selector">送信日:</label>
      <input id="fontsize-selector" type="date" value = {sent} onChange={sentChange} min = {minDate}>
	</input>
	  </div>
	  </>
	  );
}

export default Sent;