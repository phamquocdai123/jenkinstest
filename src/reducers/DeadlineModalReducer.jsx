import { DEADLINE_SHOW, DEADLINE_CLOSE } from '../actions/types';

let initState = {
	isShowDeadline: false,
	type: 0,
	data: null
};

export default function(state = initState, action) {
	switch (action.type) {
		case DEADLINE_SHOW:
			return (state = {
				isShowDeadline: action.payload.isShowDeadline,
				type: action.payload.type,
				data: action.payload.data
			});
		case DEADLINE_CLOSE:
			return (state = {
				isShowDeadline: action.payload.isShowDeadline,
				data: null
			});
		default:
			return state;
	}
}
