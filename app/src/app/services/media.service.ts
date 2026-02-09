import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

export interface MediaUploadResponse {
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    constructor(private apiService: ApiService) { }

    /**
     * Upload an image file to the backend
     * @param file - The image file to upload
     * @returns Observable with the public URL of the uploaded image
     */
    uploadImage(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('image', file);

        return this.apiService.post<MediaUploadResponse>('media/upload', formData).pipe(
            map(response => response.data?.url || '')
        );
    }

    /**
     * Upload multiple images
     * @param files - Array of image files to upload
     * @returns Observable with array of public URLs
     */
    uploadImages(files: File[]): Observable<string[]> {
        const uploadObservables = files.map(file => this.uploadImage(file));

        // Convert array of observables to a single observable that emits an array
        return new Observable<string[]>(observer => {
            const urls: string[] = [];
            let completed = 0;

            uploadObservables.forEach((upload$, index) => {
                upload$.subscribe({
                    next: (url) => {
                        urls[index] = url;
                        completed++;

                        if (completed === files.length) {
                            observer.next(urls);
                            observer.complete();
                        }
                    },
                    error: (error) => {
                        observer.error(error);
                    }
                });
            });
        });
    }

    /**
     * Get the full URL for an image by filename
     * @param filename - The image filename
     * @returns Full URL to the image
     */
    getImageUrl(filename: string): string {
        return `${environment.apiUrl}/media/image/${filename}`;
    }
}
