import { NgModule, isDevMode, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { WorkoutComponent } from './components/workout/workout.component';
import { BuilderComponent } from './components/builder/builder.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TimerComponent } from './components/timer/timer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { environment } from '../environments/environment.development';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialModule } from './material.module';

// Import Capacitor
import { Capacitor } from '@capacitor/core';

// Service to detect Capacitor environment
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformDetectorService {
  constructor() {
    this.detectPlatform();
  }

  detectPlatform() {
    // Check if running in Capacitor
    const isCapacitor = Capacitor.isNativePlatform();
    
    // Add a class to the body when running in Capacitor
    if (isCapacitor) {
      document.body.classList.add('capacitor-app');
      console.log('Running in Capacitor environment');
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    TutorialComponent,
    DashBoardComponent,
    WorkoutComponent,
    BuilderComponent,
    LandingPageComponent,
    TimerComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MaterialModule
  ],
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    AuthGuard,
    provideAnimationsAsync(),
    // Include the platform detector service so it gets instantiated
    PlatformDetectorService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }