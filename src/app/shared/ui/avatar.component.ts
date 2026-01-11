import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
<div class="avatar" [class.user]="isUser"></div>
  `,
  styles: [`
.avatar{
  width:36px;
  height:36px;
  border-radius:50%;
  background:#ddd;
  background-image: linear-gradient(135deg, #bbb, #999);
  margin-right:6px;
}

.avatar.user{
  background-image: linear-gradient(135deg, #7ad3ff, #2f80ff);
}
  `]
})
export class AvatarComponent {
  @Input() isUser = false;
}
