import React, { Component } from 'react';
// import './App.css';

import { Provider } from 'react-redux';

import 'webrtc-adapter/out/adapter';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import store from './store';

import Header from './components/Layouts/Header';
import HeaderTitle from './components/Layouts/HeaderTitle';
import Footer from './components/Layouts/Footer';
import Login from './components/Pages/AuthComponent/Login';
import ModalNotice from './components/Pages/CommonComponent/Modal/ModalNotice';
import HomePage from './components/Pages/CommonPage/HomePage';
import UserPage from './components/Pages/CommonPage/UserPage';
import CourseListPage from './components/Pages/CommonPage/CourseListPage';
import CourseDetailPage from './components/Pages/CommonPage/CourseDetailPage';
import AboutPage from './components/Pages/CommonPage/AboutPage';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headerState: false,
			isShowHeader: true,
			isShowHeaderTitle: true,
			isShowFooter: true
		};
	}

	componentDidMount() {
		this.initListener();
	}

	initListener = () => {
		const self = this;
		document.addEventListener('scroll', (event) => {
			if (event.target.scrollingElement.scrollTop > 40) {
				self.setState({ headerState: true });
			} else {
				self.setState({ headerState: false });
			}
		});
	};

	handleIsShowHeader = (isShow) => {
		this.setState({ isShowHeader: isShow });
	};

	handleIsShowHeaderTitle = (isShow) => {
		this.setState({ isShowHeaderTitle: isShow });
	};

	handleIsShowFooter = (isShow) => {
		this.setState({ isShowFooter: isShow });
	};

	handleHeaderState = (state) => {
		this.setState({ headerState: state });
	};

	render() {
		const { headerState, isShowHeader, isShowHeaderTitle, isShowFooter } = this.state;
		return (
			<div>
			<Provider store={store}>
				<Router>
					<div id="app" className="App">
						{isShowHeader && <Header headerState={headerState} />}
						{isShowHeaderTitle && <HeaderTitle />}
						<Switch>
							<Route exact path="/" component={HomePage} />
							<Route
								exact
								path="/khoa-hoc"
								render={(props) => <CourseListPage {...props} headerState={this.handleHeaderState} />}
							/>
							<Route
								// exact
								path="/khoa-hoc/:id"
								render={(props) => <CourseDetailPage {...props} headerState={this.handleHeaderState} />}
							/>
							<Route
								exact
								path="/user"
								render={(props) => (
									<UserPage
										{...props}
										headerState={this.handleHeaderState}
										isShowHeader={this.handleIsShowHeader}
										isShowFooter={this.handleIsShowFooter}
										isShowHeaderTitle={this.handleIsShowHeaderTitle}
									/>
								)}
							/>
							<Route
								exact
								path="/about"
								render={(props) => <AboutPage {...props} headerState={this.handleHeaderState} />}
							/>
							<Route exact component={HomePage} />
						</Switch>
						{isShowFooter && <Footer />}
						<Login />
					</div>
				</Router>
				<ModalNotice />
			</Provider>
			</div>
		);
	}
}

export default App;
