import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center p-4">
      <img [src]="data.imageUrl"
           class="w-[1000px] h-[700px] object-cover rounded-lg shadow-lg">
    </div>
  `
})
export class PhongToAnh {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}
}
