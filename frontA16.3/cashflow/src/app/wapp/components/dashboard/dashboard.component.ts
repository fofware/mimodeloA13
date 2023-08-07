import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappSocketService } from '../../services/whatsapp-socket.service';
import { dataSocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  skt = inject(WhatsappSocketService);
  apiSkt = inject(dataSocketService);

  sktConnect(){
    this.skt.connect();
  }

  sktDisConnect(){
    this.skt.disconnect();
  }
  sktSendmsg(){
    this.skt.emit('ping');
  }

  sktSendmsgAll(){
    this.skt.emit('pingtoall');
  }

  apiConnect(){
    this.apiSkt.connect();
  }

  apiDisConnect(){
    this.apiSkt.disconnect();
  }
  apiSendmsg(){
    this.apiSkt.emit('ping');
  }
  apiSendmsgAll(){
    this.apiSkt.emit('pingtoall');
  }
}
