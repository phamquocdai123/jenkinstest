import React, { Component } from 'react';
import './ChatItem.css';
import { Typography } from '@material-ui/core';

import avaIco1 from '../../../../assets/images/ico/chat-ico1.svg';
import avaIco2 from '../../../../assets/images/ico/chat-ico2.svg';

class ChatItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nameChat: '',
			commentChat: ''
		};
		this.avaArr = [ avaIco1, avaIco2 ];
		this.colorArr = [ 'green', 'blue' ];
		this.avaSel = null;
		this.colorSel = null;
	}

	componentWillMount() {
		this.setAvatar();
		this.setUserName();
	}

	setAvatar = () => {
		let randomNumber = Math.floor(Math.random() * this.avaArr.length);
		this.avaSel = this.avaArr[randomNumber];
	};

	setUserName = () => {
		let randomNumber = Math.floor(Math.random() * this.colorArr.length);
		this.colorSel = this.colorArr[randomNumber];
	};

	render() {
		const avaSel = this.avaSel;
		const colorSel = this.colorSel;
		const { dataChat } = this.props;
		return (
			<div className="hw-chat-item d-flex">
				<div className="hw-chat-item-ava">
					<img src={avaSel} style={{ width: '1.5em', height: '1.5em' }} alt="" />
				</div>
				<div className="hw-chat-item-content d-flex flex-column ">
					<div className="hw-chat-item-name">
						<Typography component="h2" variant="h6" style={{ color: colorSel }}>
						{console.log(dataChat)}
							{dataChat !== undefined ? dataChat.namechat : null}:
						</Typography>
					</div>
					<div className="hw-chat-item-mess"> {dataChat !== undefined ? dataChat.commentchat : null}</div>
				</div>
			</div>
		);
	}
}

export default ChatItem;
