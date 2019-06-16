import { API_GET_COURSE_INI, API_GET_COURSE_SUCC, API_GET_COURSE_FAIL } from '../actions/types';

let initState = {
	isWating: false,
	returnCode: null,
	returnMess: '',
	data: {}
};

export default function(state = initState, action) {
	switch (action.type) {
		case API_GET_COURSE_INI:
			return (state = {
				isWating: true,
				returnCode: null,
				returnMess: '',
				data: {}
			});
		case API_GET_COURSE_SUCC:
			return (state = {
				isWating: false,
				returnCode: action.payload.returnCode,
				returnMess: action.payload.returnMess,
				data: action.payload.data
			});
		case API_GET_COURSE_FAIL:
			return (state = {
				isWating: false,
				returnCode: action.payload.returnCode,
				returnMess: action.payload.returnMess,
				data: action.payload.data
			});
		default:
			return state;
	}
}
