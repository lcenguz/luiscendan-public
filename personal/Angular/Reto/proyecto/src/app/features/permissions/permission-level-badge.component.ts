import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-permission-level-badge',
    template: `
    <span [class]="getBadgeClass()" [style.padding]="'0.25rem 0.75rem'" [style.border-radius]="'12px'" [style.font-size]="'0.85rem'" [style.font-weight]="'500'">
      {{ getLevelText() }}
    </span>
  `,
    styles: [`
    .badge-owner {
      background-color: #d32f2f;
      color: white;
    }
    .badge-edit {
      background-color: #1976d2;
      color: white;
    }
    .badge-view {
      background-color: #757575;
      color: white;
    }
    .badge-none {
      background-color: #e0e0e0;
      color: #424242;
    }
  `],
    imports: [CommonModule],
})
export class PermissionLevelBadgeComponent {
    @Input() level: string = 'NONE';

    getBadgeClass(): string {
        const classes: Record<string, string> = {
            'OWNER': 'badge-owner',
            'EDIT': 'badge-edit',
            'VIEW': 'badge-view',
            'NONE': 'badge-none',
        };
        return classes[this.level] || 'badge-none';
    }

    getLevelText(): string {
        const texts: Record<string, string> = {
            'OWNER': 'Propietario',
            'EDIT': 'Puede editar',
            'VIEW': 'Solo lectura',
            'NONE': 'Sin acceso',
        };
        return texts[this.level] || this.level;
    }
}
