require('dotenv').config() ;
const express=require('express') ;
const mongoose=require('mongoose') ;
const cors=require('cors')
const fileUpload=require( 'express-fileupload');
const cookieParser=require('cookie-parser') ;

const path=require('path'); 

const app=express() ;


// middware 
app.use(express.json()) ;
app.use(cookieParser()) ;
app.use(cors());
app.use(fileUpload({
    useTempFiles:true
}))



// Routers
app.use('/user',require('./routes/userRouter'))
app.use('/api',require('./routes/categoryRouter')) ;
app.use('/api',require('./routes/uploads'))
app.use('/api',require('./routes/productRouter'))
app.use('/api',require('./routes/paymentRotuer'))
// connnect to mongodb

  const URL=process.env.MONGODB_URL ;

mongoose.connect(URL,{
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>console.log('Data Connection succesfully done !'))
 .catch((err)=> console.log('Fail to data conection '))


const PORT=process.env.PORT || 5000 ;


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
}) 
 


 