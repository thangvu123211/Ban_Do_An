import { Component, Inject } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chi-tiett-lien-he',
  imports: [MATERIAL],
  templateUrl: './chi-tiett-lien-he.html',
  styleUrl: './chi-tiett-lien-he.scss'
})
export class ChiTiettLienHe {
constructor(
    private dialogRef: MatDialogRef<ChiTiettLienHe>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }
}
