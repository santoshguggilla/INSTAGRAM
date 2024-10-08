import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user: User = {
    userName: '',
    email: '',
    fullName: '',
    password: ''
  };

  emailExists: boolean = false; // Track if email exists

  constructor(private http: HttpClient, private router: Router,
    private userService:UserService) {}

    checkEmailExists() {
      // Ensure user.userName is defined and not empty
      if (this.user.userName) {
        this.userService.getUserByUsername(this.user.userName).subscribe(
          response => {
            this.emailExists = response ? true : false;
          },
          error => {
            console.error(error);
          }
        );
      }
      else {
        this.emailExists = false;
      }
    }
  onSubmit() {
    if (this.emailExists) {
      alert("Email already registered");
      return;
    }
    this.userService.saveUser(this.user)
      .subscribe(
        response => {
          console.log('Signup successful', response);
          // Optionally navigate to another page on success
          this.router.navigate(['/'], { queryParams: { username: this.user.userName } });
        },
        error => {
          if (error.error.text === 'ALREADY_REPORTED') {
            alert("Email already exists, please login");
            window.location.reload();
          } else {
            console.error(error);
            alert('An error occurred');
          }
        }
      );
  }
  onEmailChange() {
    this.checkEmailExists();
  }
}
