import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { UserService } from '../service/user.service';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  @Input() user: User | null = null;
  isProfilePage: boolean | undefined;
  currentIndex = 0;
  private routeSubscription!: Subscription;

  constructor(private postService: PostService, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.url.subscribe((url: UrlSegment[]) => {
      this.isProfilePage = url.some(segment => segment.path === 'profile');
      if (this.user && this.user.id && this.isProfilePage) {
        this.loadUserPosts(this.user.id.toString());
      } else {
        this.loadAllPosts();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadUserPosts(userId: string): void {
    this.postService.getPostsByUserId(userId).subscribe(posts => {
      this.posts = posts;
      console.log(posts);
    });
  }

  loadAllPosts(): void {
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts;
      console.log(posts);
    });
  }

  // Method to chunk the posts array into smaller arrays
  chunk(arr: any[], chunkSize: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  get visiblePost(): Post | null {
    return this.posts[this.currentIndex] || null;
  }

  nextPost(): void {
    if (this.posts.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.posts.length;
    }
  }

  previousPost(): void {
    if (this.posts.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.posts.length) % this.posts.length;
    }
  }
}
