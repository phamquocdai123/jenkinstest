import axios from 'axios';

class WebService {
	constructor() {
		// this.apiUrl =
		//   process.env.NODE_ENV === "production"
		//     ? process.env.REACT_APP_PROD_API_URL
		//     : process.env.REACT_APP_DEV_API_URL;
		this.apiUrl = 'http://192.168.137.1:3000/api';
		this.instanceAxios = axios.create({
			timeout: 10000,
			crossDomain: true,
			headers: { 'Content-Type': 'application/json; charset=utf-8' }
		});
		this.instanceAxiosCustom = axios.create({
			timeout: 10000,
			crossDomain: true,
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	}

	//FOR ALL
	//#URl: /login
	async login(username, password) {
		const url = '/login';
		const param = {
			user: username,
			pwd: password
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async register(userData) {
		const url = '/account/createaccount';
		const param = userData;
		const res = await this.callDataApiCustom(url, param);
		return this.processDataFromApi(res);
  }
  
  //#URL: /account
  async updateAccountInfo(userData) {
		const url = '/account/updateaccountinfo';
		const param = userData;
		const res = await this.callDataApiCustom(url, param);
		return this.processDataFromApi(res);
  }
  

	//#URl: /user
	async getEnrollCourseList() {
		const url = '/user/getenrolCourseList';
		const param = {
			UserId: this.getUserId()
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async getCourseList() {
		const url = '/user/getCourseList';
		const param = {
			UserId: this.getUserId()
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	//#URl: /course
	async createCourse(courseData) {
		const url = '/course/createcourse';
		const param = courseData;
		const res = await this.callDataApiCustom(url, param);
		return this.processDataFromApi(res);
	}

	async updateCourse(courseData) {
		const url = '/course/updatecourse';
		const param = courseData;
		const res = await this.callDataApiCustom(url, param);
		return this.processDataFromApi(res);
	}

	async getTopCourse() {
		const url = '/course/gettopcourse';
		const res = await this.callDataApiPost(url);
		return this.processDataFromApi(res);
	}

	async getAllCourse() {
		const url = '/course/getallcourse';
		const res = await this.callDataApiGet(url);
		return this.processDataFromApi(res);
	}

	async getCourseDetail(courseId) {
		const url = '/course/getcoursedetail';
		const param = {
			UserId: this.getUserId(),
			CourseId: courseId
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async requestJoinCourse(courseId) {
		const url = '/course/requesttojoincourse';
		const param = {
			userId: this.getUserId(),
			courseId: courseId
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async getListRequest(courseId) {
		const url = '/course/getallrequestlist';
		const param = {
			courseId: courseId
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async acceptRequestJoin(userId, courseId, permission) {
		const url = '/course/acceptrequestjoincourse';
		const param = {
			userId: userId,
			courseId: courseId,
			permission: 0
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async deniedRequestJoin(userId, courseId, permission) {
		const url = '/course/rejectrequestjoincourse';
		const param = {
			userId: userId,
			courseId: courseId,
			permission: 0
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async getListMember(courseId) {
		const url = '/course/getmemberlist';
		const param = {
			courseId: courseId
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async changePermission(courseId, userId, permission) {
		const url = '/course/changepermission';
		const param = {
			courseId: courseId,
			userId: userId,
			permission: permission
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async removeMember(courseId, userId) {
		const url = '/course/removecoursemember';
		const param = {
			courseId: courseId,
			memberId: userId
		};
		console.log(param);
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async addQuestionSet(questionSet, ansRightArr) {
		const url = '/course/addquestionset';
		const param = {
			quesArr: questionSet,
			result: ansRightArr
		};
		const res = await this.callDataApiPost(url, JSON.stringify(param));
		return this.processDataFromApi(res);
	}

	//#URl: /excercise
	async getListExercise(courseId) {
		const url = '/exercise/getlistexercise';
		const param = {
			CourseId: courseId
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async createExercise(excerciseData) {
		const url = '/exercise/createExercise';
		const param = excerciseData;
		const res = await this.callDataApiCustom(url, param);
		return this.processDataFromApi(res);
	}

	async updateExercise(excerciseData) {
		const url = '/exercise/updateExercise';
		const param = {
			Id: excerciseData.id,
			Title: excerciseData.title,
			EndDate: excerciseData.endDate,
			Threads: excerciseData.threads,
			ThreadFile: excerciseData.threadFile
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async deleteExercise(deadlineId) {
		const url = '/exercise/deleteexercise';
		const param = {
			Id: deadlineId
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}

	async submitExercise(exerciseSubmit) {
		const url = '/exercise/studentsubmit';
		const param = exerciseSubmit;
		const res = await this.callDataApiCustom(url, param);
		return this.processDataFromApi(res);
	}

	async getSubmitExercise(deadlineId) {
		const url = '/exercise/getsubmitbyexerciseid';
		const param = {
			ExerciseId: deadlineId
		};
		const res = await this.callDataApiPost(url, param);
		return this.processDataFromApi(res);
	}
	//Other function
	setUserInfo(userInf) {
    localStorage.setItem('id', userInf.ID);    
		localStorage.setItem('name', userInf.Name);
		localStorage.setItem('email', userInf.Email);
		localStorage.setItem('phone', userInf.PhoneNumber);
		localStorage.setItem('addr', userInf.Address);
		localStorage.setItem('avatar', userInf.Avatar);
		localStorage.setItem('birth', userInf.BirthDate);
	}

	isLogin() {
		return this.getUserId() !== '' && this.getUserId() !== undefined && this.getUserId() !== null;
	}

	getUserId() {
		return localStorage.getItem('id');
	}

	getEmail() {
		return localStorage.getItem('email');
	}

	getUserName() {
		return localStorage.getItem('name');
  }

	getPhone() {
		return localStorage.getItem('phone');
	}

	getAddress() {
		return localStorage.getItem('addr');
  }
  
  getBirth() {
		return localStorage.getItem('birth');
  }
  
  getAvatar() {
		return localStorage.getItem('avatar');
	}

	destroyUserInfo() {
		localStorage.removeItem('id');
		localStorage.removeItem('auth');
		localStorage.removeItem('name');
		localStorage.removeItem('email');
		localStorage.removeItem('phone');
		localStorage.removeItem('addr');
		localStorage.removeItem('avatar');
		localStorage.removeItem('birth');
	}

	//API custom function
	callDataApiPost(url, param) {
		const _url = this.apiUrl + url;
		return this.instanceAxios
			.post(_url, param, {
				validateStatus: this.handleValidateApiStt
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				return error;
			});
	}

	callDataApiGet(url) {
		const _url = this.apiUrl + url;
		return this.instanceAxios
			.get(_url, {
				validateStatus: this.handleValidateApiStt
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				return error;
			});
	}

	callDataApiCustom(url, param) {
		const _url = this.apiUrl + url;
		return this.instanceAxiosCustom
			.post(_url, param, {
				validateStatus: this.handleValidateApiStt
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				return error;
			});
	}

	handleValidateApiStt(status) {
		return status < 500;
	}

	processDataFromApi(resApi) {
		console.log(resApi);
		if (resApi.data !== undefined) {
			return resApi.data;
		} else if (resApi.response !== undefined) {
			return resApi.response.data;
		} else {
			const error = {
				returnCode: 0,
				returnMess: 'Network error',
				data: {}
			};
			return error;
		}
	}
}

export default WebService;
