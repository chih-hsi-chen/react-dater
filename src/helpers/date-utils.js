import {
	format,
	startOfWeek,
	startOfMonth,
	addDays,
	addWeeks,
	addMonths,
	addYears,
	subMonths,
	subYears,
	setHours,
	setMinutes,
	setSeconds,
	parse,
	parseISO,
	toDate,
	isValid,
	getHours,
	getMinutes,
	getSeconds,
	getDate,
	isSameDay,
	isSameMonth,
	getTime,
} from 'date-fns';

import { enUS } from 'date-fns/locale';

const getScope = () => {
	return typeof window !== 'undefined' ? window : global;
};

export const newDate = (initialValue) => {
	const date = initialValue
		? typeof initialValue === 'string' || initialValue instanceof String
			? parseISO(initialValue)
			: toDate(initialValue)
		: new Date();

	return isValid(date) ? date : new Date();
};

export const formatDate = (date, formatStr = 'yyyy-MM-dd', locale) => {
	const LocaleObj = getLocaleObject(locale);

	return format(date, formatStr, {
		locale: LocaleObj,
	});
};

export const parseDate = (value, dateFormat, locale) => {
	const LocaleObj = getLocaleObject(locale);
	const parsedDate = parse(value, dateFormat, new Date(), {
		locale: LocaleObj,
	});

	return isValid(parsedDate) && parsedDate;
};

export const getFirstWeekDay = (weekDate, locale) => {
	const LocaleObj = getLocaleObject(locale);
	return startOfWeek(weekDate, {
		locale: LocaleObj,
	});
};

export const getFirstMonthDay = (monthDate) => {
	return startOfMonth(monthDate);
};

/**
 *
 * @param {String} localeName - locale key
 * @param {Locale} localeObj - locale object
 */
export const addLocale = (localeName, localeObj) => {
	const scope = getScope();

	if (!scope.__localeData__) scope.__localeData__ = {};

	scope.__localeData__[localeName] = localeObj;
};

export const getLocaleObject = (localeInfo) => {
	if (!localeInfo) {
		return getDefaultLocale();
	}
	if (typeof localeInfo === 'string') {
		const scope = getScope();

		// default is en-US
		return scope.__localeData__ && scope.__localeData__[localeInfo]
			? scope.__localeData__[localeInfo]
			: getDefaultLocale();
	}

	// We assume it is a raw date-fns Locale object
	return localeInfo;
};

export const getDefaultLocale = () => {
	const scope = getScope();

	// if users define their own default, just use it; otherwise, we give en-US as default locale
	return scope.__default_locale__ || enUS;
};
export const registerDefaultLocale = (localeObj) => {
	const scope = getScope();

	scope.__default_locale__ = localeObj;
};

export const getWeekdayNameInLocale = (date, locale) => {
	return formatDate(date, 'EEEEEE', locale);
};

export const setTime = (date, { hour = 0, min = 0, sec = 0 }) => {
	return setHours(setMinutes(setSeconds(date, sec), min), hour);
};

export const getHoursByPeriod = (date) => {
	const hours = getHours(date);

	return hours >= 12 ? hours - 12 : hours;
};

// Date getters
export { getHours, getMinutes, getSeconds, getTime, getDate };

// addition operations
export { addDays, addWeeks, addMonths, addYears };

// substraction operations
export { subMonths, subYears };

export const checkEqual = (dateLeft, dateRight) => {
	if (dateLeft && dateRight) return isSameDay(dateLeft, dateRight);
	return false;
};
export { isSameMonth };
