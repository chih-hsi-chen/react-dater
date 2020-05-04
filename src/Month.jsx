import React from 'react';
import PropTypes from 'prop-types';
import Week from './Week';
import { getFirstWeekDay, getFirstMonthDay, addWeeks } from '../helpers/date-utils';

// basically, show 6 weeks in month
const FIXED_HEIGHT_WEEK_COUNT = 6;

export default class Month extends React.Component {
    static propTypes = {
        day: PropTypes.instanceOf(Date).isRequired,
    };


    renderWeeks = () => {
        const weeks = [];
        let currentWeekStart = getFirstWeekDay(
            getFirstMonthDay(this.props.day)
        );

        for(let i = 0; i < FIXED_HEIGHT_WEEK_COUNT; i++) {
            weeks.push(
                <Week
                    weekNumber={i}
                    key={`rdx-week-${i}`}
                    day = {currentWeekStart}
                />
            );
            
            currentWeekStart = addWeeks(currentWeekStart, 1);
        }

        return weeks;
    }

    render() {
        return (
            <div className = 'rdx__month'>
                {this.renderWeeks()}
            </div>
        );
    }
}