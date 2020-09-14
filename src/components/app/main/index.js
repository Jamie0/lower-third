import React from 'react';
import { TextField, PrimaryButton, DefaultButton, IconButton, Text, Toggle, ChoiceGroup } from '@fluentui/react';
import style from './style.css';

import Overlay from '../overlay';

export default class Main extends React.Component {
	state = {
		data: {},
		edited: false
	}

	componentWillMount () {
		this.setState({
			data: this.props.data,
			live: JSON.parse(JSON.stringify(this.props.data))
		})
	}

	renderGroup (group, level) {
		let body = [];
		let controlBodyStyle = { padding: '0px 5px 5px 0', boxSizing: 'border-box' };

		level = level || 1;
		if (group.items) {
			body = group.items && group.items.map((g) => this.renderGroup(g, group.id ? level + 1 : level))
		}

		if (group.id) {
			let Tag = 'h' + Math.min(6, level + 1)
			return (
				<div key={ group.id } style={Object.assign({}, controlBodyStyle, { paddingLeft: '15px', paddingRight: '15px' })}>
					<Text><Tag>{ group.name || group.id }</Tag></Text>
					{ this.renderControlBody(group, body) }
				</div>
			)
		} else if (group.editable) {
			body.unshift(<div style={controlBodyStyle}>{ this.renderControlBody(group) }</div>)
		}

		return body;
	}

	renderControlBody (group, body) {
		let data = [];

		let buttonStyle = { root: { width: '32px', minWidth: '32px', padding: '0 0' }};
		let controlBodyStyle = { padding: '0px 5px 5px 0', boxSizing: 'border-box' };

		if (group.allStates) {
			if (false && group.allStates.length == 2) {
				// data.push(<)
			} else {
				data.push(
					<ChoiceGroup
						key={ 0 }
						selectedKey={ group.state }
						onChange={ (e, v) => {
							if (!v.key) return;

							group.state = v.key;
							this.setState({
								data: Object.assign({}, this.state.data),
								edited: true
							})
						} }
						options={ Object.keys(group.allStates).map((c) => ({ key: c, text: group.allStates[c] })) } />
				)
			}
		}

		if (group.editable) {
			switch (group.t) {
				case 'stack':
					data.push(
						<div style={controlBodyStyle}>
							<DefaultButton text="Advance" onClick={ (e, v) => {
								group.index = (group.index + 1) % (group.items.length);
								this.setState({
									data: Object.assign({}, this.state.data),
									edited: true
								})
							}} />
						</div>
					)
					body = body.map((b, index) => (
						<div style={{ display: 'flex' }}>
							<div style={{ flex: 1 }}>{ b }</div>
							{ index == 0 ? (
								<DefaultButton styles={buttonStyle} iconProps={{ iconName: 'Add' }} onClick={ () => {
									let newItem = JSON.parse(JSON.stringify(group.items[0]));
									newItem.text = newItem.prefix || '';
									group.items.push(newItem)
									this.setState({
										data: Object.assign({}, this.state.data),
										edited: true
									})
								}} />
							) : (
								<DefaultButton styles={buttonStyle} iconProps={{ iconName: 'Cancel' }} onClick={ () => {
									group.items.splice(index, 1)
									this.setState({
										data: Object.assign({}, this.state.data),
										edited: true
									})
								}} />
							) }
						</div>
					))
					break;
				case 'text':
					data.push(
					<div key={ 1 }>
						<TextField
							onChange={ (e, v) => {
								console.log('change!', e, v)
								group.text = v;
								this.setState({
									data: Object.assign({}, this.state.data),
									edited: true
								})
							} }
							componentRef={ (r) => r && (r._onInputChange=(e, v) => r.props.onChange(e, e.target.value))}
							value={ group.text }
							label={ group.label || group.name || group.id } />
					</div>
					);
					break;
			}
		}

		return [data, body];
	}

	renderControls () {
		return this.state.data.items.map((item) => this.renderGroup(item))
	}

	_send = () => {
		let body;
		fetch('/api/transition', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body = JSON.stringify(this.state.data)
		}).then((a) => {
			this.setState({
				live: JSON.parse(body),
				edited: false
			})
		})
	}

	render ({}, {alpha}) {
		console.log('!!', this.state.data)
		return (
			<div className={ style.main }>
				<div className={ style.previews }>
					<b>Preview</b>
					<div className={ style.preview }>
						<Overlay data={ this.state.data } width={ 640 } height={ 360 } />
					</div>

					<b>Live</b>
					<div
						className={ alpha ? style.alpha : style.preview }
						onMouseDown={ () => this.setState({ alpha: true }) }
						onMouseUp={ () => this.setState({ alpha: false }) }
						onDoubleClick={ () => this.setState({ alpha: !this.state.alpha }) }>
						<Overlay data={ this.state.live } width={ 640 } height={ 360 } />
					</div>
				</div>

				{ /* <div className={ style.alpha }>
					<Overlay data={ this.props.ddata } width={ 640 } height={ 360 } />
				</div> */ }

				<div className={ style.pane }>
					<div style={{ textAlign: 'right', padding: 10, position: 'sticky', boxSizing: 'border-box', zIndex: 10, top: 0, background: '#BBB', marginLeft: '0px', width: '100%' }}>
						<PrimaryButton
							text="Transition"
							onClick={ this._send }
							disabled={ !this.state.edited } />
					</div>

					{ this.renderControls() }

					<div style={{ height: '30px' }}></div>
				</div>

			</div>
		)
	}	
}