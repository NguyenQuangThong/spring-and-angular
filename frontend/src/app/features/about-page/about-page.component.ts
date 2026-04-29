import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink],
  template: `
    <section class="about">
      <h1>Tom tat kien thuc trong vi du</h1>

      <ol>
        <li><strong>Component lifecycle:</strong> xem hook trong LearningPage va LifecycleChild.</li>
        <li><strong>Routing:</strong> xem app.routes.ts va router-outlet trong app.html.</li>
        <li><strong>Service + HTTP call:</strong> xem PostsService goi API mau.</li>
        <li><strong>RxJS:</strong> xem search$, reload$, combineLatest, switchMap, catchError.</li>
        <li><strong>State management:</strong> xem LearningStore dung BehaviorSubject.</li>
      </ol>

      <a routerLink="/">Quay lai bai hoc</a>
    </section>
  `,
  styles: `
    .about {
      max-width: 760px;
      padding: 24px;
      border: 1px solid #dce3ea;
      border-radius: 8px;
      background: #ffffff;
    }

    h1 {
      margin: 0 0 16px;
      font-size: 28px;
    }

    li {
      margin: 10px 0;
      line-height: 1.6;
    }

    a {
      display: inline-block;
      margin-top: 12px;
      color: #1f6feb;
      font-weight: 700;
      text-decoration: none;
    }
  `,
})
export class AboutPageComponent {}
