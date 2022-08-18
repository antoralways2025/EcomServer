const jwt=require('jsonwebtoken') ;

const auth= async(req,res,next)=>{

    try {
        const token= req.header('Authorization') ;
        if( !token) return res.status(400).json({msg:"Inavalid Authorization "})

         const user = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) ;
        // console.log(user)
         if(!user) return res.status(400).json({msg:"Inavalid Authorization"})
         req.user=user;
         req.id=user._id ;


         next()

    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
}

module.exports=auth