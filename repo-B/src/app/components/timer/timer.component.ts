import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { Router } from '@angular/router'
import { interval, map, Subscription, take } from 'rxjs'
import { AuthService } from '../../services/auth-service.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-timer',
  standalone: false,
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit, OnDestroy {
  route = inject(Router);
  auth = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  
  timeLeft: number = 60;
  timerInterval?: Subscription;
  isTimerRunning: boolean = false;
  loggedin!:boolean;

  ngOnInit(): void {
    this.auth.user$.pipe(take(1),map(user =>!!user)).subscribe(loggedIn =>this.loggedin);
  }
  setTimerDuration(event:any){
    this.timeLeft = event.target.value;
  }
  startTimer(): void {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timerInterval = interval(1000).subscribe(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          this.pauseTimer();
          this.onTimerComplete()
        }
      });
    }
  }

  pauseTimer(): void {
    this.timerInterval?.unsubscribe();
    this.isTimerRunning = false;
  }

  resetTimer(): void {
    this.pauseTimer();
    this.timeLeft = 60;
  }

  onTimerComplete(): void {
    this.resetTimer();
    const hapticsImpactMedium = async () => {
      await Haptics.impact({ style: ImpactStyle.Medium }); //vibrate!
    };
    const hapticsVibrate = async () => {
        await Haptics.vibrate();
      };
      
    this._snackBar.open('Your break is up!','Get back to work');

    this.route.navigate(['/workout']);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    this.timerInterval?.unsubscribe();
  }
}
