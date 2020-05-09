import React, { useState } from 'react';
import { RDXContext } from './helpers/ContextConfig';
import {
	getHours,
	getMinutes,
	getSeconds,
	getHoursByPeriod,
} from './helpers/date-utils';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

const createCustomArrow = function (Arrow) {
	return (props) => (
		<Arrow
			{...props}
			classes={{
				root: 'rdx__timeArrow',
			}}
		/>
	);
};
const CustomArrowUp = createCustomArrow(ArrowDropUp);
const CustomArrowDown = createCustomArrow(ArrowDropDown);

const typeToLimit = {
	HOUR: 11,
	MINUTE: 59,
	SECOND: 59,
};
const getNextNumberInBound = (type, nextNum) => {
	const limit = typeToLimit[type];

	if (!limit) return 0;

	return nextNum < 0 ? limit : nextNum > limit ? 0 : nextNum;
};

const Time = (props) => {
	// If true, it means 'AM'
	const [period, setPeriod] = useState(getHours(props.selected) < 12);

	const TogglePeriod = () => {
		let hour = getHours(props.selected);

		hour = period ? hour + 12 : hour - 12;

		props.onTimeSelect({
			hour,
			min: getMinutes(props.selected),
			sec: getSeconds(props.selected),
		});
		setPeriod((p) => !p);
	};

	const handleArrowClick = (type = 'SECOND', offset = 1) => {
		let nextHr = getHoursByPeriod(props.selected);
		let nextMin = getMinutes(props.selected);
		let nextSec = getSeconds(props.selected);

		switch (type) {
			case 'HOUR': {
				nextHr = getNextNumberInBound(type, nextHr + offset);
				nextHr += period ? 0 : 12;
				break;
			}
			case 'MINUTE': {
				nextMin = getNextNumberInBound(type, nextMin + offset);
				break;
			}
			case 'SECOND':
			default: {
				nextSec = getNextNumberInBound(type, nextSec + offset);
				break;
			}
		}
		props.onTimeSelect({
			hour: nextHr,
			min: nextMin,
			sec: nextSec,
		});
	};

	return (
		<div>
			<button
				className='rdx__periodToggleBtn'
				onClick={TogglePeriod}
				title='Change Period'
			>
				{period ? 'AM' : 'PM'}
			</button>
			<div className='rdx__time__pickWrapper'>
				<div className='rdx__time__picker rdx__time__picker--hr'>
					<CustomArrowUp
						onClick={() => handleArrowClick('HOUR', -1)}
					/>
					<div className='rdx__timenum rdx__timenum--hr'>
						{getHoursByPeriod(props.selected)}
					</div>
					<CustomArrowDown
						onClick={() => handleArrowClick('HOUR', 1)}
					/>
				</div>
				<div className='rdx__time__picker rdx__time__picker--min'>
					<CustomArrowUp
						onClick={() => handleArrowClick('MINUTE', -1)}
					/>
					<div className='rdx__timenum rdx__timenum--min'>
						{getMinutes(props.selected)}
					</div>
					<CustomArrowDown
						onClick={() => handleArrowClick('MINUTE', 1)}
					/>
				</div>
				<div className='rdx__time__picker rdx__time__picker--ss'>
					<CustomArrowUp
						onClick={() => handleArrowClick('SECOND', -1)}
					/>
					<div className='rdx__timenum rdx__timenum--ss'>
						{getSeconds(props.selected)}
					</div>
					<CustomArrowDown
						onClick={() => handleArrowClick('SECOND', 1)}
					/>
				</div>
			</div>
		</div>
	);
};

const TimeWithContext = (props) => {
	return (
		<RDXContext.Consumer>
			{({ selected, onTimeSelect }) => (
				<Time
					{...props}
					selected={selected}
					onTimeSelect={onTimeSelect}
				/>
			)}
		</RDXContext.Consumer>
	);
};

export default TimeWithContext;
