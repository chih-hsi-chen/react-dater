import React, { useContext, useRef, useCallback, useState } from 'react';
import cname from 'classnames';
import RDXContext, { connect } from './helpers/ContextConfig';
import {
	getHours,
	getMinutes,
	getStartOfDay,
	formatDate,
	isTimeBefore,
	isTimeAfter,
} from './helpers/date-utils';
import { addMinutes } from 'date-fns';

function useSelect() {
	const { locale, selected, onTimeSelect, startTime, endTime } = useContext(
		RDXContext
	);

	return {
		locale,
		selected,
		onTimeSelect,
		startTime,
		endTime,
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
		selectTimeRange,
		onTimeSelect,
		setTimeLayerOpen,
		header,
		container,
		startTime,
		endTime,
	}) => {
		const [tabIndex, setTabIdx] = useState(0);
		const [listOffsetTop, setOffsetTop] = useState(0);
		const activeTime = getActiveTime();
		const curHr = getHours(activeTime);
		const curMin = getMinutes(activeTime);
		const timeIntervals = intervals || 30;
		const timeFormat = format || 'HH:mm aa';
		const rangeTabHeader = useRef();

		function getActiveTime() {
			if (selectTimeRange) {
				return tabIndex === 0 ? startTime : endTime;
			} else {
				return selected;
			}
		}

		const setCenterScroll = useCallback((node) => {
			if (node !== null) {
				const liHeight = getHeightIncludeMargin(node);
				const headerHeight = getHeightIncludeMargin(header.current);
				let listClientHeight = container.current
					? container.current.clientHeight - headerHeight
					: 210;

				if (selectTimeRange)
					listClientHeight -= getHeightIncludeMargin(
						rangeTabHeader.current
					);
				setOffsetTop(
					node.offsetTop - (listClientHeight - liHeight) / 2
				);
			}
		}, []);

		const timeListScroll = useCallback(
			(node) => {
				if (node) {
					node.scrollTop = listOffsetTop;
				}
			},
			[listOffsetTop]
		);

		const handleClick = (time) => {
			const tabType = tabIndex === 0 ? 'START' : 'END';

			if (!isDisabled(time)) {
				onTimeSelect(time, tabType);

				// close time picker layer
				if (!selectTimeRange) setTimeLayerOpen(true);
			}
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

		const isDisabled = (time) => {
			const isExceed =
				tabIndex === 0
					? isTimeAfter(time, endTime)
					: isTimeBefore(time, startTime);

			return isExceed;
		};

		const getClassName = (time) => {
			return cname('rdx__timeListItem', {
				'rdx__timeListItem--selected': isSelected(time),
				'rdx__timeListItem--disabled': isDisabled(time),
			});
		};

		function handleTabClick(e) {
			const tabIdx = e.target.getAttribute('data-idx');
			setTabIdx(parseInt(tabIdx));
		}

		function renderTabHeader() {
			if (!selectTimeRange) return;
			return (
				<div className='rdx__timerange-tab' ref={rangeTabHeader}>
					<div
						onClick={handleTabClick}
						className='rdx__tab'
						data-idx='0'
					>
						Start
					</div>
					<div
						onClick={handleTabClick}
						className='rdx__tab'
						data-idx='1'
					>
						End
					</div>
					<div
						className='tab__indicator'
						style={{
							transform: `translateX(${tabIndex * 100}%)`,
						}}
					/>
				</div>
			);
		}

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
							ref={setCenterScroll}
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
			<React.Fragment>
				{renderTabHeader()}
				<div ref={timeListScroll} className='rdx__timeDisplayWrapper'>
					{renderTimes()}
				</div>
			</React.Fragment>
		);
	}
);

const ConnectedTime = connect(Time, useSelect);

export default ConnectedTime;
