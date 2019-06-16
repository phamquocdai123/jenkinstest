import React, { Component } from 'react';
import './CourseStreamChat.css';
import { Input, InputAdornment, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import ChatItem from '../../../CommonComponent/ChatItem';

class CourseStreamChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messChat: '',
			messArr: []
		};
	}

	handleChangeMess = (e) => {
		this.setState({ messChat: e.target.value });
	};

	handleSendMess = (e) => {
		if (e.key === 'Enter' || e.key === undefined) {
			const messChat = this.state.messChat;
			if (messChat && messChat !== '') {
				let dataChat = {
					namechat: 'Duy Le',
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
		const heightBox = this.props.heightBox - 120;
		return (
			<div className="course-stream-chat">
				<div className="stream-chat-box" style={{maxHeight: heightBox}}>
					{messArr.length > 0 ? (
						messArr.map((mess, index) => {
							return <ChatItem key={index} dataChat={mess} />;
						})
					) : null}
				</div>
				<div className="stream-chat-input">
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
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pageChat: state.pageChat
});

export default connect(mapStateToProps, null)(CourseStreamChat);
