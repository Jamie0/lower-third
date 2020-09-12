import React from 'react';

export default class SafeView extends React.Component {
	componentDidMount () {
		typeof window != 'undefined' && window.addEventListener('resize', this.listener)
	}

	listener = (event) => {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight
		})
	}

	componentWillUnmount () {
		typeof window != 'undefined' && window.removeEventListener('resize', this.listener)
	}

	render () {
		let { ratio } = this.props; // 9/16

		// basically, work out which way the screen won't be happy

		let _window = typeof window == 'undefined' ? { innerWidth: 640, innerHeight: 480 } : window;

		let outerWidth = _window.innerWidth, outerHeight = _window.innerHeight;

		let innerWidth = outerWidth, innerHeight = outerHeight;

		let style={ width: 0, height: 0, display: 'flex' }

		if (outerHeight / outerWidth > ratio) {
			console.log('++', outerHeight / outerWidth, ratio)
			style.width = '100vw';
			style.height = (100 * ratio) + 'vw'
			innerHeight = ratio * innerWidth;
		} else {
			style.width = 'calc(100vh / ' + ratio + ')';
			style.height = '100vh';
			innerWidth = innerHeight / ratio;
		}

		style.overflow = 'hidden';

		return (
			<div style={{ width: '100vw', display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
				<div style={style}>
					{ this.props.children({ width: innerWidth, height: innerHeight }) }
				</div>
			</div>
		)
	}	
}