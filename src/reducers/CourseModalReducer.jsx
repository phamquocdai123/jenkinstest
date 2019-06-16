import { COURSE_SHOW, COURSE_CLOSE } from '../actions/types';

let initState = {
	isShowCourse: false,
	type: 0,
	data: null
};

export default function(state = initState, action) {
	switch (action.type) {
		case COURSE_SHOW:
			return (state = {
				isShowCourse: action.payload.isShowCourse,
				type: action.payload.type,
				data: action.payload.data
			});
		case COURSE_CLOSE:
			return (state = {
				isShowCourse: action.payload.isShowCourse,
				data: null
			});
		default:
			return state;
	}
}
