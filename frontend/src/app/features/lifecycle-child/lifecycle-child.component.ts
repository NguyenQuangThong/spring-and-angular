import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-lifecycle-child',
  template: `
    <section class="panel">
      <h2>1. Component lifecycle</h2>
      <p>
        Gia tri tu component cha:
        <strong>{{ valueFromParent }}</strong>
      </p>
      <p class="note">Mo DevTools Console de xem thu tu cac lifecycle hook dang chay.</p>
    </section>
  `,
  styles: `
    .panel {
      padding: 18px;
      border: 1px solid #dce3ea;
      border-radius: 8px;
      background: #ffffff;
    }

    h2 {
      margin: 0 0 10px;
      font-size: 18px;
    }

    p {
      margin: 8px 0 0;
    }

    .note {
      color: #66788a;
      font-size: 14px;
    }
  `,
})
export class LifecycleChildComponent implements OnChanges {
  @Input({ required: true }) valueFromParent = 0;

  ngOnChanges(changes: SimpleChanges): void {
    // Component lifecycle - ngOnChanges:
    // Chay khi @Input thay doi. Hook nay phu hop de xu ly data component cha truyen xuong.
    console.log('Child ngOnChanges:', changes);
  }
}
