import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    standalone: true,
    selector: 'app-permission-inheritance-badge',
    template: `
        <span 
            class="permission-badge"
            [class.inherited]="inherited"
            [class.explicit]="!inherited"
            [matTooltip]="tooltipText">
            <mat-icon class="badge-icon">{{ icon }}</mat-icon>
            <span class="badge-text">{{ text }}</span>
        </span>
    `,
    styles: [`
        .permission-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            cursor: help;
            transition: all 0.2s;
        }

        .permission-badge.inherited {
            background: #fff3e0;
            color: #e65100;
            border: 1px solid #ffb74d;
        }

        .permission-badge.inherited:hover {
            background: #ffe0b2;
            transform: scale(1.05);
        }

        .permission-badge.explicit {
            background: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #81c784;
        }

        .permission-badge.explicit:hover {
            background: #c8e6c9;
            transform: scale(1.05);
        }

        .badge-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
            line-height: 14px;
        }

        .badge-text {
            line-height: 1;
        }
    `],
    imports: [CommonModule, MatIconModule, MatTooltipModule],
})
export class PermissionInheritanceBadgeComponent {
    @Input() inherited: boolean = false;
    @Input() folderName?: string;

    get icon(): string {
        return this.inherited ? 'folder_shared' : 'lock';
    }

    get text(): string {
        return this.inherited ? 'Heredado' : 'Explícito';
    }

    get tooltipText(): string {
        if (this.inherited) {
            return this.folderName
                ? `Permisos heredados de la carpeta "${this.folderName}"`
                : 'Permisos heredados de la carpeta padre';
        }
        return 'Permisos asignados directamente a este documento';
    }
}
