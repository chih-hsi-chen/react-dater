import React from 'react';
import DatePicker from 'react-dater';
import 'react-dater/dist/index.css';

const App = () => {
	return (
		<>
			<DatePicker
				selectTime
				dateFormatInput = 'yyyy-MM-dd, h:mm aa'
			/>
		</>
		
	);
};

export default App;
