import React from 'react';
import { Router, Match } from 'preact-router';

import Route from './route';

import Main from './main';
import Live from './live';
import Overlay from './overlay';

const DEFAULT = {
			// NOTE: x/y/w/h are all PERCENTAGE based units (i.e. a grid with 100 squares)
			items: [
				{
					x: 5,
					y: 5,
					w: 15,
					h: 15,
					t: 'image',
					id: 'DOG',
					name: 'DOG',
					src: require('../../resources/logo.png').default,
					align: 'top left',
					state: 'visible',
					o: 0,
					allStates: {
						'visible': 'Visible',
						'hidden': 'Hidden'
					},
					states: {
						'visible': {
							o: 0.8
						},
						'hidden': {
							o: 0
						}
					}
				},
				{
					x: 5,
					y: 5,
					w: 6,
					h: 5,
					d: 'root',
					t: 'container',
					id: 'Live',
					name: 'Live',
					align: 'right',
					state: 'visible',
					o: 1,
					allStates: {
						'visible': 'Visible',
						'hidden': 'Hidden'
					},
					states: {
						'visible': {
							style: {
								backgroundColor: '#C00',
								opacity: 1
							},
							transition: 'visible'
						},
						'hidden': {
							style: {
								opacity: 0
							},
							transition: 'hidden'
						}
					},
					firstTransition: false,
					animations: {
						'hidden': {
							frames: 'from { opacity: 1 } to { opacity: 0; }',
							duration: '0.1s ease'
						},
						'visible': {
							frames: 'from { opacity: 0; top: 33%; } to { opacity: 1; top: 0; }',
							duration: '0.1s ease'
						},
					},
					items: [{
						x: 0,
						y: 0,
						w: 100,
						h: 0,
						t: 'container',
						items: [{
							t: 'text',
							text: 'LIVE',
							align: 'center',
							size: 8
						}],
						states: {
							'hidden': {
								transition: 'hidden'
							},
							'visible': {
								transition: 'visible'
							}
						},
						animations: {
							'hidden': {
								frames: 'from { opacity: 1 } to { opacity: 0; }',
								duration: '0.5s ease'
							},
							'visible': {
								frames: 'from { opacity: 0 } to { opacity: 1; }',
								duration: '0.3s ease'
							},
						},
						style: { color: '#FFF', textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial' }
					}]
				},
				{
					x: 0,
					y: 85,
					w: 100,
					t: 'container',
					h: 15,
					id: 'lower-3',
					name: 'Lower Third',
					allStates: {
						'closed': 'Collapsed',
						'open': 'Expanded'
					},
					state: 'closed',
					items: [
						{
							states: {
								'closed': {
									x: 0,
									y: 0,
									w: 100,
									h: 20,
									d: 'root',
									t: 'container',
									style: {
										backgroundColor: 'rgba(0, 0, 0, 0.5)'
									},
									transition: 'close'
								},
								'open': {
									x: 0,
									y: -15,
									w: 100,
									h: 20,
									d: 'root',
									t: 'container',
									style: {
										backgroundColor: 'rgba(0, 0, 0, 0.5)'
									},
									transition: 'open'
								},
							},
							firstTransition: false,
							animations: {
								'close': {
									frames: 'from { top: -66% } to { top: 0; }',
									duration: '0.3s ease'
								},
								'open': {
									frames: 'from { top: 66% } to { top: 0; }',
									duration: '0.3s ease'
								},
							},
							items: [
								{
									x: 14,
									y: 0,
									w: 13,
									h: 5,
									d: 'root',
									t: 'container',
									style: {
										backgroundColor: '#C00'
									},
									items: [
										{
											x: 5,
											y: 0,
											w: 43,
											h: 100,
											t: 'image',
											src: require('../../resources/bbc-logo.svg').default,
										},
										{
											x: 52,
											y: 2,
											w: 43,
											h: 96,
											t: 'image',
											src: require('../../resources/news-text.svg').default
										}
									]
								},
								{
									t: 'container',
									x: 15,
									y: 5,
									w: 70,
									h: 1,
									d: 'root',
									animations: {
										'open': {
											frames: '0% { opacity: 0; } 20% { opacity: 0 } 100% { opacity: 1; }',
											duration: '0.3s ease-in-out'
										},
										'close': {
											frames: '0% { opacity: 1; }  100% { opacity: 0; }',
											duration: '0.1s ease'
										}
									},
									items: [
										{
											x: 0,
											y: 0,
											w: 100,
											h: 9,
											d: 'root',
											t: 'text',
											size: 15,
											editable: true,
											id: 'title',
											name: 'Main Title',
											style: {
												color: '#FFF',
												fontFamily: 'Georgia'
											},
											text: 'Message From Mars'
										},
										{
											x: 0,
											y: 9,
											w: 100,
											h: 15,
											d: 'root',
											t: 'stack',
											editable: true,
											id: 'subtitle',
											name: 'Main Subtitle',
											index: 0,
											transitions: {
												current: {
													style: {
														top: '0px'
													},
													transition: {
														top: '-50%'
													}
												},
												next: {
													style: {
														top: '50%'
													},
													transition: {
														top: '0px'
													}
												}
											},
											style: {
												color: '#FFF',
												overflow: 'hidden',
												fontFamily: 'Georgia'
											},
											items: [
												{
													w: 100,
													h: 0,
													t: 'text',
													text: 'NASA have confirmed that the message received yesterday is genuine',
													editable: true,
													verticalAlign: 'top',
													size: 10
												},
												{
													w: 100,
													h: 0,
													t: 'text',
													text: 'It read "we will bring fire in 2020"',
													editable: true,
													size: 10
												},
											]
										}
									]
								}
							]
						},
						{
							x: 0,
							y: 5,
							w: 100,
							h: 10,
							d: 'root',
							t: 'container',
							style: {
								backgroundColor: '#fff',
								fontWeight: 'bold'
							},
							items: [
								{
									x: 15,
									y: 0,
									w: 60,
									h: 10,
									d: 'root',
									t: 'container',
									style: {
										color: '#C00',
										overflow: 'hidden',
										fontFamily: 'Arial',
									},
									items: [
										{
											x: 0,
											y: 0,
											w: 60,
											h: 8,
											d: 'root',
											t: 'stack',
											editable: true,
											id: 'subtitle',
											name: 'Ticker Text',
											index: 0,
											transitions: {
												current: {
													style: {
														top: '0px'
													},
													transition: {
														top: '-100%'
													}
												},
												next: {
													style: {
														top: '100%'
													},
													transition: {
														top: '0px'
													}
												}
											},
											style: {
											},
											items: [
												{
													x: 0,
													y: 0,
													w: 100,
													h: 100,
													t: 'text',
													size: 9,
													text: '▪ Second 100 Days: Trump Declares War On China',
													editable: true,
												},
												{
													x: 0,
													y: 0,
													w: 100,
													h: 100,
													t: 'text',
													size: 9,
													text: '▪ NATO has disbanded',
													editable: true,
												}
											]
										}
									]
								},

								{
									x: 14.5,
									y: 0,
									w: 6,
									h: 5,
									align: 'right',
									d: 'root',
									t: 'container',
									style: {
										backgroundColor: '#C00'
									},
									items: [
										{
											x: 0,
											y: 0,
											w: 100,
											h: 100,
											t: 'text',
											text: '12:34',
											align: 'center',
											size: 8,
											style: { color: '#FFF', textAlign: 'center', display: 'block', fontFamily: 'Arial' }
										}
									]
								},
							]
						},

					]
				}
			]
		}


export default class App extends React.Component {

	constructor (props) {
		super(props);

		console.log('construct og props', props)

		if (props.CLI_DATA && props.CLI_DATA.preRenderData) {
			props = props.CLI_DATA.preRenderData;
		}

		this.state = {
			_data: {
				[props.url]: props.data,
				fetch: this.fetch
			},
			ddata: DEFAULT
		}
	}

	fetch = async (url) => {
		if (typeof window == 'undefined') return;

		try {
			let resp = await window.fetch('/api' + url);
			let json = await resp.json();

			let expires = resp.headers.get('expires');

			this.setState((oldState) => ({
				_data: Object.assign({}, oldState._data, {
					[url]: Object.assign(json, {
						___meta: {
							status: resp.status,
							burnable: !!expires,
							burn: this.burn.bind(this, url)
						}
					})
				})
			}))
		} catch (e) {
			this.setState((oldState) => ({
				_data: Object.assign({}, oldState._data, {
					[url]: null
				})
			}))
			return null;
		}
	}

	burn = (url) => {
		this.setState((oldState) => ({
			_data: Object.assign({}, oldState._data, {
				[url]: undefined
			})
		}))
	}

	handleRoute = async ({ url }) => {
		this.state._data[url] || this.fetch(url);
	}

	render (props, { _data, ddata }) {
		if (props.CLI_DATA)
			props = props.CLI_DATA.preRenderData;

		let { url } = props;

		url = typeof window == 'undefined' ? url : window.location.pathname;

		console.log('! main render', url, this.props)
		return (
			<div>
				<Router url={ url } onChange={ this.handleRoute }>
					<Route component={ Main } _data={ _data } default />
					<Route component={ Live } _data={ _data } path="/live" />
				</Router>
			</div>
		);
	}
}
