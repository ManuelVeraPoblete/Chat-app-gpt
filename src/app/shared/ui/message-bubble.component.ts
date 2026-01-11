import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="bubble" [class.user]="isUser" [class.bot]="!isUser" [class.error]="status==='error'">
      <div class="text" [innerText]="text"></div>

      <div class="meta">
        <span class="time">{{ createdAt | date:'HH:mm' }}</span>

        @if (status === 'sending') {
          <mat-progress-spinner diameter="14" mode="indeterminate"></mat-progress-spinner>
        }
        @if (status === 'error') {
          <span class="err">Error</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .bubble{
      max-width: min(720px, 82%);
      padding: 10px 12px;
      border-radius: 14px;
      line-height: 1.35;
      box-shadow: 0 1px 0 rgba(0,0,0,.06);
      white-space: pre-wrap;
      word-break: break-word;
    }
    .user{
      background: #d9fdd3; /* WhatsApp-like */
      border-top-right-radius: 6px;
    }
    .bot{
      background: #fff;
      border-top-left-radius: 6px;
    }
    .error{
      background: #ffe3e3;
    }
    .text{ font-size: 14px; color: #111; }
    .meta{
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      opacity: .7;
      font-size: 11px;
    }
    .err{ font-weight: 600; }
  `]
})
export class MessageBubbleComponent {
  @Input() text = '';
  @Input() isUser = false;
  @Input() createdAt = Date.now();
  @Input() status: 'sending' | 'sent' | 'error' | undefined;
}
