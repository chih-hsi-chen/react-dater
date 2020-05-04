import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { usePopper } from 'react-popper';
import { placements } from '@popperjs/core/lib/enums';
import cname from 'classnames';

export const popperPlacementPositions = placements;

const PopperComponent = (props) => {
	const {
		hidePopper,
		popperComponent,
		popperPlacement,
		targetComponent,
	} = props;

	const [referenceElement, setReferenceElement] = useState(null);
	const [popperElement, setPopperElement] = useState(null);
	const [arrowElement, setArrowElement] = useState(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{
				name: 'arrow',
				options: {
					element: arrowElement,
				},
				
			},
			{
				name: 'offset',
				options: {
					offset: [0, 10]
				}
			}
		],
		placement: popperPlacement
	});

	let popper = null;

	if(!hidePopper) {
		popper = (
			<div
				className = {cname('rdx__popper')}
				ref = {setPopperElement}
				style={styles.popper}
				{...attributes.popper}
			>
				{ React.cloneElement(popperComponent, {},
					<div
						className = 'rdx__arrow'
						ref={setArrowElement}
					/>
				) }
			</div>
		);
	}
	
	return (
		<React.Fragment>
			<div
				className = 'rdx__display-wrapper'
				ref={setReferenceElement}
			>
				{ targetComponent }
			</div>
			{popper}
		</React.Fragment>
	);
};

PopperComponent.propTypes = {
	hidePopper: PropTypes.bool,
	popperComponent: PropTypes.element,
	popperModifiers: PropTypes.object,
	popperPlacement: PropTypes.oneOf(popperPlacementPositions),
	popperContainer: PropTypes.func,
	popperProps: PropTypes.object,
	targetComponent: PropTypes.element,

}
PopperComponent.defaultProps = {
	hidePopper: false,
	popperProps: {},
	popperPlacement: 'bottom-start'
};

export default PopperComponent;