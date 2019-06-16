export default class SystemHelper {
	isObjectEmty = (obj) => {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	};

	checkValidateLogin = (userName, password) => {
		let errorMess = '';
		if (userName === '' || !userName) errorMess = 'Bạn chưa nhập tên đăng nhập';
		else if (password === '' || !password) {
			errorMess = 'Bạn chưa nhập mật khẩu';
		}
		return errorMess;
	};

	checkValidateRegister = (userName, password, name, phoneNum, birthday, address, email) => {
		let errorMess = '';
		if (userName === '' || !userName) errorMess = 'Bạn chưa nhập tên đăng nhập';
		else if (password === '' || !password) {
			errorMess = 'Bạn chưa nhập mật khẩu';
		} else if (name === '' || !name) {
			errorMess = 'Bạn chưa nhập tên';
		} else if (phoneNum === '' || !phoneNum) {
			errorMess = 'Bạn chưa nhập số điện thoại';
		} else if (birthday === '' || !birthday) {
			errorMess = 'Bạn chưa nhập ngày sinh';
		} else if (address === '' || !address) {
			errorMess = 'Bạn chưa nhập địa chỉ';
		} else if (email === '' || !email) {
			errorMess = 'Bạn chưa nhập email';
		}
		return errorMess;
  };
  
  checkValidateUpdateInfo = (name, phoneNum, birthday, address, email) => {
		let errorMess = '';
	 if (name === '' || !name) {
			errorMess = 'Bạn chưa nhập tên';
		} else if (phoneNum === '' || !phoneNum) {
			errorMess = 'Bạn chưa nhập số điện thoại';
		} else if (birthday === '' || !birthday) {
			errorMess = 'Bạn chưa nhập ngày sinh';
		} else if (address === '' || !address) {
			errorMess = 'Bạn chưa nhập địa chỉ';
		} else if (email === '' || !email) {
			errorMess = 'Bạn chưa nhập email';
		}
		return errorMess;
	};


	checkValidateCourse = (
		courseStepIdx,
		courseTitleSel,
		courseCategorySel,
		courseDescrSel,
		courseLessonSel,
		coursePriceSel,
		courseThumbSel
	) => {
		let errorMess = '';
		switch (courseStepIdx) {
			case 0:
				if (courseTitleSel === '') {
					errorMess = 'Bạn chưa nhập tiêu đề';
				}
				break;
			case 1:
				if (courseCategorySel === '') {
					errorMess = 'Bạn chưa chọn loại';
				} else if (courseDescrSel === '') {
					errorMess = 'Bạn chưa nhập mô tả';
				}
				break;
			case 2:
				const _courseLessonSel = courseLessonSel.filter((data) => data !== '');
				if (_courseLessonSel.length === 0) {
					errorMess = 'Bạn chưa tạo bài học';
				}
				break;
			case 3:
				if (coursePriceSel === '') {
					errorMess = 'Bạn chưa nhập giá khóa học';
				} else if (courseThumbSel === null) {
					errorMess = 'Bạn chưa tải ảnh khóa học';
				}
				break;
			default:
				break;
		}
		return errorMess;
	};

	checkValidateDeadline = (deadlineStepIdx, deadlineTitleSel, deadlineDescrSel, deadlineFileSel) => {
		let errorMess = '';
		switch (deadlineStepIdx) {
			case 0:
				if (deadlineTitleSel === '') {
					errorMess = 'Bạn chưa nhập tiêu đề';
				}
				break;
			case 1:
				if (deadlineDescrSel === '' && deadlineFileSel === null) {
					errorMess = 'Bạn chưa nhập chi tiết hoặc tải file';
				}
				break;
			default:
				break;
		}
		return errorMess;
	};

	checkValidateSubmit = (submitContentSel, submitFileSel) => {
		let errorMess = '';
		if (submitContentSel === '' && submitFileSel === null) errorMess = 'Bạn phải nhập ít nhất một nội dung';
		else errorMess = '';
		return errorMess;
	};

	checkValidateQuestion = (question, ansA, ansB, ansC, ansD, ansRight) => {
		let errorMess = '';
		if (question === '' || question === null || question === undefined) {
			errorMess = 'Bạn chưa nhập câu hỏi';
		} else if (ansA === '' || ansA === null || ansA === undefined) {
			errorMess = 'Bạn chưa nhập câu trả lời A';
		} else if (ansB === '' || ansB === null || ansB === undefined) {
			errorMess = 'Bạn chưa nhập câu trả lời B';
		} else if (ansC === '' || ansC === null || ansC === undefined) {
			errorMess = 'Bạn chưa nhập câu trả lời C';
		} else if (ansD === '' || ansD === null || ansD === undefined) {
			errorMess = 'Bạn chưa nhập câu trả lời D';
		} else if (ansRight === '' || ansRight === null || ansRight === undefined) {
			errorMess = 'Bạn chưa chọn câu trả lời đúng';
		} else errorMess = '';
		return errorMess;
	};

	cvtArrToString = (arrData) => {
		let rs = '';
		if (arrData) {
			arrData.forEach((value) => {
				rs += '*#';
				rs = rs + value;
			});
		}
		return rs;
	};
}
