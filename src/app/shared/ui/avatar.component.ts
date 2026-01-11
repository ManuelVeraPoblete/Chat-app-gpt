import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="avatar" [class.user]="isUser" [class.bot]="!isUser">
      <mat-icon>{{ isUser ? 'person' : 'smart_toy' }}</mat-icon>
    </div>
  `,
  styles: [`
    .avatar{
      width: 36px; height: 36px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      opacity: .95;
    }
    .user{ background: #1f6feb; color: #fff; }
    .bot{ background: #2ea043; color: #fff; }
    mat-icon{ font-size: 20px; width: 20px; height: 20px; }
  `]
})
export class AvatarComponent {
  @Input() isUser = false;
}
