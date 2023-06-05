import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface WhatsApp {
  isWhatsapp: boolean;
  user?: {
    businessProfile?:{
      id:{
        server: string;
        user:	string;
        _serialized: string;

      }
    };
    id?:{
      server: string;
      user:	string;
      _serialized: string;
    }
    number?: string;
    isBusiness?: boolean;
    isEnterprise?: boolean;
    name?: string;
    pushname?: string;
    shortName?: string;
    type?: string;
    verifiedLevel?: number;
    verifiedName?: string;
    isMe?: boolean;
    isUser?: boolean;
    isGroup?: boolean;
    isWAContact?: boolean;
    isMyContact?: boolean;
    isBlocked?: boolean;
  };
  about?: string;
  picUrl?: string;
  formatedNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private URL = environment.WAP_API;
  private NUM = environment.WAP_NUM;

  _httpClient = inject(HttpClient);

  exist(number:string) {
    console.log(`${this.URL}/info/${this.NUM}/${number}`)
    return this._httpClient.get<WhatsApp>(`${this.URL}/info/${this.NUM}/${number}`)
  }
}
