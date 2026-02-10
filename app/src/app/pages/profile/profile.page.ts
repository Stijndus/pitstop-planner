import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSpinner,
    IonBackButton,
    IonButtons,
    IonList,
  ],
})
export class ProfilePage implements OnInit {
  user: Profile | null = null;
  loading: boolean = false;
  error: string | null = null;
  userId: number | null = null;
  isOwnProfile: boolean = false;
  isFollowing: boolean = false;
  currentUserId: number | null = null;

  // Posts
  postsError: string | null = null;

  constructor(
    private authService: AuthService,

  ) { }

  ngOnInit() {

  }

  onLogout() {
    this.authService.logout();
  }
}
