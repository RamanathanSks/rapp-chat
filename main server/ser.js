const express=require('express');
const app=express();
const server=require('http').createServer(app);
const io=require('socket.io').listen(server)
const port=process.env.PORT || 4200;
const path=require('path');
const bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(express.static(__dirname));
app.all("*",(req,res,next)=>{
    res.sendFile(path.resolve("./index.html"));
});
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
let user=[];
let connect=[];
let f=0;
io.on('connection', (socket) => {
    console.log('user connected');
    connect.push(socket);
    socket.on('reload',function(){
        location.reload(); 
    });
    socket.on('disconnect',()=>{
        connect.pop();
        if(connect.length==0){
            user=[];
        }
        console.log(user);
        console.log("user disconnected");
    })
    socket.on('new-message', (data) => {
        console.log(data);
        io.emit('newmessage',data);
    });
    socket.on("leave",(data)=>{
        user=user.filter(item=>item!==data);
        console.log("after leave  "+ user);
        console.log("poped "+ data);
    });
    socket.on('username',(data)=>{
        f=0;
        if(user.length ==0){
            console.log("first data "+data);
            io.emit('userback',data);
            user.push(data.usr);
        }
        else{
            for (let i in user){
                console.log(user);
                if(user[i]==data.usr){
                    console.log("repeter "+data.usr);
                    f=1;
                    socket.emit("userback",{msg:"Sorry...Username is Already taken"});
                    break;
                }
            }
            if (f==0){
                console.log("io emiting data "+data);
                user.push(data.usr);
                console.log("pushed "+data.usr);
                io.emit('userback',data);
            }
        }
    });
    socket.on('time',()=>{
        setInterval(() =>{
            d=new Date();
            io.emit('time',
            d.getDate()+"     -     "+(d.getMonth()+1)+"     -     "+(d.getFullYear())+"                       "+d.getHours()+"     :     "+d.getMinutes()+"     :     "+d.getSeconds());
        }, 1000);
    })
    socket.on('names',()=>{
        setInterval(()=>{
            // console.log(user);
            io.emit('user',user)
        },1000);
    });
});