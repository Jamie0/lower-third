import React from 'react';
import { Text } from '@fluentui/react';
import style from './style.css';


import SafeView from '../safe-view';

function sanitizeCSS (css) {

	let megaRule = /^( *(@[a-zA-Z0-9:\-_]+ *[a-zA-Z0-9\-]* *\{ *)? *?([a-zA-Z0-9:\-_]+ +\{ *([a-zA-Z\-]+ *: *[a-zA-Z0-9%\-]+; *)* *([a-zA-Z\-]+ *: *[a-zA-Z0-9%\-]+)? *\})* *\}? *)*$/m;

	return css.match(megaRule) ? css : null;
}

class OverlayItem extends React.Component {
	constructor (props) {
		super(props);
		this.id = Date.now() + '' + (Math.random() * 100000 | 0);

		if (this.props.data.transitions)
			this.state = {
				index: this.props.data.index,
				currentItem: this.props.data.items[this.props.data.index]
			}

		this._prevProps = JSON.parse(JSON.stringify(props))
	}

	getAnimationStyles () {
		let animations = this.props.data && this.props.data.animations || {};

		let list = Object.keys(animations)
			.map((name) => '@keyframes a-' + name + '-' + this.id + ' { ' + 
				animations[name].frames + 
			' }');

		let transitions = this.props.data && this.props.data.transitions || {};

		list = list.concat(Object.keys(transitions)
			.map((name) => '@keyframes t-' + name + '-' + this.id + ' { from { ' + 
				Object.entries(transitions[name].style).map(([k, v]) => `${k}:${v}`).join(';') + 
				'; } to {' +
				Object.entries(transitions[name].transition).map(([k, v]) => `${k}:${v}`).join(';') + 
			'; } }'));

		return list.join(' ');
	}

	componentDidUpdate (prevProps, prevState) {
		prevProps = this._prevProps || prevProps;
		this._prevProps = JSON.parse(JSON.stringify(this.props))

		if (prevProps.data.transitions && prevProps.data.index != this.props.data.index) {
			// ok, we should animate now 

			if (false && this.state.isTransition) {
				this.setState({
					retransition: true
				})
				return;
			}

			console.log('le hello change', prevProps.data.transition, prevProps.data.index, this.props.data.index)

			this.setState({
				currentItem: prevProps.data.items[prevProps.data.index],
				nextItem: this.props.data.items[this.props.data.index],
				index: this.props.data.index,
				isTransition: true,
				retransition: false
			})
		}


	}

	static getDerivedStateFromProps (props, state) {
		if (props.transition && props.state && (props.state != state.state || props.transition != state.transition)) {
			return {
				transition: props.transition,
				state: props.state,
				prevState: state.state,
			}
		}
		if (props.state && (props.state != state.state)) {
			return {
				state: props.state,
				prevState: state.state
			}
		}

		if (props.data && ((props.data.state && state.state != props.data.state) || (props.state && props.state != state.state))) {
			return {
				transition: props.data && props.data.states && props.data.states[props.data.state || props.state] && props.data.states[props.data.state || props.state].transition || null,
				state: props.data.state || props.state,
				prevState: state.state
			}
		}
	}

	renderBody () {
		let { data, width, height } = this.props;

		let { state, transition, prevState } = this.state;

		transition = transition || this.props.transition;

		if (data.states && (data.state !== undefined || this.props.state !== undefined)) {
			data = Object.assign({}, data, data.states[data.state || this.props.state])

			transition = transition || data.transition;
		}

		let index = this.state.index || data.index;

		let containerCSS, containerStyle;

		switch (data.t) {
			default:
				return null;
			case 'text':
				let Container = data.tag || 'span';
				let tagProps = data.props || {}; 
				return (
					<Container {...tagProps} style={
						Object.assign({
							fontSize: (parseInt(data.size || 10) * height / 250) + 'px',
						}, data.style)
					}>{ data.text }</Container>
				);
			case 'container':
				containerCSS = this.getAnimationStyles();

				containerStyle = {
					width: '100%',
					height: '100%',
					position: 'relative',
					overflow: data.clip ? 'hidden' : undefined
				};

				if (transition && data.animations && data.animations[transition] && (prevState != undefined || data.firstTransition !== false)) {
					containerStyle.animation = 'a-' + transition + '-' + this.id + ' ' + data.animations[transition].duration;
				}

				return (
					<>
						<style dangerouslySetInnerHTML={{__html: sanitizeCSS(containerCSS)}} />
						<div className={ 'container-' + this.id } style={ Object.assign(containerStyle, data.style) }>
							{ this.renderItems() }
						</div>
					</>
				);
			case 'image':
				return <img src={ data.src } style={ Object.assign({ width: '100%', height: '100%', objectFit: 'contain', objectPosition: data.align || 'center center' }, data.style) } />
			case 'stack':
				containerCSS = this.getAnimationStyles();

				containerStyle = {
					width: '100%',
					height: '100%',
					position: 'absolute',
					overflow: data.clip ? 'hidden' : undefined
				};

				if (transition && data.animations && data.animations[transition] && (prevState != undefined || data.firstTransition !== false)) {
					containerStyle.animation = 'a-' + transition + '-' + this.id + ' ' + data.animations[transition].duration;
				}


				let nowStyle = Object.assign({}, containerStyle, data.style, data.transitions.current.style);
				let nextStyle = Object.assign({}, containerStyle, data.style, data.transitions.next.style);

				if (this.state.isTransition === true) {
					nowStyle.animation = 't-current-' + this.id + ' 1s';
					nextStyle.animation = 't-next-' + this.id + ' 1s';
				}

				console.log('hello', this.state)
				return (
					<div style={ Object.assign({}, containerStyle,  { position: 'relative' }, data.style) }>
						<style key={ 0 } dangerouslySetInnerHTML={{__html: sanitizeCSS(containerCSS)}} />
						<div key={ 1 } className={ 'container-' + this.id + '-current' } style={ nowStyle } onAnimationEnd={ (e) => this.setState({ isTransition: false, currentItem: this.state.nextItem, nextItem: null }, () => console.log('trnsition done hello')) }>
							{ this.renderItems(index, this.state.currentItem) }
						</div>
						<div key={ 2 } className={ 'container-' + this.id + '-next' } style={ nextStyle } onAnimationEnd={ (e) => console.log('hello next end', e) }>
							{ this.renderItems((index + 1) % data.items.length, this.state.nextItem) }
						</div>
					</div>
				);
		}
	}

	renderItems (singleIndex, item) {
		if (!this.props.data || !this.props.data.items) {
			return;
		}
		let { width, height, data, data: { items } } = this.props;
		let { state, transition } = this.state;

		if (data.states && (data.state !== undefined || this.props.state !== undefined)) {
			data = Object.assign({}, data, data.states[data.state || this.props.state])

			transition = transition || data.transition;
		}

		let renderItem = (item, index) => (
			<OverlayItem
				width={ width }
				height={ height }
				state={ state || this.props.state }
				transition={ transition || this.props.transition }
				key={ item.id || index }
				data={ item } />
		);

		return singleIndex !== undefined ? renderItem(item || items[singleIndex], singleIndex) : items.map(renderItem)
	}

	render () {
		let { data, width, height } = this.props;

		if (data.states && (data.state !== undefined || this.props.state !== undefined)) {
			data = Object.assign({}, data, data.states[data.state || this.props.state])
		}

		let style = {
			position: 'absolute',
			width: (data.w || 100) + '%',
			height: (data.h || 100) + '%',
			top: (data.y || 0) + '%',
			opacity: (isNaN(data.o) ? 1 : data.o),
			left: (data.x || 0) + '%'
		}

		switch (data.d) {
			case 'root': case 'r':
				style.height = (parseFloat(style.height) * height / 100) + 'px';
				style.width = (parseFloat(style.width) * width / 100) + 'px';
				style.top = (parseFloat(style.top) * height / 100) + 'px';
				style.left = (parseFloat(style.left) * width / 100) + 'px';
				break;
			case 'height': case 'h':
				style.height = (parseFloat(style.height) * height / 100) + 'px';
				style.width = (parseFloat(style.width) * (height/width)) + 'px';
				break;
			case 'width': case 'w':
				style.width = (parseFloat(style.width) * width / 100) + 'px';
				style.height = (parseFloat(style.height) * (width/height)) + 'px'
				break;
			default: break;
		}

		if (data.t == 'container' && data.align == 'right') {
			style.right = style.left;
			style.left = undefined;
		}

		if (data.t == 'text') {
			style.display = 'flex';
			style.alignItems = data.verticalAlign || 'center';
			style.justifyContent = data.align || 'start';
		}


		return (
			<div style={style}>
				{ this.renderBody() }
			</div>
		)
	}
}

export default class Overlay extends React.Component {
	renderItems ({ width, height }) {
		if (!this.props.data || !this.props.data.items) {
			return;
		}
		let items = this.props.data.items;

		return items.map((item, index) => (
			<OverlayItem width={ width } height={ height } index={ index } data={ item } />
		))
	}
	renderMain (props) {
		return (
			<div style={{ flex: 1, position: 'relative' }}>
				{ this.renderItems(props) }
			</div>
		)
	}

	render () {
		if (this.props.width && this.props.height) {
			return <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>{ this.renderMain(this.props) }</div>
		}

		return (
			<SafeView ratio={ 9/16 }>
				{ (props) => this.renderMain(props) }
			</SafeView>
		)
	}	
}