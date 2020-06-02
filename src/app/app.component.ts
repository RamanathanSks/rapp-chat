import { Component, OnInit} from '@angular/core';


import {SocketService} from './socket.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private socket:SocketService){
    console.log("chat...");
  }
  title = 'rapp';
  name="";
  search;
  servert:string="Time...";
  mdate=new Date();
  w=window.innerWidth;
  inusr:boolean=false;
  display;
  dis=0;
  bc;
  message: string; 
  messages: string[] = [];
  user:string[]=[];
  alt=0;
  alert(){
    this.alt=0;
  }
  getw(){
    this.w=window.innerWidth;
   }
  chatnow(user){
    this.alt=0;
    this.name=user;
    this.socket.sendusr({usr:this.name});
  }
  leave(){
    this.socket.leave(this.name);
    window.location.reload();
  }
  snd(val){
    if(val.value.length==0){
      this.bc="red";
    }
    else{
      this.socket.sendMessage({msg:this.message,usr:this.name});  
      this.message ='';
      this.bc="";
    }
  }
//onimplement
  ngOnInit(): void {
    this.socket.connect() 
    this.socket.getMessages()
    .subscribe((data:any) => {
      console.log(data);
      if(data.usr == this.name){
        data.usr="You";
      }
      this.messages.push(data);
    });
    this.socket.getnames();
    this.socket.update().
    subscribe((data:any)=>{
         this.user=data;
    });
    this.socket.getusr()
      .subscribe((data:any)=>{
        console.log(data);
        if(data.msg=="Sorry...Username is Already taken"){
            this.alt=1;
        }
        else{
          if(data.usr==this.name){
            this.display="none";
            this.dis=1;
          }
        }
    });
    this.socket.getser();
    this.socket.gettime()
    .subscribe((data:any)=>{
      this.servert=data;
    });
    this.display='block';
    setInterval(()=>{
      this.getw();
    },100);
  } 
}