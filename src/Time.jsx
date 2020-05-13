import React, { useContext, useEffect, useRef } from 'react';
import cname from 'classnames';
import RDXContext, { connect } from './helpers/ContextConfig';
import {
	getHours,
	getMinutes,
	newDate,
	getStartOfDay,
	formatDate,
} from './helpers/date-utils';
import { addMinutes } from 'date-fns';

function select() {
	const { locale, selected, onTimeSelect } = useContext(RDXContext);

	return {
		locale,
		selected,
		onTimeSelect,
	};
}

function getComputedProp(el, propName) {
	if (window.getComputedStyle) {
		return window.getComputedStyle(el)[propName];
	}
	// For IE 8 or earlier, we need to use currentStyle to access computed style
	return el.currentStyle[propName];
}

/**
 *
 * @param {HTMLElement} el
 */
function getHeightIncludeMargin(el) {
	if (!el) return 0;

	const marginTop = parseInt(getComputedProp(el, 'marginTop'));
	const marginBottom = parseInt(getComputedProp(el, 'marginBottom'));

	return el.clientHeight + marginTop + marginBottom;
}

const Time = React.memo(
	({
		format,
		intervals,
		selected,
		locale,
		onTimeSelect,
		setTimeLayerOpen,
		header,
		container,
	}) => {
		const activeTime = selected || newDate();
		const curHr = getHours(activeTime);
		const curMin = getMinutes(activeTime);
		const timeIntervals = intervals || 30;
		const timeFormat = format || 'HH:mm aa';
		const centerLi = useRef();
		const timeList = useRef();

		useEffect(() => {
			const liHeight = getHeightIncludeMargin(centerLi.current);
			const headerHeight = getHeightIncludeMargin(header.current);
			const listClientHeight =
				container.current.clientHeight - headerHeight;

			timeList.current.scrollTop =
				centerLi.current.offsetTop - (listClientHeight - liHeight) / 2;
		}, [centerLi.current]);

		const handleClick = (time) => {
			onTimeSelect(time);

			// close time picker layer
			setTimeLayerOpen(true);
		};

		const isCenter = (time) => {
			const minDiff = curMin - getMinutes(time);

			return (
				curHr === getHours(time) &&
				minDiff < timeIntervals &&
				minDiff >= 0
			);
		};

		const isSelected = (time) =>
			curHr === getHours(time) && curMin === getMinutes(time);

		const getClassName = (time) => {
			return cname('rdx__timeListItem', {
				'rdx__timeListItem--selected': isSelected(time),
			});
		};

		const renderTimes = () => {
			const times = [];

			const base = getStartOfDay(activeTime);
			const intervalCount = 1440 / timeIntervals;

			for (let i = 0; i < intervalCount; i++) {
				const currentTime = addMinutes(base, i * timeIntervals);
				times.push(currentTime);
			}

			return times.map((time, idx) => {
				if (isCenter(time)) {
					return (
						<li
							key={idx}
							onClick={() => handleClick(time)}
							className={getClassName(time)}
							ref={centerLi}
						>
							{formatDate(time, timeFormat, locale)}
						</li>
					);
				}

				return (
					<li
						key={idx}
						onClick={() => handleClick(time)}
						className={getClassName(time)}
					>
						{formatDate(time, timeFormat, locale)}
					</li>
				);
			});
		};

		return (
			<div ref={timeList} className='rdx__timeDisplayWrapper'>
				{renderTimes()}
			</div>
		);
	}
);

const ConnectedTime = connect(Time, select);

export default ConnectedTime;
