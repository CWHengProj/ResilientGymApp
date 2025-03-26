import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);

  form=this.fb.nonNullable.group({
    username:['',Validators.required],
    email:['',Validators.required],
    password:['',Validators.required]
  });
  errorMessage: string | null = null;
  onSubmit():void{
    const rawForm = this.form.getRawValue()
    this.authService.register(rawForm.email,rawForm.username,rawForm.password)
    .subscribe({
      next:()=> {
        this.router.navigate(['/workout']),
        this.userService.createUser(this.authService.user$)
      },
      error:(err)=> {this.errorMessage = err.code} 
    });
  }
}
