import React from 'react';
import { subMonths, addMonths } from 'date-fns';

import DatePicker from 'react-dater';
import 'react-dater/dist/index.css';

const App = () => {
	return (
		<>
			<DatePicker
				showMonthYearSeparate
				selectTime
				maxDate={subMonths(new Date(), 1)}
				selected={addMonths(new Date(), 5)}
			/>
		</>
		
	);
};

export default App;
