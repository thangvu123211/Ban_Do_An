// import { Injectable } from '@angular/core';
// import { MatPaginatorIntl } from '@angular/material/paginator';
// import { Subject } from 'rxjs';

// @Injectable()
// export class CustomPaginatorIntl extends MatPaginatorIntl {
//   override itemsPerPageLabel = 'Số mục mỗi trang';
//   override nextPageLabel     = 'Trang tiếp';
//   override previousPageLabel = 'Trang trước';
//   override firstPageLabel    = 'Trang đầu';
//   override lastPageLabel     = 'Trang cuối';

//   override getRangeLabel = (page: number, pageSize: number, length: number): string => {
//     if (length === 0 || pageSize === 0) return `0 của ${length}`;
//     const startIndex = page * pageSize;
//     const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
//     return `${startIndex + 1} – ${endIndex} của ${length}`;
//   };

//   // Thêm subject này để thông báo thay đổi labels
//   override readonly changes: Subject<void> = new Subject<void>();

//   constructor() {
//     super();
//     // Khi tạo mới, gọi next để paginator update ngay
//     this.changes.next();
//   }
// }
