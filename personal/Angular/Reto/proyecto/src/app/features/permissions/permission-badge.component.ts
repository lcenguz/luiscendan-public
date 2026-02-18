import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-permission-badge',
    template: `
    @if (inherited) {
      <span class="badge bg-secondary" matTooltip="Permiso heredado de la carpeta padre">
        <mat-icon class="small-icon">folder</mat-icon>
        Heredado
      </span>
    } @else {
      <span class="badge bg-primary" matTooltip="Permiso explícito en este documento">
        <mat-icon class="small-icon">verified</mat-icon>
        Explícito
      </span>
    }
  `,
    styles: [`
    .small-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 2px;
    }
  `],
    imports: [MatTooltipModule, MatIconModule],
})
export class PermissionBadgeComponent {
    @Input() inherited: boolean = false;
}
