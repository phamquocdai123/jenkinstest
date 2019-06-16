import React from 'react';
import './UserPage.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import {
	Drawer,
	CssBaseline,
	AppBar,
	Toolbar,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Typography,
	Divider,
	IconButton,
	Avatar
} from '@material-ui/core';
import { Menu, ChevronLeft, ChevronRight } from '@material-ui/icons';

import UserManage from '../../CommonComponent/UserManage';
import UserCourse from '../../CommonComponent/UserCourse';
import UserAccount from '../../CommonComponent/UserAccount';

import WebService from '../../../../services/WebService';
import { USER_PAGE } from '../../../../setting/ThemeUiConfig';
import * as actions from '../../../../actions';
import sample from '../../../../assets/images/pic/hw-homepage-sample.jpg';
import avaBackground from '../../../../assets/images/pic/hw-avatar-border.png';

class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			userMenuIdx: 0
		};
		this.webService = new WebService();
		this.userMenuLabel = [ 'Thông tin chi tiết', 'Lớp học tham gia', 'Lớp học đã tạo', 'Quay về trước' ];
		this.userMenuIcon = [
			<i className="fas fa-portrait fa-2x" />,
			<i className="fas fa-clipboard-list fa-2x" />,
			<i className="far fa-file-alt fa-2x" />,
			<i className="fas fa-sign-out-alt fa-2x" />
		];
	}

	componentWillMount() {
		this.props.isShowHeader(false);
		this.props.isShowHeaderTitle(false);
		this.props.isShowFooter(false);
		this.props.removeTitle();
	}

	componentWillUnmount() {
		this.props.isShowHeader(true);
		this.props.isShowFooter(true);
		this.props.isShowHeaderTitle(true);
	}

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	handleMenuItemSelect = (e, index) => {
		e.preventDefault();
		if (index === 3) {
			this.props.history.goBack();
		} else {
			this.setState({ userMenuIdx: index });
		}
	};

	render() {
		const { classes, theme } = this.props;
		const { open, userMenuIdx } = this.state;

		return (
			<MuiThemeProvider theme={USER_PAGE}>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar
						position="fixed"
						className={classNames(classes.appBar, {
							[classes.appBarShift]: open
						})}
					>
						<Toolbar disableGutters={!open}>
							<IconButton
								color="inherit"
								aria-label="Open drawer"
								onClick={this.handleDrawerOpen}
								className={classNames(classes.menuButton, open && classes.hide)}
							>
								<Menu />
							</IconButton>
							<Typography variant="h6" color="inherit" noWrap>
								{this.userMenuLabel[userMenuIdx]}
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="persistent"
						anchor="left"
						open={open}
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classNames(classes.drawerHeader, classes.drawerHeaderCus)}>
							{UserInfo(classes, this.webService)}
							<IconButton onClick={this.handleDrawerClose}>
								{theme.direction === 'ltr' ? (
									<ChevronLeft style={{ color: 'white' }} />
								) : (
									<ChevronRight />
								)}
							</IconButton>
						</div>
						<Divider />
						<List>
							{this.userMenuLabel.map((text, index) => (
								<ListItem
									key={text}
									button
									selected={userMenuIdx === index}
									onClick={(event) => this.handleMenuItemSelect(event, index)}
								>
									<ListItemIcon>{this.userMenuIcon[index]}</ListItemIcon>
									<ListItemText primary={text} />
								</ListItem>
							))}
						</List>
					</Drawer>
					<main
						className={classNames(classes.content, {
							[classes.contentShift]: open
						})}
					>
						<div className={classes.drawerHeader} />
						{userMenuIdx === 0 ? <UserAccount /> : null}
						{userMenuIdx === 1 ? <UserCourse /> : null}
						{userMenuIdx === 2 ? <UserManage /> : null}
					</main>
				</div>
			</MuiThemeProvider>
		);
	}
}

const UserInfo = (classes, webService) => {
	return (
		<span className={classes.userInf}>
			<div className="user-info-ava">
				<Avatar className={classNames(classes.userAva)} alt="" src={webService.getAvatar()} />
			</div>
			<div className="user-info-content">
				<Typography component="h5" variant="h6" style={{ color: 'white' }}>
					<b>{webService.getUserName()}</b>
				</Typography>
				<Typography component="h5" variant="subtitle1" style={{ color: 'white' }}>
					{webService.getEmail()}
				</Typography>
			</div>
		</span>
	);
};

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 20
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: '0 8px',
		...theme.mixins.toolbar,
		justifyContent: 'flex-end'
	},
	drawerHeaderCus: {
		backgroundImage: `url(${avaBackground})`,
		backgroundSize: 'cover'
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		marginLeft: -drawerWidth
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginLeft: 0
	},
	userInf: {
		display: 'flex',
		width: '100%',
		justifyContent: 'flex-start',
		flexDirection: 'column',
		padding: '1em',
		paddingBottom: '0.5em',
		paddingLeft: '3.5em'
	},
	userAva: {
		width: 70,
		height: 70,
		boxShadow: '0px 0px 0px 7px rgba(255, 255, 255, 0.65)'
	}
});

UserPage.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(connect(null, actions)(withRouter(UserPage)));
