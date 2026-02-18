import { inject } from '@angular/core';
import { FileService } from '../files/file.service';
import { AuthService } from '../auth/auth.service';
import { PermissionService } from '../permissions/permission.service';
import { AuditService } from '../audit/audit.service';

/**
 * Servicio para inicializar datos de demostración en la aplicación
 */
export class MockDataService {
    private fileService = inject(FileService);
    private authService = inject(AuthService);
    private permissionService = inject(PermissionService);
    private auditService = inject(AuditService);

    /**
     * Inicializa datos de demostración si no existen
     */
    initializeMockData(): void {

        if (this.fileService.files().length > 0) {
            console.log('Ya existen datos, saltando inicialización mock');
            return;
        }

        console.log('Inicializando datos de demostración...');

        const users = this.authService.getAllUsers();
        if (users.length === 0) {
            console.warn('No hay usuarios en el sistema');
            return;
        }

        const admin = users.find(u => u.email === 'admin@admin.com');
        const manager = users.find(u => u.email === 'manager@admin.com');
        const user = users.find(u => u.email === 'user@admin.com');

        if (!admin) return;

        const mockFiles = [
            {
                displayName: 'Presentación del Proyecto',
                fileName: 'proyecto_presentacion.pptx',
                extension: 'pptx',
                size: 2548736,
                path: '/documentos/proyecto_presentacion.pptx',
                description: 'Presentación final del proyecto LuisCendanDrive',
                tags: ['presentacion', 'proyecto', 'importante']
            },
            {
                displayName: 'Manual de Usuario',
                fileName: 'manual_usuario.pdf',
                extension: 'pdf',
                size: 1245678,
                path: '/manuales/manual_usuario.pdf',
                description: 'Documentación completa para usuarios finales',
                tags: ['documentacion', 'manual', 'usuarios']
            },
            {
                displayName: 'Hoja de Cálculo Presupuesto',
                fileName: 'presupuesto_2025.xlsx',
                extension: 'xlsx',
                size: 856432,
                path: '/finanzas/presupuesto_2025.xlsx',
                description: 'Presupuesto anual del proyecto',
                tags: ['finanzas', 'presupuesto', '2025']
            },
            {
                displayName: 'Documento de Requisitos',
                fileName: 'requisitos.docx',
                extension: 'docx',
                size: 445678,
                path: '/documentos/requisitos.docx',
                description: 'Especificación de requisitos funcionales',
                tags: ['requisitos', 'documentacion']
            },
            {
                displayName: 'Logo de la Empresa',
                fileName: 'logo.png',
                extension: 'png',
                size: 125890,
                path: '/recursos/logo.png',
                description: 'Logo oficial de la empresa',
                tags: ['imagen', 'logo', 'branding']
            },
            {
                displayName: 'Código Fuente Comprimido',
                fileName: 'source_code.zip',
                extension: 'zip',
                size: 5678945,
                path: '/desarrollo/source_code.zip',
                description: 'Backup del código fuente del proyecto',
                tags: ['codigo', 'desarrollo', 'backup']
            },
            {
                displayName: 'Informe de Auditoría',
                fileName: 'auditoria_q4.pdf',
                extension: 'pdf',
                size: 987654,
                path: '/informes/auditoria_q4.pdf',
                description: 'Informe trimestral de auditoría',
                tags: ['auditoria', 'informe', 'q4']
            },
            {
                displayName: 'Plan de Marketing',
                fileName: 'marketing_plan.docx',
                extension: 'docx',
                size: 678912,
                path: '/marketing/marketing_plan.docx',
                description: 'Estrategia de marketing para el próximo trimestre',
                tags: ['marketing', 'plan', 'estrategia']
            }
        ];

        const createdFileIds: string[] = [];
        mockFiles.forEach((mockFile, index) => {

            const file = new File(['Contenido simulado'], mockFile.fileName, {
                type: this.getMimeType(mockFile.extension)
            });

            const fileId = `demo-file-${index + 1}`;
            createdFileIds.push(fileId);

            console.log(`Creando archivo demo: ${mockFile.displayName}`);
        });

        console.log('Datos de demostración inicializados correctamente');
        console.log(`Total de archivos creados: ${mockFiles.length}`);
    }

    private getMimeType(extension: string): string {
        const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'zip': 'application/zip'
        };
        return mimeTypes[extension] || 'application/octet-stream';
    }
}
