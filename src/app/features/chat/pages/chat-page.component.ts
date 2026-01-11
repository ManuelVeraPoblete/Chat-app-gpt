import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  computed
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChatFacade } from '../facade/chat.facade';
import { AvatarComponent } from '../../../shared/ui/avatar.component';
import { MessageBubbleComponent } from '../../../shared/ui/message-bubble.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    AvatarComponent,
    MessageBubbleComponent,
  ],
  template: `
<div class="chat-page">

  <!-- HEADER WhatsApp-like -->
  <mat-toolbar class="chat-header">
    <button mat-icon-button aria-label="Volver">
      <mat-icon>arrow_back</mat-icon>
    </button>

    <app-avatar [isUser]="false"></app-avatar>

    <div class="header-text">
      <div class="name">Adam</div>
      <div class="status">online</div>
    </div>

    <span class="spacer"></span>

    <button mat-icon-button aria-label="Videollamada"><mat-icon>videocam</mat-icon></button>
    <button mat-icon-button aria-label="Llamada"><mat-icon>call</mat-icon></button>

    <button
      mat-icon-button
      matTooltip="Reiniciar conversación"
      aria-label="Reiniciar"
      (click)="onClear()">
      <mat-icon>restart_alt</mat-icon>
    </button>

    <button mat-icon-button aria-label="Más"><mat-icon>more_vert</mat-icon></button>
  </mat-toolbar>

  <!-- BODY -->
  <div class="chat-body" #scrollContainer>
    <div class="day-separator">TODAY</div>

    <!-- Importante: mantenemos tu señal computed -->
    <div
      *ngFor="let m of messages(); trackBy: trackById"
      class="row"
      [class.user]="m.role === 'user'">

      <app-message-bubble
        [text]="m.text"
        [isUser]="m.role === 'user'"
        [createdAt]="m.createdAt"
        [status]="m.status">
      </app-message-bubble>

    </div>
  </div>

  <!-- INPUT -->
  <form class="chat-input" (ngSubmit)="onSend()" autocomplete="off">

    <button mat-icon-button type="button" aria-label="Emoji">
      <mat-icon>emoji_emotions</mat-icon>
    </button>

    <!-- Usamos textarea como tu versión original (mejor UX) -->
    <textarea
      class="input"
      name="message"
      rows="1"
      [(ngModel)]="draft"
      placeholder="Type a message"
      [disabled]="loading()"
      (keydown)="onKeydown($event)">
    </textarea>

    <button mat-icon-button type="button" aria-label="Adjuntar">
      <mat-icon>attach_file</mat-icon>
    </button>

    <button
      mat-fab
      color="primary"
      class="send-btn"
      type="submit"
      [disabled]="loading() || !draft.trim()"
      matTooltip="Enviar"
      aria-label="Enviar">
      <mat-icon>send</mat-icon>
    </button>

  </form>

</div>
  `,
  styles: [`
/* CONTENEDOR GENERAL */
.chat-page{
  height: 100dvh;
  display:flex;
  flex-direction:column;
  background:#efeae2;
}

/* HEADER */
.chat-header{
  background:#075e54;
  color:white;
}

.header-text{ margin-left:10px; }
.name{ font-weight:600; }
.status{ font-size:12px; opacity:.85; }
.spacer{ flex:1; }

/* BODY */
.chat-body{
  flex:1;
  padding:12px;
  overflow:auto;
  display:flex;
  flex-direction:column;
  gap:8px;
}

.row{
  display:flex;
  justify-content:flex-start;
}

.row.user{
  justify-content:flex-end;
}

.day-separator{
  align-self:center;
  background:#d5f3ff;
  color:#444;
  font-size:12px;
  padding:4px 10px;
  border-radius:10px;
  margin:10px 0;
}

/* INPUT */
.chat-input{
  display:flex;
  align-items:center;
  gap:6px;
  padding:8px;
  background:#f0f0f0;
}

.input{
  flex:1;
  border:none;
  outline:none;
  padding:10px 12px;
  border-radius:20px;
  background:#fff;
  font-family: inherit;
  font-size: 14px;
  resize:none;
  line-height: 18px;
  max-height: 120px;
  overflow:auto;
}

.send-btn{
  width:44px;
  height:44px;
}
  `]
})
export class ChatPageComponent implements AfterViewInit {

  @ViewChild('scrollContainer') private readonly scrollContainer?: ElementRef<HTMLDivElement>;

  // Texto escrito por el usuario
  draft = '';

  // ✅ Mantener tus señales computed originales (NO romper facade)
  readonly messages = computed(() => this.facade.messages());
  readonly loading = computed(() => this.facade.loading());

  private readonly isBrowser: boolean;

  constructor(
    private readonly facade: ChatFacade,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  /**
   * Enter envía (bloquea salto de línea).
   * Shift+Enter permite salto de línea.
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.onSend();
    }
  }

  /**
   * ✅ CLAVE: await al facade.send para garantizar que dispare la llamada (stream o http)
   */
  async onSend(): Promise<void> {
    const text = this.draft.trim();
    if (!text) return;

    this.draft = '';

    // ✅ Esto es lo que asegura que realmente ejecute el flujo async
    await this.facade.send(text);

    this.scrollToBottom();
  }

  onClear(): void {
    this.facade.clearConversation();
    this.scrollToBottom();
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  private scrollToBottom(): void {
    if (!this.isBrowser) return;

    const schedule =
      typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (cb: FrameRequestCallback) => setTimeout(cb, 0);

    schedule(() => {
      const el = this.scrollContainer?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  }
}
