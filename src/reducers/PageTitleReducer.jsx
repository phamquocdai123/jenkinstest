import { TITLE_HIDE, TITLE_SHOW } from '../actions/types';

let initState = {
	isShow: false,
	title: ''
};

export default function(state = initState, action) {
	switch (action.type) {
		case TITLE_SHOW:
			return (state = {
				isShow: action.payload.isShow,
				title: action.payload.title
			});
		case TITLE_HIDE:
			return (state = {
				isShow: action.payload.isShow,
				title: action.payload.title
			});
		default:
			return state;
	}
}
