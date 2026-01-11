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
    <div class="page">
      <mat-toolbar class="topbar" color="primary">
        <div class="title">
          <mat-icon>chat</mat-icon>
          <div class="texts">
            <div class="name">Chat IA</div>
            <div class="sub">
              @if (model()) { <span>Modelo: {{ model() }}</span> }
              @if (conversationId()) { <span> • ID: {{ conversationId() }}</span> }
            </div>
          </div>
        </div>

        <span class="spacer"></span>

        <button mat-icon-button matTooltip="Reiniciar conversación" (click)="onClear()">
          <mat-icon>restart_alt</mat-icon>
        </button>
      </mat-toolbar>

      <div class="chat-bg">
        <div class="messages" #scrollContainer>
          @for (m of messages(); track m.id) {
            <div class="row" [class.user]="m.role==='user'" [class.bot]="m.role==='assistant'">
              @if (m.role === 'assistant') { <app-avatar [isUser]="false" /> }

              <app-message-bubble
                [text]="m.text"
                [isUser]="m.role==='user'"
                [createdAt]="m.createdAt"
                [status]="m.status"
              />

              @if (m.role === 'user') { <app-avatar [isUser]="true" /> }
            </div>
          }
        </div>
      </div>

      <!-- ✅ Enviar estable por submit -->
      <form class="composer" (ngSubmit)="onSend()" autocomplete="off">
        <div class="composer-inner">
          <mat-form-field class="input" appearance="outline">
            <textarea
              matInput
              name="message"
              rows="1"
              [(ngModel)]="draft"
              placeholder="Escribe un mensaje…"
              [disabled]="loading()"
              (keydown)="onKeydown($event)"
            ></textarea>
          </mat-form-field>

          <button
            mat-fab
            color="primary"
            class="send"
            type="submit"
            [disabled]="loading() || !draft.trim()"
            matTooltip="Enviar"
          >
            <mat-icon>send</mat-icon>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page{
      height: 100dvh;
      display: grid;
      grid-template-rows: auto 1fr auto;
      background: #0b141a;
    }

    .topbar{
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .title{
      display:flex; align-items:center; gap: 10px;
    }
    .texts .name{ font-weight: 700; }
    .texts .sub{
      font-size: 12px;
      opacity: .85;
      display:flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .spacer{ flex: 1; }

    .chat-bg{
      background:
        radial-gradient(circle at 20% 0%, rgba(255,255,255,.08), transparent 40%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,.06), transparent 45%),
        #0b141a;
      overflow: hidden;
    }

    .messages{
      height: 100%;
      overflow: auto;
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .row{
      display:flex;
      gap: 10px;
      align-items: flex-end;
    }
    .row.user{ justify-content: flex-end; }
    .row.bot{ justify-content: flex-start; }

    .composer{
      background: #111b21;
      padding: 10px 12px;
      border-top: 1px solid rgba(255,255,255,.06);
      margin: 0;
    }
    .composer-inner{
      max-width: 980px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      align-items: end;
    }
    .input{ width: 100%; }

    /* ✅ Input visible en oscuro */
    :host ::ng-deep .mat-mdc-text-field-wrapper{
      background: rgba(255,255,255,.06);
      border-radius: 10px;
    }

    textarea{
      color: rgba(255,255,255,.92) !important;
      caret-color: rgba(255,255,255,.92) !important;
      resize: none;
      max-height: 140px;
      overflow: auto;
    }

    textarea::placeholder{
      color: rgba(255,255,255,.55);
    }

    .send{
      width: 52px;
      height: 52px;
    }
  `]
})
export class ChatPageComponent implements AfterViewInit {
  @ViewChild('scrollContainer') private readonly scrollContainer?: ElementRef<HTMLDivElement>;

  draft = '';

  readonly messages = computed(() => this.facade.messages());
  readonly loading = computed(() => this.facade.loading());
  readonly model = computed(() => this.facade.model());
  readonly conversationId = computed(() => this.facade.conversationId());

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
   * Shift+Enter deja el salto de línea normal.
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.onSend();
    }
  }

  async onSend(): Promise<void> {
    const text = this.draft.trim();
    if (!text) return;

    this.draft = '';
    await this.facade.send(text);
    this.scrollToBottom();
  }

  onClear(): void {
    this.facade.clearConversation();
    this.scrollToBottom();
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
