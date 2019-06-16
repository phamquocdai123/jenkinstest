import { combineReducers } from 'redux';
import PageTitleReducer from './PageTitleReducer';
import PageChatReducer from './PageChatReducer';
import PageLoginReducer from './PageLoginReducer';
import UserAuthReducer from './UserAuthReducer';
import NoticeModalReducer from './NoticeModalReducer';
import CourseModalReducer from './CourseModalReducer';
import DeadlineModalReducer from './DeadlineModalReducer';
import ApiCourseReducer from './ApiCourseReducer';


const rootReducer = combineReducers({
	pageTitle: PageTitleReducer,
	pageLogin: PageLoginReducer,
	pageChat: PageChatReducer,
	userAuth: UserAuthReducer,
	noticePopup: NoticeModalReducer,
	coursePopup: CourseModalReducer,
	deadlinePopup: DeadlineModalReducer,
	apiCourse: ApiCourseReducer
});

export default rootReducer;
