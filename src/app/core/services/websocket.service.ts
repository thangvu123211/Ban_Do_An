import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class WebsocketService {

    private ws!: WebSocket;

    private messageSubject = new Subject<any>();
    messages$ = this.messageSubject.asObservable();

    connect() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

        const token = localStorage.getItem('token');

        const wsUrl = token
            ? `${environment.wsUrl}?token=${token}`
            : environment.wsPublicUrl;

        this.ws = new WebSocket(wsUrl);

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messageSubject.next(data);
        };
    }

    disconnect() {
        this.ws?.close();
    }
}