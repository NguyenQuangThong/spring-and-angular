import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  finalize,
  interval,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { LifecycleChildComponent } from '../lifecycle-child/lifecycle-child.component';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { LearningStore } from '../../state/learning-store.service';

@Component({
  selector: 'app-learning-page',
  imports: [AsyncPipe, NgFor, NgIf, LifecycleChildComponent],
  templateUrl: './learning-page.component.html',
  styleUrl: './learning-page.component.css',
})
export class LearningPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly postsService = inject(PostsService);
  private readonly store = inject(LearningStore);
  private readonly destroyRef = inject(DestroyRef);

  // Component state cuc bo:
  // signal phu hop cho gia tri dong gian trong component.
  readonly lifecycleCounter = signal(0);
  readonly doubledCounter = computed(() => this.lifecycleCounter() * 2);

  // RxJS input stream:
  // Subject dung khi minh muon chu dong "push" event vao stream, vi du user go search.
  private readonly searchTextSubject = new Subject<string>();
  private readonly reloadSubject = new Subject<void>();

  // BehaviorSubject phu hop cho loading vi no can gia tri ban dau va gia tri moi nhat.
  readonly loading$ = new BehaviorSubject(false);

  // State management:
  // Component doc state thong qua Observable tu store, khong sua bien state truc tiep.
  readonly state$ = this.store.state$;

  private readonly searchText$ = this.searchTextSubject.pipe(
    startWith(''),
    debounceTime(300),
    map((value) => value.trim().toLowerCase()),
    distinctUntilChanged(),
  );

  // RxJS quan trong nhat:
  // combineLatest ket hop nhieu stream: text search, nut reload, state filter yeu thich.
  // switchMap huy HTTP cu neu co search/reload moi, tranh hien data da cu.
  // catchError bien loi HTTP thanh data rong de UI khong bi crash.
  // shareReplay(1) cache ket qua moi nhat cho nhieu async pipe cung dung.
  readonly posts$ = combineLatest([
    this.searchText$,
    this.reloadSubject.pipe(startWith(undefined)),
    this.store.favoritePostIds$,
    this.store.showOnlyFavorites$,
  ]).pipe(
    tap(() => this.loading$.next(true)),
    switchMap(([searchText, _reload, favoritePostIds, showOnlyFavorites]) =>
      this.postsService.getPosts().pipe(
        delay(350),
        map((posts) => this.filterPosts(posts, searchText, favoritePostIds, showOnlyFavorites)),
        catchError((error) => {
          console.error('HTTP error:', error);
          return of([]);
        }),
        finalize(() => this.loading$.next(false)),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  ngOnInit(): void {
    // Component lifecycle - ngOnInit:
    // Chay 1 lan sau khi Angular tao component va set input ban dau.
    // Thuong dung de load data, tao subscription, khoi tao form.
    console.log('LearningPage ngOnInit');
    this.store.markLifecycleRun();

    // RxJS + lifecycle:
    // interval tao stream moi 1000ms. takeUntilDestroyed tu unsubscribe khi component bi huy.
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((seconds) => {
        console.log(`Component van song duoc ${seconds + 1} giay`);
      });
  }

  ngAfterViewInit(): void {
    // Component lifecycle - ngAfterViewInit:
    // Chay sau khi template va child components da render xong.
    // Thuong dung khi can thao tac voi DOM/ViewChild.
    console.log('LearningPage ngAfterViewInit');
  }

  ngOnDestroy(): void {
    // Component lifecycle - ngOnDestroy:
    // Chay khi route doi sang component khac hoac component bi remove.
    // Day la noi don dep timer/subscription neu ban khong dung takeUntilDestroyed.
    console.log('LearningPage ngOnDestroy');
  }

  onSearch(value: string): void {
    this.searchTextSubject.next(value);
  }

  reload(): void {
    this.reloadSubject.next();
  }

  increaseLifecycleCounter(): void {
    this.lifecycleCounter.update((value) => value + 1);
  }

  toggleFavorite(postId: number): void {
    this.store.toggleFavorite(postId);
  }

  toggleFavoriteFilter(): void {
    this.store.toggleFavoriteFilter();
  }

  resetFavorites(): void {
    this.store.resetFavorites();
  }

  trackPost(_index: number, post: Post): number {
    return post.id;
  }

  private filterPosts(
    posts: Post[],
    searchText: string,
    favoritePostIds: number[],
    showOnlyFavorites: boolean,
  ): Post[] {
    return posts
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchText) ||
          post.body.toLowerCase().includes(searchText);

        const matchesFavoriteFilter = !showOnlyFavorites || favoritePostIds.includes(post.id);

        return matchesSearch && matchesFavoriteFilter;
      })
      .slice(0, 12);
  }
}
