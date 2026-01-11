import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
<div class="bubble" [class.user]="isUser" [class.error]="status==='error'">

  <!-- Texto -->
  <div class="text" [innerText]="text"></div>

  <!-- Meta: hora + estado -->
  <div class="meta">
    <span class="time">{{ createdAt | date:'HH:mm' }}</span>

    <!-- Mientras llega streaming -->
    <ng-container *ngIf="status === 'sending'">
      <mat-progress-spinner diameter="14" mode="indeterminate"></mat-progress-spinner>
    </ng-container>

    <!-- Error -->
    <ng-container *ngIf="status === 'error'">
      <span class="err">Error</span>
    </ng-container>
  </div>

</div>
  `,
  styles: [`
.bubble{
  max-width:70%;
  padding:8px 10px;
  border-radius:8px;
  background:#ffffff;
  font-size:14px;
  position:relative;
  box-shadow:0 1px 1px rgba(0,0,0,0.05);
  word-break: break-word;
}

.bubble.user{
  background:#dcf8c6;
}

.bubble.error{
  background:#ffe3e3;
}

.text{
  white-space:pre-wrap;
}

.meta{
  margin-top: 4px;
  display:flex;
  justify-content:flex-end;
  align-items:center;
  gap:6px;
  opacity:.75;
}

.time{
  font-size:11px;
  color:#666;
}

.err{
  font-size:11px;
  font-weight:600;
  color:#7a0000;
}
  `]
})
export class MessageBubbleComponent {
  @Input() text = '';
  @Input() isUser = false;
  @Input() createdAt = Date.now();

  // ✅ Mantener status para compatibilidad con el facade
  @Input() status: 'sending' | 'sent' | 'error' | undefined;
}
