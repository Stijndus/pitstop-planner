import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { RegisterCredentials } from '../../models';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterPage {
    credentials: RegisterCredentials = {
        username: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    };

    isLoading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onRegister() {
        if (this.credentials.password !== this.credentials.password_confirmation) {
            this.errorMessage = 'Passwords do not match';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.register(this.credentials).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.router.navigate(['/tabs']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
                console.error('Registration error:', error);
            }
        });
    }
}
