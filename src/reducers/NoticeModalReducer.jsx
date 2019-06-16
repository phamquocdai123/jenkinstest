import { NOTICE_SHOW, NOTICE_CLOSE } from '../actions/types';

let initState = {
	isShowNotice: false,
	noticeMess: '',
	type: 0
};

export default function(state = initState, action) {
	switch (action.type) {
		case NOTICE_SHOW:
			return (state = {
				isShowNotice: action.payload.isShowNotice,
				noticeMess: action.payload.noticeMess,
				type: action.payload.type
			});
		case NOTICE_CLOSE:
			return (state = {
				isShowNotice: action.payload.isShowNotice
			});
		default:
			return state;
	}
}
