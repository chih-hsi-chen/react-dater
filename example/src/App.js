import React from 'react';
import DatePicker from 'react-dater';
import 'react-dater/dist/index.css';

const App = () => {
	return (
		<>
			<DatePicker
				showMonthYearSeparate
				selectTime
				dateFormatInput='MM/dd/yyyy, h:mm aa'
			/>
		</>
		
	);
};

export default App;
