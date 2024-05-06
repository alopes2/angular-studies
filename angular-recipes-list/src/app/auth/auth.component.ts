import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  @ViewChild(PlaceholderDirective) alertHolder!: PlaceholderDirective;
  alertComponentRefSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnDestroy(): void {
    if (this.alertComponentRefSubscription) {
      this.alertComponentRefSubscription.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe({
      next: (response) => {
        console.log(response);
        form.reset();
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (error: string) => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
        this.showErrorAlert(error);
      },
    });
  }

  private showErrorAlert(message: string) {
    const componentRef =
      this.alertHolder.ViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    this.alertComponentRefSubscription = componentRef.instance.close.subscribe(
      () => {
        this.alertComponentRefSubscription!.unsubscribe();
        this.alertHolder.ViewContainerRef.clear();
      }
    );
  }
}
