import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-yeu-thich',
  imports: [MATERIAL],
  templateUrl: './yeu-thich.html',
})
export class YeuThich implements OnInit {

  danhSach: any[] = [];


  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any[],
  private dialogRef: MatDialogRef<YeuThich>
) {
  const uniqueMap = new Map();

  (data || []).forEach(item => {
    uniqueMap.set(item.ma_mon_an, item);
  });

  this.danhSach = Array.from(uniqueMap.values());
}

  close() {
    this.dialogRef.close();
  }

  get tongSoYeuThich(): number {
    return this.danhSach.length;
  }
  ngOnInit(): void {
    console.log('danhSach:', this.danhSach);
  }
}