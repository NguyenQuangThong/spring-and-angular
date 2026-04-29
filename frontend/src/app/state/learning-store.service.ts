import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface LearningState {
  lifecycleRuns: number;
  favoritePostIds: number[];
  showOnlyFavorites: boolean;
}

const initialState: LearningState = {
  lifecycleRuns: 0,
  favoritePostIds: [],
  showOnlyFavorites: false,
};

@Injectable({
  providedIn: 'root',
})
export class LearningStore {
  // State management:
  // BehaviorSubject giu gia tri state moi nhat va phat lai gia tri do cho subscriber moi.
  // Day la cach "mini store" de hieu truoc khi hoc NgRx/Signal Store.
  private readonly stateSubject = new BehaviorSubject<LearningState>(initialState);

  // $ la convention de noi bien nay la Observable.
  readonly state$ = this.stateSubject.asObservable();

  // Selector:
  // Component khong can biet toan bo state neu chi can mot phan nho.
  readonly favoritePostIds$ = this.state$.pipe(map((state) => state.favoritePostIds));
  readonly showOnlyFavorites$ = this.state$.pipe(map((state) => state.showOnlyFavorites));

  get snapshot(): LearningState {
    return this.stateSubject.value;
  }

  markLifecycleRun(): void {
    this.patchState({
      lifecycleRuns: this.snapshot.lifecycleRuns + 1,
    });
  }

  toggleFavorite(postId: number): void {
    const favoritePostIds = this.snapshot.favoritePostIds.includes(postId)
      ? this.snapshot.favoritePostIds.filter((id) => id !== postId)
      : [...this.snapshot.favoritePostIds, postId];

    this.patchState({ favoritePostIds });
  }

  toggleFavoriteFilter(): void {
    this.patchState({
      showOnlyFavorites: !this.snapshot.showOnlyFavorites,
    });
  }

  resetFavorites(): void {
    this.patchState({
      favoritePostIds: [],
      showOnlyFavorites: false,
    });
  }

  private patchState(partialState: Partial<LearningState>): void {
    // Luon tao object moi thay vi sua object cu.
    // Immutable update giup Angular/RxJS de nhan ra state da thay doi.
    this.stateSubject.next({
      ...this.snapshot,
      ...partialState,
    });
  }
}
