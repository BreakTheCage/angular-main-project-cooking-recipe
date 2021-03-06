import { Component, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirectve } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    
    isLoginMode = false;
    isLoading = false;
    errorBanner: string = null;
    @ViewChild(PlaceholderDirectve, {static: false}) alertHost: PlaceholderDirectve;
    private closeSub: Subscription;
    constructor(
            private authService: AuthService, 
            private router: Router,
            private componentFactoryResolver: ComponentFactoryResolver
            ){}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if(!form.valid) {
            return;
        }
        const email = form.value.email;
        const pass = form.value.password;
        this.isLoading = true;
        let authObs: Observable<AuthResponseData>;
        if(this.isLoginMode) {
            authObs = this.authService.login(email, pass);
        } else {
            authObs = this.authService.signup(email, pass);
        }

        authObs.subscribe(
            resData => {
                console.log('signup response: ', resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            }, 
            errorMessage => {
                console.log('signup error: ', errorMessage);
                this.errorBanner = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        )
        
        form.reset();
    }

    onHandleError() {
        this.errorBanner = null;
    }

    private showErrorAlert(message: string) {
        //Wrong: const alertCmp = new AlertComponent();
        const alertCmpFactory =  this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.closeEvent.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        })

    }

    ngOnDestroy(): void {
        if(this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

}