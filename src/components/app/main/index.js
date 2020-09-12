import React from 'react';
import { TextField, PrimaryButton, DefaultButton, Text, Toggle, ChoiceGroup } from '@fluentui/react';
import style from './style.css';

import Overlay from '../overlay';

export default class Main extends React.Component {
	state = {
		data: {},
		edited: false
	}

	componentWillMount () {
		this.setState({
			data: this.props.data
		})
	}

	renderGroup (group, level) {
		let body = [];

		level = level || 1;
		if (group.items) {
			body = group.items && group.items.map((g) => this.renderGroup(g, group.id ? level + 1 : level))
		}

		if (group.id) {
			let Tag = 'h' + Math.min(6, level + 1)
			return (
				<div key={ group.id } style={{ paddingLeft: '15px' }}>
					<Text><Tag>{ group.name || group.id }</Tag></Text>
					{ this.renderControlBody(group) }

					{ body }
				</div>
			)
		} else if (group.editable) {
			body.unshift(this.renderControlBody(group))
		}

		return body;
	}

	renderControlBody (group) {
		let data = [];

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
						<DefaultButton text="Advance" onClick={ (e, v) => {
							group.index = (group.index + 1) % (group.items.length);
							this.setState({
								data: Object.assign({}, this.state.data),
								edited: true
							})
						}} />
					)
					break;
				case 'text':
					data.push(
					<div key={ 1 }>
						<TextField
							onChange={ (e, v) => {
								console.log('change!', e, v)
								console.log('le hi', v, e)
								group.text = v;
								this.setState({
									data: Object.assign({}, this.state.data),
									edited: true
								})
							} }
							componentRef={ (r) => r && (r._onInputChange=(e, v) => r.props.onChange(null, e.target.value))}
							value={ group.text }
							label={ group.label || group.name || group.id } />
					</div>
					);
					break;
			}
		}

		return data;
	}

	renderControls () {
		return this.state.data.items.map((item) => this.renderGroup(item))
	}

	_send = () => {
		fetch('/api/transition', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state.data)
		})
	}

	render () {
		console.log('!!', this.state.data)
		return (
			<div className={ style.main }>				
				<div className={ style.preview }>
					<Overlay data={ this.state.data } width={ 640 } height={ 360 } />
				</div>

				{ /* <div className={ style.alpha }>
					<Overlay data={ this.props.ddata } width={ 640 } height={ 360 } />
				</div> */ }

				<div className={ style.pane }>
					<div style={{ textAlign: 'right', padding: 10 }}>
						<PrimaryButton
							text="Transition"
							onClick={ this._send }
							disabled={ !this.state.edited } />
					</div>

					{ this.renderControls() }
				</div>

			</div>
		)
	}	
}