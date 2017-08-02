import React from 'react'

const HomePage = props => {
	return (		
			<div className="homePageContainer">
				<label className="homePageLabel form-text">Giới Thiệu</label>
				<p className="homePageContent form-text">* Đây là trang web quản lí nhà, phòng thuê, nhân khẩu thuê nhà và thu chi của từng phòng! *</p>
				<label className="homePageLabel form-text">Lưu ý</label>
				<p className="homePageContent form-text">- Để sử dụng các tính năng của trang web, người dùng vui lòng tạo tài khoản riêng để dễ dàng quản lí, và mọi thông tin cá nhân đều được bảo quản riêng biệt</p>
				<p className="homePageContent form-text">- Người dùng chỉ có thể tương tác trên nhà và các thành phần con trong nhà của mình tạo ra</p>
				<p className="homePageContent form-text">- Tên hiển thị người dùng không được trùng khớp</p>
				<p className="homePageContent form-text">- Tên của phòng trong cùng 1 nhà không được trùng khớp</p>
				<label className="homePageLabel form-text">Hướng dẫn sử dụng</label>
				<p className="homePageContent form-text">* Trang web được thiết kế để người sử dụng dùng theo trình tự như sau:</p>
				<ul className="list-unstyled">					
					<li className="homePageContent form-text"><p>&nbsp;&nbsp;○ Thêm nhà cần quản lí</p></li>
					<li className="homePageContent form-text"><p>&nbsp;&nbsp;○ Thêm phòng cần quản lí</p></li>
					<li className="homePageContent form-text"><p>&nbsp;&nbsp;○ Thêm nhân khẩu và thu chi của từng phòng</p></li>
				</ul>
				<label className="homePageLabel form-text">Cách nhận biết màu sắc từng phòng và ý nghĩa</label>
					<li className="form-text"><div className="emptyTemplate">Phòng Trống</div></li>
					<li className="form-text"><div className="unpaidTemplate">Phòng Chưa Thanh Toán Tiền Tháng</div></li>
					<li className="form-text"><div className="paidTemplate">Phòng Đã Thanh Toán Tiền Tháng</div></li>
			</div>		
	)
}

export default HomePage