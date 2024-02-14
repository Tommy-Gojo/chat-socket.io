import { Component } from '@angular/core';
import { WebSocket } from 'ws';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage {
  pseudo: string = ""

  // Default avatar

  avatarUrl: string = "C:\\Users\\Aelion\\Desktop\\default-avatar-profile-icon-vector-260nw-2271804793.webp"
  showForm: boolean = false; 

  constructor() {}

  ngOnInit(): void{
    this.showForm = !this.showForm; 
  }

  _submitForm(){
    console.log(this.pseudo);
    console.log(this.avatarUrl);
    if(this.pseudo.length == 0){
      this.showForm = false

    }
    this.showForm = !this.showForm; 
    sessionStorage.setItem('pseudo', this.pseudo)
    sessionStorage.setItem('avatar', this.avatarUrl)
    
  }
}
