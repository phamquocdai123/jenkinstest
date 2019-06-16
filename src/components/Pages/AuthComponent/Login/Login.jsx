import React, { Component } from "react";
import "./Login.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import {
  Dialog,
  Fade,
  Typography,
  DialogTitle,
  DialogContent,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  Fab,
  BottomNavigation,
  BottomNavigationAction
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

import WebService from "../../../../services/WebService";
import SystemHelper from "../../../../services/SystemHelper";
import { INPUT_LOGIN } from "../../../../setting/ThemeUiConfig";
import * as actions from "../../../../actions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      userNameRe: "",
      passwordRe: "",
      nameRe: "",
      phoneNumRe: "",
      birthRe: "",
      addressRe: "",
      emailRe: "",
      avatarRe: null
    };
    this.webService = new WebService();
    this.helper = new SystemHelper();
  }

  handleLoginClick = async e => {
    const userInf = {
      username: this.state.userName,
      password: this.state.password
    };
    const vaildate = this.helper.checkValidateLogin(
      userInf.username,
      userInf.password
    );
    if (vaildate !== "") {
      this.props.showNotice(vaildate, 0);
    } else {
      const resApi = await this.webService.login(
        userInf.username,
        userInf.password
      );
      this.handleDataLoginApi(resApi);
    }
  };

  handleDataLoginApi = resApi => {
    console.log(resApi)
    if (resApi.returnCode === 0 || resApi.returnCode === -1) {
      this.props.showNotice(resApi.returnMess, 0);
    } else {
      const result = resApi.data;
      const userInf = {
        userName: result.Name
      };
      this.webService.setUserInfo(result);
      this.props.login(userInf);
      this.props.closeLogin();
    }
  };

  handleUserNameChange = e => {
    this.setState({ userName: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleRegisterClick = async e => {
    const {
      userNameRe,
      passwordRe,
      nameRe,
      phoneNumRe,
      birthRe,
      addressRe,
      emailRe
    } = this.state;
    const vaildate = this.helper.checkValidateRegister(
      userNameRe,
      passwordRe,
      nameRe,
      phoneNumRe,
      birthRe,
      addressRe,
      emailRe
    );
    if (vaildate !== "") {
      this.props.showNotice(vaildate, 0);
    } else {
      this.callApiRegister();
    }
  };

  callApiRegister = async () => {
	let userData = new FormData();
	userData.append('UserName', this.state.userNameRe);
	userData.append('Pwd', this.state.passwordRe);
	userData.append('Name', this.state.nameRe);
	userData.append('PhoneNumber', this.state.phoneNumRe);
	userData.append('BirthDate', this.state.birthRe);
	userData.append('Address', this.state.addressRe);
	userData.append('Email', this.state.emailRe);
	userData.append('Avatar', this.state.avatarRe);
	const resApi = await this.webService.register(userData);
	this.handleRegisterApi(resApi);
  }

  handleRegisterApi = (resApi) => {
	if (resApi.returnCode === 0 || resApi.returnCode === -1) {
		this.props.showNotice(resApi.returnMess, 0);
	  } else {
		this.props.showNotice(resApi.returnMess, 1);
		this.props.closeLogin();
	  }
  }

  handleUserNameReChange = e => {
    this.setState({ userNameRe: e.target.value });
  };

  handlePasswordReChange = e => {
    this.setState({ passwordRe: e.target.value });
  };

  handleNameReChange = e => {
    this.setState({ nameRe: e.target.value });
  };

  handlePhoneNumReChange = e => {
    this.setState({ phoneNumRe: e.target.value });
  };

  handleBirthReChange = e => {
    this.setState({ birthRe: e.target.value });
  };

  handleAddressReChange = e => {
    this.setState({ addressRe: e.target.value });
  };

  handleEmailReChange = e => {
    this.setState({ emailRe: e.target.value });
  };

  handleAvatarReChange = e => {
    this.setState({ avatarRe: e.target.files[0] });
  };

  handleChangeAuthType = (e, authType) => {
    e.preventDefault();
    this.props.updateLogin(authType);
  };

  handleCloseAuth = () => {
    this.props.closeLogin();
  };

  render() {
    const { isLoginShow, authType } = this.props.pageLogin;
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={INPUT_LOGIN}>
        <Dialog
          disableBackdropClick
          maxWidth="sm"
          fullWidth
          PaperComponent={Paper}
          open={isLoginShow}
          TransitionComponent={Transition}
        >
          <div className="hw-login">
            <div className="hw-login-container">
              <IconButton
                style={styles.closeBtn}
                onClick={this.handleCloseAuth}
              >
                <Close />
              </IconButton>
              <DialogTitle id="form-dialog-title">
                <Typography
                  color="primary"
                  component="h3"
                  variant="h3"
                  gutterBottom
                >
                  Chào mừng
                </Typography>
              </DialogTitle>
              <DialogContent style={styles.dialogContent}>
                <div style={styles.authNav}>
                  <BottomNavigation
                    showLabels
                    style={styles.authNav}
                    value={authType}
                    onChange={this.handleChangeAuthType}
                  >
                    <BottomNavigationAction
                      disableRipple
                      classes={{
                        root: classes.root,
                        selected: classes.selected
                      }}
                      label="Đăng nhập"
                      value="0"
                      icon={<LoginIco />}
                    />
                    <BottomNavigationAction
                      disableRipple
                      classes={{
                        root: classes.root,
                        selected: classes.selected
                      }}
                      label="Đăng kí"
                      value="1"
                      icon={<RegisterIco />}
                    />
                  </BottomNavigation>
                </div>
                {authType === "0"
                  ? LoginForm(
                      this.handleUserNameChange,
                      this.handlePasswordChange,
                      this.handleLoginClick
                    )
                  : RegisterForm(
                      this.handleUserNameReChange,
                      this.handlePasswordReChange,
                      this.handleNameReChange,
                      this.handlePhoneNumReChange,
                      this.handleBirthReChange,
                      this.handleAddressReChange,
                      this.handleEmailReChange,
					  this.handleAvatarReChange,
					  this.handleRegisterClick
                    )}
              </DialogContent>
              <Bubble />
            </div>
          </div>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const Bubble = () => {
  return (
    <ul className="bg-bubbles">
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
    </ul>
  );
};

const LoginForm = (
  handleUserNameChange,
  handlePasswordChange,
  handleLoginClick
) => {
  return (
    <div className="hw-login-form d-flex flex-column">
      <TextField
        id="input-with-icon"
        label="Tài khoản"
        style={styles.inputField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <i className="fas fa-user-circle" style={{ fontSize: "1.5em" }} />
            </InputAdornment>
          )
        }}
        onChange={handleUserNameChange}
      />
      <TextField
        id="input-with-icon"
        label="Mật khẩu"
        style={styles.inputField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <i className="fas fa-key" style={{ fontSize: "1.5em" }} />
            </InputAdornment>
          )
        }}
        onChange={handlePasswordChange}
      />
      <Fab
        variant="extended"
        size="medium"
        aria-label="More"
        className="hw-auth-login-btn"
        onClick={handleLoginClick}
      >
        Đăng nhập
      </Fab>
    </div>
  );
};

const RegisterForm = (
  handleUserNameReChange,
  handlePasswordReChange,
  handleNameReChange,
  handlePhoneNumReChange,
  handleBirthReChange,
  handleAddressReChange,
  handleEmailReChange,
  handleAvatarReChange,
  handleRegisterClick
) => {
  return (
    <div className="hw-register-form d-flex flex-column align-items-center">
      <div className="row row-1">
        <div className="col-md-6">
          <TextField
            fullWidth
            id="input-with-icon"
            label="Tài khoản"
            style={styles.inputField}
            onChange={handleUserNameReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i
                    className="fas fa-user-circle"
                    style={{ fontSize: "1.5em" }}
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
            label="Mật khẩu"
            type="password"
            style={styles.inputField}
            onChange={handlePasswordReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-key" style={{ fontSize: "1.5em" }} />
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
            label="Tên"
            style={styles.inputField}
            onChange={handleNameReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i
                    className="fas fa-user-circle"
                    style={{ fontSize: "1.5em" }}
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
            style={styles.inputField}
            onChange={handlePhoneNumReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i
                    className="fas fa-phone-square"
                    style={{ fontSize: "1.5em" }}
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
            style={styles.inputField}
            onChange={handleBirthReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i
                    className="fas fa-birthday-cake"
                    style={{ fontSize: "1.5em" }}
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
            style={styles.inputField}
            onChange={handleAddressReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i
                    className="fas fa-map-marker-alt"
                    style={{ fontSize: "1.5em" }}
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
            style={styles.inputField}
            onChange={handleEmailReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i
                    className="fas fa-envelope-square"
                    style={{ fontSize: "1.5em" }}
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
            onChange={handleAvatarReChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-image" style={{ fontSize: "1.5em" }} />
                </InputAdornment>
              )
            }}
          />
        </div>
      </div>

      <Fab
        variant="extended"
        size="medium"
        aria-label="More"
		className="hw-auth-register-btn"
		onClick={handleRegisterClick}
      >
        Đăng kí
      </Fab>
    </div>
  );
};

const LoginIco = () => {
  return (
    <div className="login-ico">
      <img
        alt=""
        src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTAuNjY3IDQ5MC42NjciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MC42NjcgNDkwLjY2NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGQ9Ik0yNTYsMzk0LjY2N3Y0Mi42NjdjMCw1Ljg4OCw0Ljc3OSwxMC42NjcsMTAuNjY3LDEwLjY2N2gxMDYuNjY3YzUuODg4LDAsMTAuNjY3LTQuNzc5LDEwLjY2Ny0xMC42Njd2LTQyLjY2NyAgICAgYzAtNS44ODgtNC43NzktMTAuNjY3LTEwLjY2Ny0xMC42NjdIMjY2LjY2N0MyNjAuNzc5LDM4NCwyNTYsMzg4Ljc3OSwyNTYsMzk0LjY2N3ogTTI3Ny4zMzMsNDA1LjMzM2g4NS4zMzN2MjEuMzMzaC04NS4zMzMgICAgIFY0MDUuMzMzeiIgZmlsbD0iIzAwMDAwMCIvPgoJCQk8cGF0aCBkPSJNNDM3LjMzMywwaC0zODRDMjMuOTM2LDAsMCwyMy45MzYsMCw1My4zMzN2Mzg0YzAsMjkuMzk3LDIzLjkzNiw1My4zMzMsNTMuMzMzLDUzLjMzM2gzODQgICAgIGMyOS4zOTcsMCw1My4zMzMtMjMuOTM2LDUzLjMzMy01My4zMzN2LTM4NEM0OTAuNjY3LDIzLjkzNiw0NjYuNzMxLDAsNDM3LjMzMywweiBNNDY5LjMzMyw0MzcuMzMzYzAsMTcuNjQzLTE0LjM1NywzMi0zMiwzMiAgICAgaC0zODRjLTE3LjY0MywwLTMyLTE0LjM1Ny0zMi0zMlYxMDYuNjY3aDQ0OFY0MzcuMzMzeiBNNDY5LjMzMyw4NS4zMzNoLTQ0OHYtMzJjMC0xNy42NDMsMTQuMzU3LTMyLDMyLTMyaDM4NCAgICAgYzE3LjY0MywwLDMyLDE0LjM1NywzMiwzMlY4NS4zMzN6IiBmaWxsPSIjMDAwMDAwIi8+CgkJCTxwYXRoIGQ9Ik01My4zMzMsNDIuNjY3Yy01Ljg4OCwwLTEwLjY2Nyw0Ljc3OS0xMC42NjcsMTAuNjY3UzQ3LjQ0NSw2NCw1My4zMzMsNjRTNjQsNTkuMjIxLDY0LDUzLjMzMyAgICAgUzU5LjIyMSw0Mi42NjcsNTMuMzMzLDQyLjY2N3oiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTExNy4zMzMsNDQ4SDIyNGM1Ljg4OCwwLDEwLjY2Ny00Ljc3OSwxMC42NjctMTAuNjY3di00Mi42NjdjMC01Ljg4OC00Ljc3OS0xMC42NjctMTAuNjY3LTEwLjY2N0gxMTcuMzMzICAgICBjLTUuODg4LDAtMTAuNjY3LDQuNzc5LTEwLjY2NywxMC42Njd2NDIuNjY3QzEwNi42NjcsNDQzLjIyMSwxMTEuNDQ1LDQ0OCwxMTcuMzMzLDQ0OHogTTEyOCw0MDUuMzMzaDg1LjMzM3YyMS4zMzNIMTI4VjQwNS4zMzN6ICAgICAiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTEzOC42NjcsNDIuNjY3Yy01Ljg4OCwwLTEwLjY2Nyw0Ljc3OS0xMC42NjcsMTAuNjY3UzEzMi43NzksNjQsMTM4LjY2Nyw2NHMxMC42NjctNC43NzksMTAuNjY3LTEwLjY2NyAgICAgUzE0NC41NTUsNDIuNjY3LDEzOC42NjcsNDIuNjY3eiIgZmlsbD0iIzAwMDAwMCIvPgoJCQk8cGF0aCBkPSJNOTYsNDIuNjY3Yy01Ljg4OCwwLTEwLjY2Nyw0Ljc3OS0xMC42NjcsMTAuNjY3UzkwLjExMiw2NCw5Niw2NHMxMC42NjctNC43NzksMTAuNjY3LTEwLjY2N1MxMDEuODg4LDQyLjY2Nyw5Niw0Mi42Njd6IiBmaWxsPSIjMDAwMDAwIi8+CgkJCTxwYXRoIGQ9Ik0xNjIuNDMyLDMyOC4zNjNjMC4yNTYsMC4yNTYsMC41NTUsMC40MjcsMC44MTEsMC42NjFjNS4wOTksNC45OTIsMTAuNjAzLDkuNTU3LDE2LjUzMywxMy41NjggICAgIGMwLjY4MywwLjQ2OSwxLjQyOSwwLjgzMiwyLjEzMywxLjMwMWM1LjY3NSwzLjY2OSwxMS42MjcsNi45MTIsMTcuOTIsOS41NzljMC43NDcsMC4zMiwxLjUxNSwwLjUzMywyLjI2MSwwLjgzMiAgICAgYzYuMzc5LDIuNTM5LDEyLjk5Miw0LjYwOCwxOS44NjEsNi4wMTZjMC40MjcsMC4wODUsMC44NTMsMC4xMDcsMS4yNTksMC4xOTJjNy4xNjgsMS4zNjUsMTQuNTQ5LDIuMTU1LDIyLjEyMywyLjE1NSAgICAgczE0Ljk1NS0wLjc4OSwyMi4xMjMtMi4xNTVjMC40MjctMC4wODUsMC44NTMtMC4xMDcsMS4yNTktMC4xOTJjNi44NjktMS4zODcsMTMuNDgzLTMuNDc3LDE5Ljg2MS02LjAxNiAgICAgYzAuNzQ3LTAuMjk5LDEuNTE1LTAuNTEyLDIuMjYxLTAuODMyYzYuMjkzLTIuNjQ1LDEyLjI0NS01LjkwOSwxNy45Mi05LjU3OWMwLjcwNC0wLjQ0OCwxLjQ1MS0wLjgzMiwyLjEzMy0xLjMwMSAgICAgYzUuOTMxLTQuMDExLDExLjQzNS04LjU3NiwxNi41MzMtMTMuNTY4YzAuMjU2LTAuMjU2LDAuNTU1LTAuNDI3LDAuODExLTAuNjYxYzAuMDQzLTAuMDQzLDAuMDQzLTAuMTI4LDAuMDg1LTAuMTcxICAgICBjMjEuMjA1LTIxLjI0OCwzNC4zNDctNTAuNTM5LDM0LjM0Ny04Mi44NTljMC02NC43MDQtNTIuNjI5LTExNy4zMzMtMTE3LjMzMy0xMTcuMzMzUzEyOCwxODAuNjI5LDEyOCwyNDUuMzMzICAgICBjMCwzMi4zMiwxMy4xNDEsNjEuNjExLDM0LjM0Nyw4Mi44NTlDMTYyLjM4OSwzMjguMjM1LDE2Mi4zODksMzI4LjMyLDE2Mi40MzIsMzI4LjM2M3ogTTMwMi45NzYsMzIxLjYgICAgIGMtMi4yNCwxLjY4NS00LjQ1OSwzLjM5Mi02LjgyNyw0Ljg0M2MtMS45MiwxLjE5NS0zLjk2OCwyLjE3Ni01Ljk3MywzLjI0M2MtMjcuNzMzLDE0LjIyOS02MS45NTIsMTQuMjI5LTg5LjY4NSwwICAgICBjLTIuMDA1LTEuMDY3LTQuMDUzLTIuMDQ4LTUuOTczLTMuMjQzYy0yLjM2OC0xLjQ1MS00LjU4Ny0zLjE1Ny02LjgyNy00Ljg0M2MtMS42ODUtMS4yOC0zLjI4NS0yLjY0NS00Ljg4NS00LjAzMiAgICAgYzExLjI4NS0yNC4zMiwzNS41NDEtNDAuMjM1LDYyLjUyOC00MC4yMzVzNTEuMjQzLDE1LjkxNSw2Mi41NDksNDAuMjM1QzMwNi4yODMsMzE4Ljk1NSwzMDQuNjYxLDMyMC4zMiwzMDIuOTc2LDMyMS42eiAgICAgIE0yMTMuMzMzLDIyNGMwLTE3LjY0MywxNC4zNTctMzIsMzItMzJzMzIsMTQuMzU3LDMyLDMyYzAsMTcuNjQzLTE0LjM1NywzMi0zMiwzMlMyMTMuMzMzLDI0MS42NDMsMjEzLjMzMywyMjR6ICAgICAgTTI0NS4zMzMsMTQ5LjMzM2M1Mi45MjgsMCw5Niw0My4wNzIsOTYsOTZjMCwyMC44NDMtNi44NDgsNDAtMTguMTc2LDU1Ljc2NWMtOS44OTktMTYuODMyLTI0LjgxMS0yOS45MDktNDIuNDMyLTM3LjUwNCAgICAgYzEwLjkyMy05Ljc5MiwxNy45NDEtMjMuODI5LDE3Ljk0MS0zOS41OTVjMC0yOS4zOTctMjMuOTM2LTUzLjMzMy01My4zMzMtNTMuMzMzUzE5MiwxOTQuNjAzLDE5MiwyMjQgICAgIGMwLDE1Ljc2NSw3LjAxOSwyOS44MDMsMTcuOTQxLDM5LjU3M2MtMTcuNjIxLDcuNTk1LTMyLjUzMywyMC42NzItNDIuNDMyLDM3LjUwNGMtMTEuMzI4LTE1Ljc0NC0xOC4xNzYtMzQuOTAxLTE4LjE3Ni01NS43NDQgICAgIEMxNDkuMzMzLDE5Mi40MDUsMTkyLjQwNSwxNDkuMzMzLDI0NS4zMzMsMTQ5LjMzM3oiIGZpbGw9IiMwMDAwMDAiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
      />
    </div>
  );
};

const RegisterIco = () => {
  return (
    <div className="register-ico">
      <img
        alt=""
        src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTAuNjY3IDQ5MC42NjciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MC42NjcgNDkwLjY2NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGQ9Ik0xNjIuNDMyLDI0My4wMDhjMC4xNzEsMC4xNzEsMC4zODQsMC4yOTksMC41NzYsMC40NjljNS4xNjMsNS4wOTksMTAuNzk1LDkuNzQ5LDE2LjgzMiwxMy44MjQgICAgIGMwLjY0LDAuNDI3LDEuMzIzLDAuNzY4LDEuOTYzLDEuMTk1YzUuNzE3LDMuNjkxLDExLjcxMiw2Ljk3NiwxOC4wNDgsOS42NDNjMC43MjUsMC4yOTksMS40NzIsMC41MTIsMi4xOTcsMC44MTEgICAgIGM2LjQsMi41MzksMTMuMDEzLDQuNjI5LDE5LjkwNCw2LjAxNmMwLjQyNywwLjA4NSwwLjg1MywwLjEwNywxLjI1OSwwLjE5MmM3LjE2OCwxLjM4NywxNC41NDksMi4xNzYsMjIuMTIzLDIuMTc2ICAgICBzMTQuOTU1LTAuNzg5LDIyLjEyMy0yLjE1NWMwLjQyNy0wLjA4NSwwLjg1My0wLjEwNywxLjI1OS0wLjE5MmM2Ljg2OS0xLjM4NywxMy40ODMtMy40NzcsMTkuODYxLTYuMDE2ICAgICBjMC43NDctMC4yOTksMS41MTUtMC41MTIsMi4yNjEtMC44MzJjNi4yOTMtMi42NDUsMTIuMjQ1LTUuOTA5LDE3LjkyLTkuNTc5YzAuNzA0LTAuNDQ4LDEuNDUxLTAuODMyLDIuMTMzLTEuMzAxICAgICBjNS45MzEtNC4wMTEsMTEuNDM1LTguNTc2LDE2LjUzMy0xMy41NjhjMC4yNTYtMC4yNTYsMC41NTUtMC40MjcsMC44MTEtMC42NjFjMC4wNDMtMC4wNDMsMC4wNDMtMC4xMjgsMC4wODUtMC4xNzEgICAgIGMyMS4yMDUtMjEuMjQ4LDM0LjM0Ny01MC41MzksMzQuMzQ3LTgyLjg1OWMwLTY0LjcwNC01Mi42MjktMTE3LjMzMy0xMTcuMzMzLTExNy4zMzNTMTI4LDk1LjI5NiwxMjgsMTYwICAgICBjMCwzMi4zNDEsMTMuMTQxLDYxLjY1MywzNC4zNjgsODIuOTAxQzE2Mi40MTEsMjQyLjkyMywxNjIuNDExLDI0Mi45ODcsMTYyLjQzMiwyNDMuMDA4eiBNMjQ1LjMzMyw2NGM1Mi45MjgsMCw5Niw0My4wNzIsOTYsOTYgICAgIGMwLDIwLjg0My02Ljg0OCw0MC0xOC4xNzYsNTUuNzQ0Yy05Ljg3Ny0xNi44MzItMjQuODExLTI5LjkwOS00Mi40MTEtMzcuNTA0YzEwLjkyMy05Ljc3MSwxNy45Mi0yMy44MDgsMTcuOTItMzkuNTczICAgICBjMC0yOS4zOTctMjMuOTM2LTUzLjMzMy01My4zMzMtNTMuMzMzUzE5MiwxMDkuMjY5LDE5MiwxMzguNjY3YzAsMTUuNzY1LDYuOTk3LDI5LjgwMywxNy45MiwzOS41NzMgICAgIGMtMTcuNjIxLDcuNTk1LTMyLjUzMywyMC42NzItNDIuNDExLDM3LjUyNUMxNTYuMTgxLDIwMCwxNDkuMzMzLDE4MC44NDMsMTQ5LjMzMywxNjBDMTQ5LjMzMywxMDcuMDcyLDE5Mi40MDUsNjQsMjQ1LjMzMyw2NHoiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTM5NC42NjcsMjk4LjY2N0g5NmMtMjkuMzk3LDAtNTMuMzMzLDIzLjkzNi01My4zMzMsNTMuMzMzdjQyLjY2N0M0Mi42NjcsNDI0LjA2NCw2Ni42MDMsNDQ4LDk2LDQ0OGgyOTguNjY3ICAgICBDNDI0LjA2NCw0NDgsNDQ4LDQyNC4wNjQsNDQ4LDM5NC42NjdWMzUyQzQ0OCwzMjIuNjAzLDQyNC4wNjQsMjk4LjY2NywzOTQuNjY3LDI5OC42Njd6IE0xNDYuMjE5LDQwMi4xOTcgICAgIGMtMi4wOTEsMi4wOTEtNC44MjEsMy4xMzYtNy41NTIsMy4xMzZjLTIuNzMxLDAtNS40NjEtMS4wNDUtNy41NTItMy4xMTVsLTEzLjc4MS0xMy44MDNsLTEzLjc4MSwxMy43ODEgICAgIGMtMi4wOTEsMi4wOTEtNC44MjEsMy4xMzYtNy41NTIsMy4xMzZzLTUuNDYxLTEuMDQ1LTcuNTUyLTMuMTE1Yy00LjE2LTQuMTYtNC4xNi0xMC45MjMsMC0xNS4wODNsMTMuODAzLTEzLjgwM2wtMTMuNzgxLTEzLjc4MSAgICAgYy00LjE2LTQuMTYtNC4xNi0xMC45MjMsMC0xNS4wODNjNC4xNi00LjE2LDEwLjkyMy00LjE2LDE1LjA4MywwbDEzLjc4MSwxMy43ODFsMTMuNzgxLTEzLjc4MWM0LjE2LTQuMTYsMTAuOTIzLTQuMTYsMTUuMDgzLDAgICAgIGM0LjE2LDQuMTYsNC4xNiwxMC45MjMsMCwxNS4wODNsLTEzLjc4MSwxMy43ODFsMTMuODAzLDEzLjc4MUMxNTAuMzc5LDM5MS4yNzUsMTUwLjM3OSwzOTguMDM3LDE0Ni4yMTksNDAyLjE5N3ogICAgICBNMjMxLjU1Miw0MDIuMTk3Yy0yLjA5MSwyLjA5MS00LjgyMSwzLjEzNi03LjU1MiwzLjEzNmMtMi43MzEsMC01LjQ2MS0xLjA0NS03LjU1Mi0zLjExNWwtMTMuNzgxLTEzLjgwM2wtMTMuNzgxLDEzLjc4MSAgICAgYy0yLjA5MSwyLjA5MS00LjgyMSwzLjEzNi03LjU1MiwzLjEzNnMtNS40NjEtMS4wNDUtNy41NTItMy4xMTVjLTQuMTYtNC4xNi00LjE2LTEwLjkyMywwLTE1LjA4M2wxMy44MDMtMTMuODAzbC0xMy43ODEtMTMuNzgxICAgICBjLTQuMTYtNC4xNi00LjE2LTEwLjkyMywwLTE1LjA4M2M0LjE2LTQuMTYsMTAuOTIzLTQuMTYsMTUuMDgzLDBsMTMuNzgxLDEzLjc4MWwxMy43ODEtMTMuNzgxYzQuMTYtNC4xNiwxMC45MjMtNC4xNiwxNS4wODMsMCAgICAgYzQuMTYsNC4xNiw0LjE2LDEwLjkyMywwLDE1LjA4M2wtMTMuNzgxLDEzLjc4MWwxMy44MDMsMTMuNzgxQzIzNS43MTIsMzkxLjI3NSwyMzUuNzEyLDM5OC4wMzcsMjMxLjU1Miw0MDIuMTk3eiAgICAgIE0zMTYuODg1LDQwMi4xOTdjLTIuMDkxLDIuMDkxLTQuODIxLDMuMTM2LTcuNTUyLDMuMTM2cy01LjQ2MS0xLjA0NS03LjU1Mi0zLjExNUwyODgsMzg4LjQxNmwtMTMuNzgxLDEzLjc4MSAgICAgYy0yLjA5MSwyLjA5MS00LjgyMSwzLjEzNi03LjU1MiwzLjEzNmMtMi43MzEsMC01LjQ2MS0xLjA0NS03LjU1Mi0zLjExNWMtNC4xNi00LjE2LTQuMTYtMTAuOTIzLDAtMTUuMDgzbDEzLjgwMy0xMy44MDMgICAgIGwtMTMuNzgxLTEzLjc4MWMtNC4xNi00LjE2LTQuMTYtMTAuOTIzLDAtMTUuMDgzYzQuMTYtNC4xNiwxMC45MjMtNC4xNiwxNS4wODMsMEwyODgsMzU4LjI1MWwxMy43ODEtMTMuNzgxICAgICBjNC4xNi00LjE2LDEwLjkyMy00LjE2LDE1LjA4MywwYzQuMTYsNC4xNiw0LjE2LDEwLjkyMywwLDE1LjA4M2wtMTMuNzgxLDEzLjc4MWwxMy44MDMsMTMuNzgxICAgICBDMzIxLjA0NSwzOTEuMjc1LDMyMS4wNDUsMzk4LjAzNywzMTYuODg1LDQwMi4xOTd6IE00MDIuMjE5LDQwMi4xOTdjLTIuMDkxLDIuMDkxLTQuODIxLDMuMTM2LTcuNTUyLDMuMTM2ICAgICBjLTIuNzMxLDAtNS40NjEtMS4wNDUtNy41NTItMy4xMTVsLTEzLjc4MS0xMy44MDNsLTEzLjc4MSwxMy43ODFjLTIuMDkxLDIuMDkxLTQuODIxLDMuMTM2LTcuNTUyLDMuMTM2ICAgICBzLTUuNDYxLTEuMDQ1LTcuNTUyLTMuMTE1Yy00LjE2LTQuMTYtNC4xNi0xMC45MjMsMC0xNS4wODNsMTMuODAzLTEzLjgwM2wtMTMuNzgxLTEzLjc4MWMtNC4xNi00LjE2LTQuMTYtMTAuOTIzLDAtMTUuMDgzICAgICBjNC4xNi00LjE2LDEwLjkyMy00LjE2LDE1LjA4MywwbDEzLjc4MSwxMy43ODFsMTMuNzgxLTEzLjc4MWM0LjE2LTQuMTYsMTAuOTIzLTQuMTYsMTUuMDgzLDBjNC4xNiw0LjE2LDQuMTYsMTAuOTIzLDAsMTUuMDgzICAgICBsLTEzLjc4MSwxMy43ODFsMTMuODAzLDEzLjc4MUM0MDYuMzc5LDM5MS4yNzUsNDA2LjM3OSwzOTguMDM3LDQwMi4yMTksNDAyLjE5N3oiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTQzNy4zMzMsMGgtMzg0QzIzLjkzNiwwLDAsMjMuOTM2LDAsNTMuMzMzdjM4NGMwLDI5LjM5NywyMy45MzYsNTMuMzMzLDUzLjMzMyw1My4zMzNoMzg0ICAgICBjMjkuMzk3LDAsNTMuMzMzLTIzLjkzNiw1My4zMzMtNTMuMzMzdi0zODRDNDkwLjY2NywyMy45MzYsNDY2LjczMSwwLDQzNy4zMzMsMHogTTQ2OS4zMzMsNDM3LjMzM2MwLDE3LjY0My0xNC4zNTcsMzItMzIsMzIgICAgIGgtMzg0Yy0xNy42NDMsMC0zMi0xNC4zNTctMzItMzJ2LTM4NGMwLTE3LjY0MywxNC4zNTctMzIsMzItMzJoMzg0YzE3LjY0MywwLDMyLDE0LjM1NywzMiwzMlY0MzcuMzMzeiIgZmlsbD0iIzAwMDAwMCIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
      />
    </div>
  );
};

const Transition = props => {
  return <Fade timeout={{ enter: 2000, exit: 4 }} {...props} />;
};

const styles = {
  dialogContent: {
    width: "unset",
    display: "flex",
    height: "380px",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflowY: "hidden",
    zIndex: 1
  },
  inputField: {
    margin: "0.5em"
  },
  closeBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1
  },
  authNav: {
    // height: '50px'
  },
  authNavItem: {
    backgroundColor: "transparent",
    height: "unset",
    width: "100%",
    display: "unset"
  },
  root: {
    "&$selected": {
      color: "#FF7062",
      fontSize: "2em"
    }
  },
  selected: {}
};

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  pageLogin: state.pageLogin
});

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(Login));
