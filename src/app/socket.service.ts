import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket:any;
  nwmsg:any;
  private url="http://localhost:4200/";
  connect() {
    this.socket=io(this.url);
   }
  sendMessage(data) {
    this.socket.emit('new-message', data);
  }
  getnames(){
    this.socket.emit('names');
  }
  sendusr(data){
    this.socket.emit('username',data);
  }
  getser=()=>{
    this.socket.emit('time');
  }
  getusr = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('userback',(data)=>{
        observer.next(data);
      });
    });
  }
  leave(data: string){
    this.socket.emit("leave",data);
  }
  gettime=()=>{
    return Observable.create((observer) => {
      this.socket.on('time', (data) => {
          observer.next(data);
      });
  });
  }
  update=()=>{
      return Observable.create((observer)=>{
        this.socket.on('user',(data)=>{
          observer.next(data);
        })
      })
  } 
  getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('newmessage', (data) => {
            observer.next(data);
        });
    });
  }
}
  
  
  
