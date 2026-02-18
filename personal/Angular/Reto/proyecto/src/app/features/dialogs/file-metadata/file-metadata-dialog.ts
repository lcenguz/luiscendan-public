import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FileDocument, FileMetadataUpdate } from '../../../core/files/file.models';

@Component({
  standalone: true,
  selector: 'app-file-metadata-dialog',
  templateUrl: './file-metadata-dialog.html',
  styleUrls: ['./file-metadata-dialog.scss'],
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class FileMetadataDialogComponent {

  displayName: string;
  description: string;
  tagsText: string;

  constructor(
    private dialogRef: MatDialogRef<FileMetadataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileDocument,
  ) {
    this.displayName = data.displayName;
    this.description = data.description ?? '';
    this.tagsText = (data.tags ?? []).join(', ');
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    const tags = this.tagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => !!t);

    const changes: FileMetadataUpdate = {
      displayName: this.displayName,
      description: this.description,
      tags,
    };

    this.dialogRef.close(changes);
  }
}
