import React from 'react';
import styles from './styles.module.css';
import cname from 'classnames';
console.log('helo')

export const ExampleComponent = ({ text }) => {
	const className = cname(styles.test);

	return (
		<div className={className}>
			Example Component: {text}
		</div>
	);
}
