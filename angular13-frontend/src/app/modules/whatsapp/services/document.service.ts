import { Injectable } from '@angular/core';
import { Socket2Service } from 'src/app/services/socket.service';
import { Document } from '../models/document.model'

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  currentDocument = this.socket.fromEvent<Document>("document");
  documents = this.socket.fromEvent<string[]>('documents');

  constructor(private socket: Socket2Service) { }

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }
  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }
  
  getSocketId(){
    console.log(this.socket)
  }
  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;

  }
}
