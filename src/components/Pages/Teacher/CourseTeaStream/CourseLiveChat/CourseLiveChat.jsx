import React, { Component } from 'react';
import './CourseLiveChat.css';
import { Input, InputAdornment, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';

import WebService from '../../../../../services/WebService';
import ChatItem from '../../../CommonComponent/ChatItem';

class CourseLiveChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messChat: '',
			messArr: []
		};
		this.webService = new WebService();
	}

	handleChangeMess = (e) => {
		this.setState({ messChat: e.target.value });
	};

	handleSendMess = (e) => {
		if (e.key === 'Enter' || e.key === undefined) {
			const messChat = this.state.messChat;
			const nameChat = this.webService.getUserName() + ' ' + '(Giao vien)';
			if (messChat && messChat !== '') {
				let dataChat = {
					namechat: nameChat,
					commentchat: messChat
				};
				this.setState({ messChat: '' }, () => {
					this.props.sendDataMess(dataChat);
				});
			}
		} else {
			return;
		}
	};

	render() {
		const inputVal = this.state.messChat;
		const { messArr } = this.props.pageChat;
		return (
			<div className="course-live-chat">
				<div className="live-chat-box">
					{messArr.length > 0 ? (
						messArr.map((mess, index) => {
							return <ChatItem key={index} dataChat={mess} />;
						})
					) : null}
				</div>
				<div className="live-chat-input">
					<Input
						fullWidth
						onKeyPress={this.handleSendMess}
						onChange={this.handleChangeMess}
						value={inputVal}
						autoFocus={true}
						placeholder="Enter message"
						inputProps={{
							'aria-label': 'Description'
						}}
						endAdornment={
							<InputAdornment position="end">
								<IconButton aria-label="Send" onClick={this.handleSendMess}>
									<i className="far fa-paper-plane stream-chat-input-btn" />
								</IconButton>
							</InputAdornment>
						}
					/>
				</div>
				{console.log(this.props.pageChat)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pageChat: state.pageChat
});

export default connect(mapStateToProps, null)(CourseLiveChat);
