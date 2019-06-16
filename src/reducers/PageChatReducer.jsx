import { CREATE_CHAT, UPDATE_CHAT, DESTROY_CHAT } from '../actions/types';

let initState = {
	isShowChat: false,
	messArr: []
};

export default function(state = initState, action) {
	switch (action.type) {
		case CREATE_CHAT:
			return (state = {
				isShow: action.payload.isShow,
				messArr: action.payload.messArr
			});
		case UPDATE_CHAT:
			return (state = {
				isShow: action.payload.isShow,
				messArr: action.payload.messArr
			});
		case DESTROY_CHAT:
			return (state = {
				isShow: action.payload.isShow,
				messArr: action.payload.messArr
			});
		default:
			return state;
	}
}
