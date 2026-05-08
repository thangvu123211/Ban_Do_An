import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AIChatResponse {
  type: 'text' | 'food_list';
  message?: string;
  foods?: {
    ma_mon_an: number;
    ten: string;
    gia: number;
    anh: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class AiChatService {

  private API = 'http://localhost:3000/api/ai/chat';

  constructor(private http: HttpClient) {}

  chat(userId: string, message: string) {
    return this.http.post<AIChatResponse>(this.API, {
      user_id: userId,
      message
    });
  }
}