import React from 'react';
// import { subMonths, addMonths } from 'date-fns';

import DatePicker from 'react-dater';
import 'react-dater/dist/index.css';

const App = () => {
	return (
		<>
			<DatePicker
				selectDateRange
				selectTimeRange
				dateFormatInput='yyyy-MM-dd, h:mm aa'
				dateFormatCalendar='yyyy LLLL'
			/>
			
		</>
		
	);
};

export default App;
