import { LOGIN_SHOW, LOGIN_UPDATE, LOGIN_CLOSE } from "../actions/types";

let initState = {
  isLoginShow: false,
  authType: "0"
};

export default function(state = initState, action) {
  switch (action.type) {
    case LOGIN_SHOW:
      return (state = {
        isLoginShow: action.payload.isLoginShow,
        authType: action.payload.authType
      });
    case LOGIN_UPDATE:
      return { ...state, authType: action.payload.authType };
    case LOGIN_CLOSE:
      return { ...state, isLoginShow: false };
    default:
      return state;
  }
}
