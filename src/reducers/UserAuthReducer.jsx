import { LOGIN, LOGOUT } from '../actions/types';

let initState = {
	isLogin: false,
	userName: ''
};

export default function(state = initState, action) {
	switch (action.type) {
		case LOGIN:
			return (state = {
				isLogin: action.payload.isLogin,
				userName: action.payload.userName
			});
		case LOGOUT:
			return (state = {
				isLogin: action.payload.isLogin,
				userName: ''
			});
		default:
			return state;
	}
}
