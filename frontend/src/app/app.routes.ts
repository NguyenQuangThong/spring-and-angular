import { Routes } from '@angular/router';

export const routes: Routes = [
  // Routing:
  // Moi object la mot route. Khi URL khop "path", Angular render component tuong ung
  // vao <router-outlet> trong app.html.
  {
    path: '',
    loadComponent: () =>
      import('./features/learning-page/learning-page.component').then(
        (m) => m.LearningPageComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about-page/about-page.component').then((m) => m.AboutPageComponent),
  },
  // Route wildcard: bat moi URL khong ton tai va dua ve trang chinh.
  {
    path: '**',
    redirectTo: '',
  },
];
