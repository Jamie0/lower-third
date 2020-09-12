import React from 'react';
import { TextField, PrimaryButton, Text, Toggle, ChoiceGroup } from '@fluentui/react';
import style from './style.css';

import Overlay from '../overlay';

export default class Live extends React.Component {
	state = {
		data: {}
	}

	componentWillMount () {

		if (typeof EventSource != 'undefined') {
			this.source = new EventSource('/api/subscribe');
			this.source.onmessage = (e) => {
				console.log('message', e)

				let data = JSON.parse(e.data);

				this.setState({
					data
				})
			}
		}

		this.setState({
			data: this.props.data || null
		})
	}

	render () {
		if (!this.state.data) return null;
		return <Overlay data={ this.state.data } />;
	}	
}