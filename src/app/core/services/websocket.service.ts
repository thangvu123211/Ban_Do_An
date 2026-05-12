import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {

    private ws!: WebSocket;

    private messageSubject = new Subject<any>();
    messages$ = this.messageSubject.asObservable();

    connect(maMonAn: number) {
        const token = localStorage.getItem('token');

        // ✅ Tự chọn endpoint theo login hay không
        const url = token
            ? `ws://localhost:3000/ws?token=${token}`
            : `ws://localhost:3000/ws/public`;

        this.ws = new WebSocket(url);

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messageSubject.next(data);
        };
        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }

    disconnect() {
        this.ws?.close();
    }
}