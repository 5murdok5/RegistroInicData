import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  email: string;
  constructor(
    public authService : AuthService,
    public router : Router
  ) { }

  ngOnInit() {
  }

  doLogin()
  {
    this.authService.PasswordRecover(this.email).then( () =>{
      this.router.navigate(['/home']);
    }).catch(err => {
      alert('los datos son erroneos');
    })
  }

}
