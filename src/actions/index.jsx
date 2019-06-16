import * as actionTypes from './types';
import WebService from '../services/WebService';

//Create WebService
const webService = new WebService();

// Title actions
export const setTitle = (title) => ({
	type: actionTypes.TITLE_SHOW,
	payload: {
		isShow: true,
		title: title
	}
});

export const removeTitle = () => ({
	type: actionTypes.TITLE_HIDE,
	payload: {
		isShow: false,
		title: ''
	}
});

//Login popup actions
export const showLogin = (authType) => ({
	type: actionTypes.LOGIN_SHOW,
	payload: {
		isLoginShow: true,
		authType: authType
	}
});

export const updateLogin = (authType) => ({
	type: actionTypes.LOGIN_UPDATE,
	payload: {
		authType: authType
	}
});

export const closeLogin = () => ({
	type: actionTypes.LOGIN_CLOSE,
	payload: {
		isLoginShow: false
	}
});

//Login actions
export const login = (payload) => ({
	type: actionTypes.LOGIN,
	payload: {
		isLogin: true,
		userName: payload.userName
	}
});

export const logout = () => ({
	type: actionTypes.LOGOUT,
	payload: {
		isLogin: false
	}
});

// Chat actions
export const createChat = () => ({
	type: actionTypes.CREATE_CHAT,
	payload: {
		isShowChat: true,
		messArr: []
	}
});

export const updateChat = (messData) => ({
	type: actionTypes.UPDATE_CHAT,
	payload: {
		isShowChat: true,
		messArr: messData
	}
});

export const destroyChat = () => ({
	type: actionTypes.UPDATE_CHAT,
	payload: {
		isShowChat: true,
		messArr: []
	}
});

//Popup notice actions
export const showNotice = (noticeMess, type) => ({
	type: actionTypes.NOTICE_SHOW,
	payload: {
		isShowNotice: true,
		noticeMess: noticeMess,
		type: type
	}
});

export const closeNotice = () => ({
	type: actionTypes.NOTICE_CLOSE,
	payload: {
		isShowNotice: false,
        noticeMess: ''
	}
});

//Popup course actions
export const showCourse = (type, data) => ({
	type: actionTypes.COURSE_SHOW,
	payload: {
		isShowCourse: true,
		type: type,
		data: data
	}
});

export const closeCourse = () => ({
	type: actionTypes.COURSE_CLOSE,
	payload: {
		isShowCourse: false
	}
});

//Popup deadline actions
export const showDeadline = (type, data) => ({
	type: actionTypes.DEADLINE_SHOW,
	payload: {
		isShowDeadline: true,
		type: type,
		data: data
	}
});

export const closeDeadline = () => ({
	type: actionTypes.DEADLINE_CLOSE,
	payload: {
		isShowDeadline: false
	}
});

//**API custom**

//
export const apiCreateCourseInit = () => ({
	type: actionTypes.API_GET_COURSE_INI
});

export const apiCreateCourseSucc = (succRes) => ({
	type: actionTypes.API_GET_COURSE_SUCC,
	payload: succRes
});

export const apiCreateCourseFail = (failRes) => ({
	type: actionTypes.API_GET_COURSE_FAIL,
	payload: failRes
});

export const callApiCreateCourse = (reqData) => {
	return async (dispatch) => {
		dispatch(apiCreateCourseInit());
		const resApi = await webService.createCourse(
			reqData.courseTitle,
			reqData.courseCategory,
			reqData.courseDescr,
			reqData.courseLesson,
			reqData.coursePrice,
			reqData.courseThumb,
			reqData.courseInfo
		);
		if (resApi.returnCode === 0) {
			dispatch(apiCreateCourseFail(resApi));
		} else {
			dispatch(apiCreateCourseSucc(resApi));
		}
	};
};
