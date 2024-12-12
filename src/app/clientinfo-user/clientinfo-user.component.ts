import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../interface/user.interface';
import { ManagerUserService } from '../../service/manager-user.service';
import { Account } from '../../interface/account.interface';
import { AccountService } from '../../service/account/account.service';

@Component({
  selector: 'app-clientinfo-user',
  templateUrl: './clientinfo-user.component.html',
  styleUrl: './clientinfo-user.component.scss'
})
export class ClientinfoUserComponent {
  usernameinfo: string | null = null; // Biến để lưu tên tài khoản
  usernamehead: string | null = null; // Biến để lưu tên tài khoản
  isEditing = false; // Mặc định là không chỉnh sửa
  username:string ='';
  nameuser:string ='';
  email:string ='';
  phone:string ='';
  password:string ='';
  birth: string ='';
  points:number=0;
  userImageUrl: string = '';
  selectedImage: File | null = null;  // Biến để lưu trữ hình ảnh đã chọn
  file: File | null = null;
  user: User []=[];
  account :Account []=[];
  isEmailValid = true;  // Kiểm tra tính hợp lệ của email
  isPhoneValid = true;  // Kiểm tra tính hợp lệ của số điện thoại
  constructor(
    private managerUserService: ManagerUserService,
    private managerAccountService : AccountService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    
  }

  ngOnInit(): void {
    // Lấy thông tin tài khoản từ LocalStorage
    const usernameFromLocalStorage = localStorage.getItem('username');
    const nameFromGoogle = localStorage.getItem('name');
    // Ưu tiên hiển thị `name` nếu đăng nhập bằng Google, nếu không thì hiển thị `username`
    this.usernameinfo = nameFromGoogle || usernameFromLocalStorage;
    this.usernamehead = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
    if (this.usernamehead) {
      // Gọi API để lấy iduser từ username
      this.managerAccountService.getIdUserByUsername(this.usernamehead).subscribe(
        (response) => {
          const userId = response.iduser; // Gán iduser từ API vào biến userId
          console.log('User ID:', userId); // Kiểm tra giá trị iduser trong console
  
          // Sử dụng userId để gọi các API khác
          if (userId) {
            this.managerAccountService.getAccountByIduser(userId).subscribe(
              (response) => {
                console.log("Thông tin tài khoản: ", response);
                this.loadDataAccountById(response);
                
                // Lấy iduser từ accountId
                this.managerAccountService.getAccountByIduserNew(response).subscribe(
                  (idUserResponse) => {
                    console.log("Thông tin iduser từ accountId: ", idUserResponse);
                    this.loadDataUserById(idUserResponse);
                  },
                  (error) => {
                    console.error("Lỗi khi lấy iduser từ accountId: ", error);
                  }
                );
              },
              (error) => {
                console.error("Lỗi khi lấy thông tin tài khoản: ", error);
              }
            );
            this.loadDataUserById(userId);
          }
        },
        (error) => {
          console.error('Lỗi khi lấy iduser từ username:', error);
        }
      );
    }
    if (this.usernamehead) {
      // Gọi API lấy idaccount từ username
      this.managerAccountService.getAccountByUsername(this.usernamehead).subscribe(
        (response) => {
          const accountId = response.idaccount; // Gán idaccount từ API
          console.log('Account ID:', accountId);
  
          // Tải dữ liệu liên quan đến accountId
          if (accountId) {
            this.loadDataAccountById(accountId); // Gọi API lấy thông tin tài khoản
          }
        },
        (error) => {
          console.error('Lỗi khi lấy idaccount từ username:', error);
        }
      );
    }
  }
  

  
  getImageHotelUrl(imageName: string): void {
    this.userImageUrl = `http://localhost:9000/api/account/images/${imageName}`;
  }
  // Xử lý khi người dùng chọn hình ảnh mới
  onImageChange(event: any): void {
    this.file = event.target.files[0]; // Lấy file người dùng chọn
    if (this.file) {
      // Cập nhật lại URL hình ảnh nếu người dùng chọn file
      const reader = new FileReader();
      reader.onload = () => {
        this.userImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.file);

      // Lưu hình ảnh nếu cần (ví dụ gửi hình ảnh lên backend)
      this.selectedImage = this.file; // Lưu trữ file chọn để gửi lên server khi lưu thông tin
      console.log("hình ảnh người chọn",this.selectedImage);
    }
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadDataUserById(id: string): void {
    this.managerUserService.findUser(id).subscribe(
      (data: any) => {
        if (!Array.isArray(data)) {
          this.user = [data]; // Chuyển đối tượng thành mảng nếu cần
        } else {
          this.user = data;
        }
        console.log(this.user[0]);

        // Kiểm tra và gán giá trị cho các thuộc tính
        this.nameuser = this.user[0].name || 'Chưa có tên';
        this.email = this.user[0].email || 'Chưa có email';
        this.phone = this.user[0].phone || 'Chưa có số điện thoại';

        // Xử lý trường hợp birth là null
        if (this.user[0].birth) {
          const birthDate = new Date(this.user[0].birth);
          this.birth = this.formatDate(birthDate); // Đảm bảo giá trị là chuỗi "yyyy-MM-dd"
        } else {
          this.birth = 'Chưa có ngày sinh'; // Đặt giá trị mặc định nếu birth là null
        }
        
        
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    );
  }

  loadDataAccountById(id:string): void {
    this.managerAccountService.findAccount(id).subscribe(
      (data :any) => {
        if (!Array.isArray(data)) {
          this.account = [data]; // Chuyển đối tượng thành mảng
        }
        else {
          this.account = data;
        }
        console.log(this.account[0]);
        this.username = this.account[0].username;


        console.log(this.account[0].image);
        const imageString=this.account[0].image;
        console.log(imageString);
        this.password = this.account[0].password;
        this.getImageHotelUrl(imageString);
      },
      (error) => {
         console.error('Lỗi khi lấy dữ liệu người dùng:', error)
      }
    )
  }
  toggleEdit(): void {
    this.isEditing = !this.isEditing;

  }

  saveUserData(): void {

    const imageString = "img_"+this.account[0].idaccount;
    const updatedAccount: Account = {
      idaccount: this.account[0].idaccount,        // Lấy ID tài khoản hiện tại
      username: this.username,       // Tên tài khoản
      password: this.password, // Mật khẩu (giữ nguyên từ dữ liệu ban đầu)
      image: imageString,  // Hình ảnh (giữ nguyên từ dữ liệu ban đầu)
      typeUser: this.account[0].typeUser, // Thông tin loại người dùng (giữ nguyên từ dữ liệu ban đầu)
      status: this.account[0].status, // Trạng thái (giữ nguyên từ dữ liệu ban đầu)
      user: this.account[0].user // Người dùng (giữ nguyên từ dữ liệu ban đầu)
    };

    this.managerAccountService.updateAccount(this.account[0].idaccount, updatedAccount).subscribe(
      (response: any) => {
        console.log('Account data updated successfully', response);
      },
      (error) => {
        console.error('Error updating account data:', error);
      }
    );


    const updatedUser: User = {
      iduser: this.user[0].iduser,  // Lấy ID người dùng hiện tại
      name: this.nameuser,          // Tên người dùng
      email: this.email,            // Email
      phone: this.phone,            // Số điện thoại
      birth: this.birth,            // Ngày sinh
      points: this.points,          // Điểm người dùng
      salary: this.user[0].salary,  // Lương (giữ nguyên từ dữ liệu ban đầu)
      reward: this.user[0].reward,  // Thưởng (giữ nguyên từ dữ liệu ban đầu)
      status: this.user[0].status,  // Trạng thái (giữ nguyên từ dữ liệu ban đầu)
      typeUser: this.user[0].typeUser // Thông tin loại người dùng (giữ nguyên từ dữ liệu ban đầu)
    };

    if (this.selectedImage) {

      // Đổi tên file thành img_{account.id}.png
      const accountId = 'A' + this.account[0].idaccount.slice(1);
      const formData = new FormData();
      if (this.file) {
          formData.append('file', this.file);
          formData.append('accountName', accountId); // file được chọn
      }


      //xoa hinh anh cu
      // this.managerAccountService.deleteImage(imageName);

      //luu hinh anh moi
      this.managerAccountService.addImageAccountToBackend(formData).subscribe(
        (response) => {
          console.log('Image uploaded successfully',response);
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
      // Gửi lên backend
      // this.managerUserService.uploadUserImage(this.account[0].id, formData).subscribe(
      //   (response) => {
      //     console.log('Image uploaded successfully');
      //   },
      //   (error) => {
      //     console.error('Error uploading image:', error);
      //   }
      // );
    }
    else {
      console.log('No image selected');
    }

    console.log('Updated user data:', updatedUser);
    this.managerUserService.updateUser(this.user[0].iduser, updatedUser).subscribe(
      (response: any) => {
        console.log('User data updated successfully', response);
        this.isEditing = false;  // Tắt chế độ chỉnh sửa sau khi lưu thành công
      },
      (error) => {
        console.error('Error updating user data:', error);
      }
    );

  }
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.isEmailValid = emailPattern.test(this.email);
  }
  isPasswordValid = true; // Biến kiểm tra mật khẩu hợp lệ

  validatePassword(): void {
    // Đảm bảo mật khẩu ít nhất 6 ký tự và không rỗng
    this.isPasswordValid = this.password.length >= 6;
  }
  
  validatePhone(): void {
    const phonePattern = /^[0-9]{10}$/;
    this.isPhoneValid = phonePattern.test(this.phone);
  }
  saveChanges(): void {
    // Kiểm tra các trường hợp hợp lệ
    this.validateEmail();
    this.validatePhone();
    this.validatePassword();
    if (!this.isEmailValid || !this.isPhoneValid || !this.isPasswordValid) {
      console.error('Dữ liệu không hợp lệ!');
      return;  // Không lưu nếu có lỗi
    }

    this.saveUserData(); // Lưu thông tin người dùng
    this.isEditing = false; // Đóng chế độ chỉnh sửa sau khi lưu
  }
  logout(): void {
    localStorage.removeItem('username'); // Xóa tên tài khoản khi đăng xuất
    this.usernamehead = null;
    this.router.navigate(['/']); // Điều hướng về trang chủ hoặc trang đăng nhập
  }
  navigateToMessenger(): void {
    window.location.href = 'https://www.facebook.com/messages/t/100022817763633'; // Thay 'yourpage' bằng đường dẫn Messenger của bạn
  }
  goToUserProfile() {
    this.router.navigate(['/customer/profile']); // Điều hướng đến trang thông tin cá nhân
  }
}