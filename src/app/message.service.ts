import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class MessageService {
  constructor() { }
  messages: any[] = [];

  add(message: any) {
    const _this = this;
    message.id = new Date().getTime();
    _this.messages.push(message);

    setTimeout(
      function() {
        _this.clear(message.id);
      }
    , 3000)
  }

  clear(id: number) {
    this.messages = this.messages.filter(item =>
      item.id !== id
    );
  }
}
