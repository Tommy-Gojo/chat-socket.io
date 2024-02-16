import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NativeSocketService } from './core/services/native-socket.service';
import { MessageInterface, MessageType } from './core/interfaces/message-interface';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit {
   // Pseudo de l'utilisateur actuel
  pseudo: string = "";
  avatarUrl: string = "https://gravatar.com/avatar/07170e6f941e511c351a38bcbdd12966?s=400&d=robohash&r=x";
  messageText: string = '';
  messages: MessageInterface[] = [];
  isConnected: boolean = false;
  isRegister: boolean = false;
  private subscriptions: Subscription[] = [];
  username: string = '';
  showForm: boolean = false;
  
  constructor(private chatService: NativeSocketService) {}
  
  ngOnInit(): void {
    this.showForm = !this.showForm;
    this.connect();
    
    this.chatService.getIsConnected().subscribe(isConnected => {
      this.isConnected = isConnected;
    });

    this.subscriptions.push(
      this.chatService.getOnReceive().subscribe((message: MessageInterface) => {
        if (message.content && message.content.trim() !== '') {
          message.isCurrentUserMessage = message.sender === this.pseudo;
          this.messages.push(message);
        }
      })
    );
  }
  
  connect(): void {
    this.chatService.connect();
  }

  registerUsername(): void {
    if (this.pseudo.trim() === '') {
      return;
    }
    
    sessionStorage.setItem('pseudo', this.pseudo)
    sessionStorage.setItem('avatar', this.avatarUrl)
    
    this.showForm = !this.showForm;

    
    const registrationMessage: MessageInterface = {
      sender: this.pseudo,
      type: MessageType.JOIN,
      content: 'Join the chat',
      avatarUrl: this.avatarUrl
    }
    this.isRegister = true
    this.chatService.sendMessage('chat.register', registrationMessage);
  }

  unsubscribeUsername(): void {
    const registrationMessage: MessageInterface = {
      sender: this.pseudo,
      type: MessageType.JOIN,
      content: 'Left the chat',
      avatarUrl: this.avatarUrl
    }
    this.isRegister = false
    this.chatService.sendMessage('chat.register', registrationMessage);
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;

    const message: MessageInterface = {
      sender: this.pseudo,
      type: MessageType.CHAT,
      content: this.messageText,
      avatarUrl: this.avatarUrl
    };

    this.chatService.sendMessage('chat.send', message);
    this.messageText = '';
  }
}