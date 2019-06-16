import React, { Component } from 'react';
import './UserAccount.css';
import { connect } from 'react-redux';
import { Typography, TextField, InputAdornment, Button } from '@material-ui/core';
import WebService from '../../../../services/WebService';
import SystemHelper from '../../../../services/SystemHelper';
import * as actions from '../../../../actions';

class UserAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			name: '',
			phone: '',
			birth: '',
			address: '',
			email: '',
			avatar: null
		};
		this.webService = new WebService();
		this.helper = new SystemHelper();
	}

	componentWillMount() {
		this.initData();
	}

	initData = () => {
		this.setState({
			id: this.webService.getUserId(),
			name: this.webService.getUserName(),
			phone: this.webService.getPhone(),
			birth: this.webService.getBirth().slice(0,10),
			address: this.webService.getAddress(),
			email: this.webService.getEmail(),
			avatar: this.webService.getAvatar()
		});
	};

	handleUpdateClick = async (e) => {
		const { name, phone, birth, address, email } = this.state;
		const vaildate = this.helper.checkValidateUpdateInfo(name, phone, birth, address, email);
		if (vaildate !== '') {
			this.props.showNotice(vaildate, 0);
		} else {
			this.callApiUpdateAccountInfo();
		}
	};

	callApiUpdateAccountInfo = async () => {
    let userData = new FormData();
    console.log(this.state);
		userData.append('Id', this.state.id);
		userData.append('Name', this.state.name);
		userData.append('PhoneNumber', this.state.phone);
		userData.append('BirthDate', this.state.birth);
		userData.append('Address', this.state.address);
		userData.append('Email', this.state.email);
		userData.append('Avatar', this.state.avatar);
		const resApi = await this.webService.updateAccountInfo(userData);
		this.handleUpdateAccountInfoApi(resApi);
	};

	handleUpdateAccountInfoApi = (resApi) => {
		if (resApi.returnCode === 0 || resApi.returnCode === -1) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			this.props.showNotice(resApi.returnMess, 1);
		}
	};

	handleNameChange = (e) => {
		this.setState({
			name: e.target.value
		});
	};

	handlePhoneChange = (e) => {
		this.setState({
			phone: e.target.value
		});
	};

	handleBirthChange = (e) => {
		this.setState({
			birth: e.target.value
		});
	};

	handleAddressChange = (e) => {
		this.setState({
			address: e.target.value
		});
	};

	handleEmailChange = (e) => {
		this.setState({
			email: e.target.value
		});
	};

	handleAvatarChange = (e) => {
		this.setState({
			avatar: e.target.files[0]
		});
	};

	render() {
		const { name, phone, birth, address, email, avatar } = this.state;
		return (
			<div className="hw-user-account d-flex justify-content-center">
				<div className="container">
					<div className="user-account-action">
						<Typography component="h5" variant="h6">
							Thông tin tài khoản
						</Typography>
					</div>
					<div className="user-account-info">
						<div className="row row-1">
							<div className="col-md-6">
								<TextField
									fullWidth
									id="input-with-icon"
									label="Tên"
									style={styles.inputField}
									value={name}
									onChange={this.handleNameChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i
													className="fas fa-user-circle"
													style={{ fontSize: '1.5em', color: '#02BF99' }}
												/>
											</InputAdornment>
										)
									}}
								/>
							</div>
							<div className="col-md-6">
								<TextField
									fullWidth
									id="input-with-icon"
									label="Số điện thoại"
									type="tel"
									value={phone}
									style={styles.inputField}
									onChange={this.handlePhoneChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i
													className="fas fa-phone-square"
													style={{ fontSize: '1.5em', color: '#02BF99' }}
												/>
											</InputAdornment>
										)
									}}
								/>
							</div>
						</div>
						<div className="row row-1">
							<div className="col-md-6" style={{ marginLeft: 0 }}>
								<TextField
									fullWidth
									id="input-with-icon"
									label="Ngày sinh"
									type="date"
									value={birth}
									style={styles.inputField}
									onChange={this.handleBirthChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i
													className="fas fa-birthday-cake"
													style={{ fontSize: '1.5em', color: '#02BF99' }}
												/>
											</InputAdornment>
										)
									}}
								/>
							</div>
							<div className="col-md-6">
								<TextField
									fullWidth
									id="input-with-icon"
									label="Địa chỉ"
									value={address}
									style={styles.inputField}
									onChange={this.handleAddressChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i
													className="fas fa-map-marker-alt"
													style={{ fontSize: '1.5em', color: '#02BF99' }}
												/>
											</InputAdornment>
										)
									}}
								/>
							</div>
						</div>
						<div className="row row-1">
							<div className="col-md-6">
								<TextField
									fullWidth
									id="input-with-icon"
									label="Email"
									type="email"
									value={email}
									style={styles.inputField}
									onChange={this.handleEmailChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i
													className="fas fa-envelope-square"
													style={{ fontSize: '1.5em', color: '#02BF99' }}
												/>
											</InputAdornment>
										)
									}}
								/>
							</div>
							<div className="col-md-6">
								<TextField
									fullWidth
									id="input-with-icon"
									label="Ảnh đại diện"
									type="file"
									style={styles.inputField}
									onChange={this.handleAvatarChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i
													className="fas fa-image"
													style={{ fontSize: '1.5em', color: '#02BF99' }}
												/>
											</InputAdornment>
										)
									}}
								/>
							</div>
						</div>
					</div>
					<div className="user-account-info d-flex justify-content-center">
						<Button style={styles.btnColor} variant="contained" onClick={this.handleUpdateClick}>
							<b>Cập nhật</b>
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

const styles = {
	inputField: {
		margin: '0.5em'
	},
	btnColor: {
		color: '#fff',
		backgroundColor: '#02BF99'
	}
};

export default connect(null, actions)(UserAccount);
