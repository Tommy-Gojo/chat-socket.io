import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Stomp from 'stompjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NativeSocketService {
  private stompClient: Stomp.Client | null = null;
  private isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // BehaviorSubject pour les messages reçus
  private onReceive: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() {}

  public connect(): void {
    // Établissement de la connexion WebSocket
    const socket = new WebSocket('ws://localhost:8081/stomp');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, frame => {
      this.isConnected.next(true);
      console.log('Connected: ' + frame);

      // Souscription au sujet pour recevoir des messages
      this.listenForMessages();
    }, error => {
      console.error('Connection error: ', error);
      this.isConnected.next(false);
    });
  }
  

  private listenForMessages(): void {
    if (!this.stompClient) return;

    const subscription = this.stompClient.subscribe('/topic/public', message => {
      // Traitement des messages reçus
      this.onReceive.next(JSON.parse(message.body));
    });

    // Gestion de la désinscription lors de la déconnexion
    this.isConnected.subscribe(isConnected => {
      if (!isConnected) {
        subscription.unsubscribe();
      }
    });
  }

  public sendMessage(endpoint: string, message: any): void {
    if (!this.stompClient || !this.isConnected.value) return;
    this.stompClient.send(`/app/chat.message`, {}, JSON.stringify(message));
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        this.isConnected.next(false);
        console.log('Disconnected');
      });
    }
  }

  public getIsConnected(): BehaviorSubject<boolean> {
    return this.isConnected;
  }

  public getOnReceive(): BehaviorSubject<any> {
    return this.onReceive;
  }
}