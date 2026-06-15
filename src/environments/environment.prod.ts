export const environment = {
  production: false,
  // apiUrl: 'http://localhost:3000',
  apiUrl: 'https://chubby-anything-deranged.ngrok-free.dev',
  wsUrl: 'wss://chubby-anything-deranged.ngrok-free.dev/ws',
  wsPublicUrl: 'wss://chubby-anything-deranged.ngrok-free.dev/ws/public',


  payment: {
    qrBaseUrl: 'https://qr.sepay.vn/img',
    qrAcc: '0933924075',     // 👈 số tài khoản bạn
    qrBank: 'MBBank',         // 👈 ví dụ: MBBank / Vietcombank
    qrName: 'Vũ Việt Thắng'   // 👈 tên chủ TK
  },

};

