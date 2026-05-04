import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfessionDto } from '@shared/models/common.models';

const EMOJI_SUGGESTIONS = ['👶', '📚', '⚽', '🎵', '🎨', '💻', '🔬', '🏥', '🌍', '📐', '🎭', '🍳'];

@Component({
  selector: 'app-profession-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish" }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nomi</mat-label>
          <input matInput formControlName="name" placeholder="Masalan: Maktabgacha ta'lim tarbiyachisi" />
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline" class="col-code">
            <mat-label>Kodi</mat-label>
            <input matInput formControlName="code" placeholder="Masalan: PD" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-duration">
            <mat-label>O'qish muddati (yil)</mat-label>
            <input matInput type="number" formControlName="durationYears" min="1" max="6" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tavsif</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="emoji-block">
          <mat-form-field appearance="outline" class="emoji-input">
            <mat-label>Ikonka (emoji)</mat-label>
            <input matInput formControlName="iconEmoji" maxlength="4" placeholder="👶" />
            <mat-hint align="end">Landing sahifasida ko'rinadi</mat-hint>
          </mat-form-field>

          <div class="emoji-suggestions">
            <span class="hint">Tanlang:</span>
            @for (e of suggestions; track e) {
              <button type="button" class="emoji-chip" (click)="setEmoji(e)" [class.active]="form.value.iconEmoji === e">
                {{ e }}
              </button>
            }
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Bekor qilish</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Saqlash</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }

    .row {
      display: flex;
      gap: 12px;

      .col-code { flex: 1; }
      .col-duration { width: 180px; }
    }

    .emoji-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .emoji-input { width: 100%; }

    .emoji-suggestions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;

      .hint {
        font: 600 11.5px/1 var(--et-font-sans);
        color: var(--et-ink-3);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-right: 6px;
      }

      .emoji-chip {
        width: 36px;
        height: 36px;
        font-size: 20px;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--et-r-sm);
        border: 1px solid var(--et-line);
        background: var(--et-surface);
        cursor: pointer;
        padding: 0;
        transition: background 0.15s, border-color 0.15s, transform 0.15s;

        &:hover {
          background: var(--et-surface-2);
          border-color: var(--et-line-2);
          transform: translateY(-1px);
        }

        &.active {
          background: var(--et-primary-50);
          border-color: var(--et-primary-500);
        }
      }
    }
  `]
})
export class ProfessionDialogComponent {
  data = inject<ProfessionDto | null>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProfessionDialogComponent>);

  suggestions = EMOJI_SUGGESTIONS;

  form: FormGroup = this.fb.group({
    name: [this.data?.name || '', Validators.required],
    code: [this.data?.code || '', Validators.required],
    description: [this.data?.description || ''],
    durationYears: [this.data?.durationYears ?? 2, [Validators.required, Validators.min(1), Validators.max(6)]],
    iconEmoji: [this.data?.iconEmoji || '']
  });

  setEmoji(emoji: string): void {
    this.form.patchValue({ iconEmoji: emoji });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
