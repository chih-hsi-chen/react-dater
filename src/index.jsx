import React from 'react';
import PropTypes from 'prop-types';
import cname from 'classnames';
import onClickOutside from 'react-onclickoutside';
import Calendar from './Calendar';
import PopperComponent from './PopperComponent';
import RDXContext from './helpers/ContextConfig';
import {
	parseDate,
	newDate,
	formatDate,
	setTime,
	getHours,
	getMinutes,
	isBefore,
} from './helpers/date-utils';
import './stylesheets/DatePicker.css';

const WrappedCalendar = onClickOutside(Calendar);

export { addLocale, registerDefaultLocale } from './helpers/date-utils';

export default class DatePicker extends React.Component {
	static propTypes = {
		customClassName: PropTypes.string,
		intervals: PropTypes.number,
		dateFormatCalendar: PropTypes.string,
		dateFormatInput: PropTypes.string,
		dateFormatTime: PropTypes.string,
		locale: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		disabled: PropTypes.bool,
		readOnly: PropTypes.bool,
		inputElement: PropTypes.element,
		onChange: PropTypes.func,
		selected: PropTypes.instanceOf(Date),
		showMonthYearSeparate: PropTypes.bool,
		selectTime: PropTypes.bool,
		selectDateRange: PropTypes.bool,
		selectTimeRange: PropTypes.bool,
		minDate: PropTypes.instanceOf(Date),
		maxDate: PropTypes.instanceOf(Date),
		skipOverflowCheck: PropTypes.bool,
	};

	static defaultProps = {
		dateFormatCalendar: 'LLL yyyy',
		dateFormatInput: 'MM/dd/yyyy',
		dateFormatTime: 'HH:mm',
		onChange: () => {},
		skipOverflowCheck: false,
	};

	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => {
		const { minDate, maxDate, selected } = this.props;
		let initialDateToSee = selected || newDate();

		if (!this.props.skipOverflowCheck) {
			if (minDate && isBefore(initialDateToSee, minDate)) {
				initialDateToSee = minDate;
			} else if (maxDate && isBefore(maxDate, initialDateToSee)) {
				initialDateToSee = maxDate;
			}
		}

		return {
			open: false,
			inputValue: null,
			focused: false,
			selectedDate: initialDateToSee,
			viewDate: initialDateToSee,
		};
	};

	isCalendarOpen = () => {
		return this.state.open && !this.props.disabled && !this.props.readOnly;
	};

	/**
	 * @param {Boolean} nextOpenState - next calendar popper open state
	 * @param {Boolean} isResetView - if true, represent there is no selection happend
	 */
	setOpen = (nextOpenState, isResetView) => {
		this.setState((prevState) => {
			const BaseUpdate = {
				open: nextOpenState,
			};
			if (nextOpenState || !isResetView) return BaseUpdate;

			return {
				...BaseUpdate,
				viewDate: prevState.selectedDate,
			};
		});
	};

	/**
	 * @description update selected date and view date in calendar
	 * @param {Date} date - selected date from calendar or input field
	 * @param {Boolean} keepInput - if false, just set inputValue as null to represent the update is from calendar
	 *
	 */
	setSelected = (date, event, keepInput) => {
		const { selectedDate: selected } = this.state;
		let changedDate = date;

		if (!this.props.selectTime || !keepInput) {
			changedDate = setTime(changedDate, {
				hour: getHours(selected),
				min: getMinutes(selected),
			});
		}
		this.setState({
			selectedDate: changedDate,
			viewDate: changedDate,
		});
		if (!keepInput) this.setState({ inputValue: null });

		// call the callback function which is from parent element
		this.props.onChange(changedDate, event);
	};

	setViewDate = (date) => {
		this.setState({
			viewDate: date,
		});
	};

	handleInputClick = () => {
		if (!this.props.disabled && !this.props.readOnly) this.setOpen(true);
	};

	handleFocus = (e) => {
		// if (!this.state.open) this.setOpen(true);
		// this.setState({
		// 	focused: true
		// });
	};

	handleBlur = () => {
		// this.setState({ focused: false });
	};

	// text input change
	handleInputChange = (...args) => {
		const event = args[0];
		const parsedDate = parseDate(
			event.target.value,
			this.props.dateFormatInput
		);

		this.setState({
			inputValue: event.target.value,
		});

		if (parsedDate) this.setSelected(parsedDate, event, true);
	};

	handleSelect = (date, event) => {
		this.setSelected(date, event, false);

		this.setOpen(false, false);
	};

	handleTimeSelect = (time) => {
		const { selectedDate: selected } = this.state;

		const changedDate = setTime(selected, {
			hour: getHours(time),
			min: getMinutes(time),
		});

		this.setState({
			selectedDate: changedDate,
			inputValue: null,
		});
	};

	handleCalendarClickOutside = (e) => {
		if (e.target !== this.input) this.setOpen(false, true);
	};

	renderCalendar = () => {
		return (
			<WrappedCalendar
				intervals={this.props.intervals}
				dateFormat={this.props.dateFormatCalendar}
				onClickOutside={this.handleCalendarClickOutside}
				selected={this.state.selectedDate}
				viewed={this.state.viewDate}
				onChangeView={this.setViewDate}
				showMonthYearSeparate={this.props.showMonthYearSeparate}
				selectTime={this.props.selectTime} // for single time select
				selectDateRange={this.props.selectDateRange} // for multiple day select
				selectTimeRange={this.props.selectTimeRange} // for multiple time select
				minDate={this.props.minDate}
				maxDate={this.props.maxDate}
			/>
		);
	};

	renderDateInput = () => {
		const InputElemToRender = this.props.inputElement || (
			<input type='text' />
		);
		const inputValue =
			typeof this.state.inputValue === 'string'
				? this.state.inputValue
				: formatDate(
						this.state.selectedDate,
						this.props.dateFormatInput
				  );

		const InputClassName = cname(
			'rdx__textInput',
			this.props.customClassName,
			InputElemToRender.props.className
		);

		return React.cloneElement(InputElemToRender, {
			ref: (input) => (this.input = input),
			value: inputValue,
			onChange: this.handleInputChange,
			onFocus: this.handleFocus,
			onBlur: this.handleBlur,
			onClick: this.handleInputClick,
			placeholder: this.props.placeholderText,
			readOnly: this.props.readOnly,
			disabled: this.props.disabled,
			className: InputClassName,
		});
	};

	render() {
		const calendar = this.renderCalendar();

		return (
			<RDXContext.Provider
				value={{
					locale: this.props.locale,
					selected: this.state.selectedDate,
					minDate: this.props.minDate,
					viewed: this.state.viewDate,
					onDaySelect: this.handleSelect,
					onTimeSelect: this.handleTimeSelect,
				}}
			>
				<PopperComponent
					hidePopper={!this.isCalendarOpen()}
					popperComponent={calendar}
					targetComponent={
						<div className='rdx__input-container'>
							{this.renderDateInput()}
						</div>
					}
				/>
			</RDXContext.Provider>
		);
	}
}
