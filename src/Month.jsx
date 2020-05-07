import React from 'react';
import PropTypes from 'prop-types';
import Week from './Week';
import {
	getFirstWeekDay,
	getFirstMonthDay,
	addWeeks
} from './helpers/date-utils';

// basically, show 6 weeks in month
const FIXED_HEIGHT_WEEK_COUNT = 6;

const renderWeeks = ({ day }) => {
	const weeks = [];
	let currentWeekStart = getFirstWeekDay(getFirstMonthDay(day));

	for (let i = 0; i < FIXED_HEIGHT_WEEK_COUNT; i++) {
		weeks.push(
			<Week weekNumber={i} key={`rdx-week-${i}`} day={currentWeekStart} />
		);

		currentWeekStart = addWeeks(currentWeekStart, 1);
	}

	return weeks;
};

const Month = (props) => {
	return <div className='rdx__month'>{renderWeeks(props)}</div>;
};

Month.propTypes = {
	day: PropTypes.instanceOf(Date).isRequired
};

export default Month;
