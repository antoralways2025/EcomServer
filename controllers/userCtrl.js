// const Users = require('../models/userModel')
const Users =require ('../models/userModel') ;
const bcrypt=require('bcrypt') ;
const jwt = require('jsonwebtoken')
const Payments=require('../models/paymentModel')
      const userCtrl={

      register:async (req,res)=>{
            try {
              const {name,email,password,role}=req.body ;

              const user = await Users.findOne({email})
              
          
              
              if(user){
                  return res.status(400).json({msg:"The email already exists"}) ;
              }
              if(password.length <6){
                  return res.status(400).json({msg:"Password is at least 6 characters"}) ;
              }

              // password Encription
              const hashPassword= await bcrypt.hash(password,10) ;

                const newUser=new Users({
                  role, name,email,password:hashPassword
                })
                  // save mongodb
                await  newUser.save() ;

                // The create jsonwebtoken to authentication 
                const accesstoken=createAccessToken({id: await newUser._id})
                const refreshtoken = createRefreshToken({id: await newUser._id})
                res.cookie('refreshtoken',refreshtoken,{
                  httpOnly:true,
                  path:'user/refresh_token',
                  maxAge:7*24*60*60*1000 // 7 day 
                
                }) ;

                res.json({accesstoken}) ;

              

            } catch (error) {
                res.status(500).json({ msg:error.message})
            }
      },

      //  refersh token 
      refreshToken:async (req,res)=>{
        try {
          const rf_token= req.cookies.refreshtoken ;
          
          if(! rf_token) return res.status(400).json({msg:"Please Login or Register "}) ;

        const user=  await  jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET)
      
            if(!user) return res.status(400).json({msg:"Please Login or Register "}) ;
            const accesstoken=createAccessToken({id: user.id})
            res.json({accesstoken})
          
      

          // res.json({rf_token})
          
        } catch (error) {
          res.status(500).json({ msg:error.message})
        }
      },

           //  login router create 
      login: async(req,res)=>{
            try {
            
              const {email,password}=req.body;
              const user= await Users.findOne({email}) ;
              if(!user){
                res.status(400).json({msg:"User doesn't exist"})
              }

              const isMatch= await bcrypt.compare(password,user.password) ;
              if(!isMatch) return res.status(400).json({msg:"Incorrect Password "}) ;
              //  if login succces , create access tooken an refresh token 
              const accesstoken=createAccessToken({id:user._id}) ;
              const refreshToken=createRefreshToken({id:user._id});

              res.cookie('refreshtoken',refreshToken,{
                httpOnly:true,
                path:'/user/refresh_token',
                maxAge:7*24*60*60*1000
              })

              res.json({msg:'Login in succefully !',accesstoken})
            } catch (error) {
               
              return res.status(500).json({msg:error.message})
            }
      },

      logout:async(req,res)=>{
        try {
           res.clearCookie('refreshtoken',{path:'/user/refresh_token'}) ;
          return res.json({msg:"Logged out  "})
        } catch (error) {
          res.status(500).json({msg:error.message})
        }
      },

      getUser:async(req,res)=>{
        try {
            
      const user=   await Users.findById(req.user.id).select({password:0}) ;

      if( !user) return res.status(400).json({msg:"User dosenot exists"}) ;



          res.json(user) 
        } catch (error) {
          res.status(500).json({msg:error.message})
        }
      }
      ,
      addCart:async(req,res)=>{
        try {
          const user=await Users.findById(req.user.id) ;
          if(!user){
          return  res.status(400).json({msg:"User does not exists"});
          }
          
        await Users.findOneAndUpdate({_id:req.user.id},{

        cart:req.body.cart
      })

      res.json({msg:"Added to Cart ."}) ;

        } catch (error) {
          res.status(500).json({msg:error.message})
        }
      },
      history:async(req,res)=>{
        try {
           const history = await Payments.find({user_id:req.user.id})
           res.json(history)
        } catch (error) {
          res.status(500).json({msg:error.message})
        }
      } 
 
} 





// token genarate fucntion 
const createAccessToken=(user)=>{
 
  return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'11m'})
}

const createRefreshToken=(user)=>{
  return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}


module.exports= userCtrl