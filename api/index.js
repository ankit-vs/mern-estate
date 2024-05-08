import express from 'express';

const app=express();

app.listen(3000,()=>{
    console.log("Server is running at posrt 3000!!!");
});
app.get('/',(req,res)=>
{

})