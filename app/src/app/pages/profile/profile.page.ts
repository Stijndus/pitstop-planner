import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
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
  IonAvatar
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UserFollowService } from 'src/app/services/user-follow.service';
import { PostService } from 'src/app/services/post.service';
import { Profile } from 'src/app/models/profile.model';
import { Post } from 'src/app/models/post.model';
import { PostComponent } from 'src/app/components/post/post.component';

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
    PostComponent,
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
  posts: Post[] = [];
  loadingPosts: boolean = false;
  postsError: string | null = null;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private followService: UserFollowService,
    private postService: PostService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get the current logged-in user's ID
    const cachedUser = this.profileService.getCachedUser();
    this.currentUserId = cachedUser?.id || null;

    // Get userId from route parameter
    this.route.params.subscribe(params => {
      const userIdParam = params['userId'];

      // Handle "me" as a special case for own profile
      if (userIdParam === 'me' && this.currentUserId) {
        this.userId = this.currentUserId;
        this.isOwnProfile = true;
      } else {
        this.userId = +userIdParam;
        this.isOwnProfile = this.userId === this.currentUserId;
      }

      if (this.userId) {
        this.loadProfile();
        this.loadUserPosts();
      }
    });
  }

  /**
   * Load user profile from API
   */
  loadProfile() {
    if (!this.userId) return;

    this.loading = true;
    this.error = null;

    this.profileService.getUserProfile(this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.data) {
            this.user = response.data;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error = 'Failed to load profile. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Load user posts from API
   */
  loadUserPosts() {
    if (!this.userId) return;

    this.loadingPosts = true;
    this.postsError = null;

    this.postService.getUserPosts(this.userId).subscribe({
      next: (response) => {
        this.posts = response.data || [];
        this.loadingPosts = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.postsError = 'Failed to load posts.';
        this.loadingPosts = false;
      }
    });
  }

  followUser() {
    if (!this.userId) return;

    this.followService.followUser(this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.isFollowing = true;
          if (this.user) {
            this.user.is_following = true;
            this.user.followers_count = (this.user.followers_count || 0) + 1;
          }
        }
      },
      error: (err) => {
        console.error('Error following user:', err);
      }
    });
  }

  unfollowUser() {
    if (!this.userId) return;

    this.followService.unfollowUser(this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.isFollowing = false;
          if (this.user) {
            this.user.is_following = false;
            this.user.followers_count = (this.user.followers_count || 0) - 1;
          }
        }
      },
      error: (err) => {
        console.error('Error unfollowing user:', err);
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
