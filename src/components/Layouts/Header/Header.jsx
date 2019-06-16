import React, { Component } from 'react';
import './Header.css';
import { withRouter, NavLink } from 'react-router-dom';
import logo from '../../../assets/images/pic/logo.png';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Paper, Fab, MenuList, MenuItem, Popper, Grow, ClickAwayListener } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import WebService from '../../../services/WebService';

import * as actions from '../../../actions';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bgHeader: 'transparent',
			navColor: 'black',
			shadowHeader: 'none',
			userMenuOpen: false,
			anchorEl: null
		};
		this.webService = new WebService();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.headerState) {
			this.setStyleHeader(true);
		} else {
			this.setStyleHeader(false);
		}
	}

	handleLoginClick = () => {
		this.props.showLogin("0");
	};

	handleRegisterClick = () => {
		this.props.showLogin("1");
	};

	handleUpdateAnchorEl = (anchorEl) => {
		if (this.state.anchorEl === null) {
			this.setState({ anchorEl: anchorEl });
		} else {
			return;
		}
	};

	handleToggleUserMenu = () => {
		this.setState((state) => ({ userMenuOpen: !state.userMenuOpen }));
	};

	handleSelUserMenu = (event, type) => {
		event.preventDefault();
		switch (type) {
			case typeUserMenu.USER_INFO:
				this.processUserInfo();
				break;
			case typeUserMenu.USER_LOGOUT:
				this.processUserLogout();
				break;
			default:
				break;
		}
	};

	handleCloseUserMenu = (event) => {
		if (this.state.anchorEl.contains(event.target)) {
			return;
		}
		this.setState({ userMenuOpen: false });
	};

	processUserInfo = () => {
		this.props.history.push('/user');
	};

	processUserLogout = () => {
		this.props.logout();
		this.webService.destroyUserInfo();
	};

	setStyleHeader = (res) => {
		if (res) {
			this.setState({
				bgHeader: 'white',
				shadowHeader:
					'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
				navColor: '#02BF99'
			});
		} else {
			this.setState({
				bgHeader: 'transparent',
				shadowHeader: 'none',
				navColor: 'black'
			});
		}
	};

	isLogin = (isLogin) => {
		return (isLogin === false && this.webService.isLogin() === true) || (isLogin === true && this.webService.isLogin() === false) || (isLogin === true && this.webService.isLogin() === true)
	}

	render() {
		const { userMenuOpen, anchorEl, bgHeader, shadowHeader, navColor } = this.state;
		const {isLogin} = this.props.userAuth;
		return (
			<div className="hw-header">
				<div className="container">
					<AppBar
						position="fixed"
						style={{ backgroundColor: bgHeader, boxShadow: shadowHeader, zIndex: 100 }}
					>
						<Toolbar style={styles.toolbar}>
							<img
								height="50"
								width="70"
								src={logo}
								className="header-logo"
								alt="logo"
								style={styles.logo}
							/>
							<div className="hw-header-menu" style={styles.toobarNav}>
								<NavLink to="">
									<span style={{ color: navColor }}>TRANG CHỦ</span>
								</NavLink>
								<span style={{ color: navColor }}>GIỚI THIỆU</span>
								<NavLink to="/khoa-hoc">
									<span style={{ color: navColor }}>KHOÁ HỌC</span>
								</NavLink>
								<NavLink to="/about">
									<span style={{ color: navColor }}>VỀ CHÚNG TÔI</span>
								</NavLink>

								<span>
									<a style={{ color: navColor }} href="https://tinyurl.com/surveyhelloworld" target="_blank">
										KHẢO SÁT
									</a>
								</span>
							</div>
							{this.isLogin(isLogin) === false ? (
								userDeactive(this.handleLoginClick, this.handleRegisterClick)
							) : (
								userActive(
									this.webService.getUserName(),
									userMenuOpen,
									anchorEl,
									this.handleToggleUserMenu,
									this.handleSelUserMenu,
									this.handleCloseUserMenu,
									this.handleUpdateAnchorEl
								)
							)}
						</Toolbar>
					</AppBar>
				</div>
			</div>
		);
	}
}

const userDeactive = (handleLoginClick, handleRegisterClick) => {
	return (
		<div className="hw-header-unauthen" style={styles.toobarDiv}>
			<div className="hw-header-unauthen-login">
				<Fab
					variant="extended"
					size="medium"
					color="secondary"
					aria-label="Login"
					className="hw-header-unauthen-login-btn"
					onClick={handleLoginClick}
				>
					ĐĂNG NHẬP
				</Fab>
			</div>
			<div className="hw-header-unauthen-register">
				<Fab
					variant="extended"
					size="medium"
					aria-label="Register"
					className="hw-header-unauthen-register-btn"
					onClick={handleRegisterClick}
				>
					ĐĂNG KÍ
				</Fab>
			</div>
		</div>
	);
};

const userActive = (
	userName,
	userMenuOpen,
	anchorEl,
	handleToggleUserMenu,
	handleSelUserMenu,
	handleCloseUserMenu,
	handleUpdateAnchorEl
) => {
	return (
		<div
			className="hw-header-authen"
			style={styles.toobarDiv}
			ref={(node) => {
				handleUpdateAnchorEl(node);
			}}
			onClick={handleToggleUserMenu}
		>
			<Paper style={styles.paperBoxUser} elevation={4}>
				<div className="hw-header-authen-content d-flex align-items-center">
					<div className="hw-header-authen-icon">
						<i className="far fa-user" />
					</div>
					<div className="hw-header-authen-name">
						<span>{userName}</span>
					</div>
					<div className="hw-header-authen-menu">
						<Fab
							aria-owns={userMenuOpen ? 'menu-list-grow' : undefined}
							aria-haspopup="true"
							centerRipple
							size="small"
							style={styles.userMenuSelBtn}
							variant="round"
						>
							<KeyboardArrowDown style={styles.userMenuSelIco} fontSize="large" />
						</Fab>
						{userActiveMenu(userMenuOpen, anchorEl, handleSelUserMenu, handleCloseUserMenu)}
					</div>
				</div>
			</Paper>
		</div>
	);
};

const userActiveMenu = (open, anchorEl, handleSelUserMenu, handleCloseUserMenu) => {
	return (
		<Popper open={open} anchorEl={anchorEl} transition disablePortal>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					id="menu-list-grow"
					style={{ transformOrigin: 'center bottom', anchorOrigin: 'center bottom ' }}
				>
					<Paper style={styles.paperBoxUserMenu}>
						<ClickAwayListener onClickAway={handleCloseUserMenu}>
							<MenuList>
								<MenuItem onClick={(e, type = typeUserMenu.USER_INFO) => handleSelUserMenu(e, type)}>
									Thông tin cá nhân
								</MenuItem>
								<MenuItem onClick={(e, type = typeUserMenu.USER_LOGOUT) => handleSelUserMenu(e, type)}>
									Đăng xuất
								</MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
};

const typeUserMenu = {
	USER_INFO: '0',
	USER_LOGOUT: '1'
};

const styles = {
	toolbar: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	toobarDiv: {
		flex: '1',
		display: 'flex',
		justifyContent: 'center'
	},
	toobarNav: {
		flex: '2',
		display: 'flex',
		justifyContent: 'left'
	},
	paperBoxUser: {
		backgroundColor: 'rgba(255, 255, 255, 0.212)'
	},
	paperBoxUserMenu: {
		marginTop: '0.25em'
	},
	userMenuSelBtn: {
		backgroundColor: 'transparent',
		outline: '0',
		border: 'none',
		boxShadow: 'none'
	},
	userMenuSelIco: {
		color: 'rgba(255, 0, 0, 0.5)'
	},
	logo: {
		height: '60',
		width: '100',
		margin: '10px'
	}
};

const mapStateToProps = (state) => ({
	userAuth: state.userAuth
});

export default withRouter(connect(mapStateToProps, actions)(Header));
