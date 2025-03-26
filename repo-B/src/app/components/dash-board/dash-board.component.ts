import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { map, Subscription, take } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dash-board',
  standalone: false,
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit, OnDestroy{

  subscription = new Subscription;
  user=inject(UserService);
  auth = inject(AuthService);
  http=inject(HttpClient);
  fb=inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  
  userForm!:FormGroup;
  email:string = '';
  durationForm!:FormGroup;
  freshStart!: FormGroup;
  ngOnInit(){
    this.subscription.add(

      this.auth.user$.pipe(take(1),map(user => user?.email|| ''))
      .subscribe(email=> this.email=email)
    )
    this.createForm();
  }
  createForm(){
    this.userForm = this.fb.group({
      urgency: this.fb.control<string>('Low', Validators.required),
      comment: this.fb.control<string>('',[Validators.minLength(20), Validators.required])
      
    });
    this.durationForm = this.fb.group({
      duration: this.fb.control<string>('',Validators.required)
    });
    this.freshStart = this.fb.group({
      confirm:this.fb.control<boolean>(false,Validators.required)
    });
  }
  sendEmailToDev() {
    this._snackBar.open('Thank you for your feedback!','Okay');
    
    const feedbackEmail ={
      address:this.email,
      comment: this.userForm.get('comment')?.value,
      urgency: this.userForm.get('urgency')?.value
    }
    this.subscription.add(
      this.http.post<string>(`${environment.baseUrl}/api/sendEmail`,feedbackEmail).subscribe({
        next: () => console.log("successful!"),
        error:(err)=>console.log(err)
      })
    );
  }
      
  requestWorkoutHistory() {
    this._snackBar.open('Here you go!','Okay');
    this.user.requestWorkoutHistory(this.email,this.durationForm.get('duration')?.value);
  }

  clearUserData() {
    this.subscription.add(
      this.user.clearUserData(this.email).subscribe(
        {
          next:()=>{
            this._snackBar.open('Your data has been successfully deleted.','Okay');

          },
          error: errors =>{
            console.log("Your data has been successfully deleted.");
            console.error(errors);
          }
        }
      )
    )
    this.subscription.add(
      this.user.createUser(this.auth.user$)
    )
    }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }
}
