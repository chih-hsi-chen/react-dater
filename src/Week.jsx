import React from 'react';
import PropTypes from 'prop-types';
import Day from './Day';
import { getFirstWeekDay, addDays } from './helpers/date-utils';

const WEEK_OFFSET = [0, 1, 2, 3, 4, 5, 6];

class Week extends React.Component {
    static propTypes = {
        day: PropTypes.instanceOf(Date).isRequired,
    };

    renderDays = () => {
        const start_of_week = getFirstWeekDay(this.props.day);
        const days = [];

        return days.concat(
            WEEK_OFFSET.map(offset => {
                const currentDay = addDays(start_of_week, offset);
                return (
                    <Day
                        key={offset}
                        day = {currentDay}
                    />
                );
            })
        );
    }
    
    render() {
        return (
            <div className = "rdx__week">
                {this.renderDays()}
            </div>
        );
    }
}

export default Week;