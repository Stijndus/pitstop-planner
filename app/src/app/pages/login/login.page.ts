import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/auth.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
    credentials: LoginCredentials = {
        email: '',
        password: ''
    };

    isLoading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onLogin() {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.credentials).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.router.navigate(['/tabs']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
                console.error('Login error:', error);
            }
        });
    }
}
