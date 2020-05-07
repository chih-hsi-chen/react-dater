import React from 'react';
import PropTypes from 'prop-types';
import Day from './Day';
import { getFirstWeekDay, addDays } from './helpers/date-utils';

const WEEK_OFFSET = [0, 1, 2, 3, 4, 5, 6];

const renderDays = (day) => {
	const startOfWeek = getFirstWeekDay(day);
	const days = [];

	return days.concat(
		WEEK_OFFSET.map((offset) => {
			const currentDay = addDays(startOfWeek, offset);
			return <Day key={offset} day={currentDay} />;
		})
	);
};
const Week = (props) => {
	return <div className='rdx__week'>{renderDays(props.day)}</div>;
};

Week.propTypes = {
	day: PropTypes.instanceOf(Date).isRequired
};

export default Week;
