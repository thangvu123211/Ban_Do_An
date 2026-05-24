import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL } from '../../../../Shared/material';
import { DanhGiaService } from '../../../../core/services/DanhGia.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-danh-gia',
  imports: [MATERIAL, ReactiveFormsModule],
  templateUrl: './danh-gia.html',
  styleUrl: './danh-gia.scss'
})
export class DanhGia implements OnInit {
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
    private dialogRef: MatDialogRef<DanhGia>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });

    console.log(this.data);
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const body = {
      ma_hoa_don: this.data.ma_hoa_don,
      ma_mon_an: this.data.ma_mon_an,
      ma_nguoi_dung: user.ma_nguoi_dung,
      so_sao: this.reviewForm.value.rating,
      noi_dung: this.reviewForm.value.comment
    };

    console.log('SEND:', body);

    this.danhGiaService.createDanhGia(body).subscribe({
      next: res => {
        this.dialogRef.close({
          success: true,
          message: 'Gửi đánh giá thành công!'
        });
      },
      error: err => {
        this.dialogRef.close({
          success: false,
          message: 'Gửi đánh giá thất bại!'
        });
      }
    });
  }
}
