import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DanhGiaService } from '../../../../core/services/DanhGia.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-sua-danh-gia',
  imports: [MATERIAL , ReactiveFormsModule],
  templateUrl: './sua-danh-gia.html',
  styleUrl: './sua-danh-gia.scss'
})
export class SuaDanhGia implements OnInit {
  reviewForm!: FormGroup;

  // Quản lý trạng thái sao
  currentRating = 0;
  hoverRating = 0;
  stars = [1, 2, 3, 4, 5];

  // Văn bản hiển thị theo mức độ sao
  textLevels: { [key: number]: string } = {
    1: 'Rất tệ 😞',
    2: 'Không hài lòng 🙁',
    3: 'Bình thường 😐',
    4: 'Hài lòng 🙂',
    5: 'Tuyệt vời! 😍'
  };

  constructor(private fb: FormBuilder,
    private danhGiaService: DanhGiaService,
    private dialogRef: MatDialogRef<SuaDanhGia>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [this.data.so_sao, [Validators.required]],
      comment: [this.data.noi_dung, [Validators.required, Validators.minLength(10)]]
    });

    this.currentRating = this.data.so_sao;
  }

  // Xử lý khi di chuột vào sao
  onMouseEnter(star: number): void {
    this.hoverRating = star;
  }

  // Xử lý khi di chuột ra ngoài vùng sao
  onMouseLeave(): void {
    this.hoverRating = 0;
  }

  // Xử lý khi click chọn sao
  selectRating(star: number): void {
    this.currentRating = star;
    this.reviewForm.patchValue({ rating: star });
  }

  // Trả về text trạng thái hiện tại (ưu tiên lúc đang hover)
  get ratingText(): string {
    const activeRating = this.hoverRating || this.currentRating;
    return this.textLevels[activeRating] || '';
  }

  // Gửi dữ liệu
  onSubmit() {
    if (this.reviewForm.invalid) return;

    const body = {
      so_sao: this.reviewForm.value.rating,
      noi_dung: this.reviewForm.value.comment
    };

    this.danhGiaService.UpdateDanhGia(this.data.ID, body)
      .subscribe({
        next: () => {
          // 🔥 trả về cho dialog cha
          this.dialogRef.close({
            success: true,
            message: 'Cập nhật đánh giá thành công'
          });
        },
        error: () => {
          this.dialogRef.close({
            success: false,
            message: 'Cập nhật thất bại'
          });
        }
      });
  }
}