 const Products =require('../models/productModel' );
// filter ,sorting and paginotiong

class APIfeature{
    constructor(query,queryString){
        this.query=query;
        this.queryString =queryString;
        }

    filtering(){
        const queryObj={...this.queryString}
        // console.log({before:queryObj}) // before deleted page 

        const excludedFields = ['page','sort','limit'] ;
        excludedFields.forEach(el => delete(queryObj[el])) ;
            
        // console.log({after:queryObj}) //afeter delete 
        let queryStr= JSON.stringify(queryObj) ;
        
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match=> '$' + match) ;
        // console.log({queryObj,queryStr})

        // gte = geter than equal
        // gt = geter than  
        // lt = less than 
        // lte = less than  equal


        this.query.find(JSON.parse(queryStr))
        return this; 
    }
    
    sorting(){

        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ') ;
             
            this.query = this.query.sort(sortBy) ;
        }else{
            this.query=this.query.sort('-createdAt')
        }

        return this ;
    }
    paginating(){
        const page = this.queryString.page  * 1 || 1
        const limit = this.queryString.limit * 1 || 6
        const skip = ( page - 1 ) * limit ;
        this.query=this.query.skip(skip).limit(limit);
        return this ;
    }
}



const products={
    getProducts:async(req,res)=>{
        try {
            
            const features= new APIfeature(Products.find(),req.query)
            .filtering().sorting().paginating();
            
            const products= await features.query ; 
            
             
            res.json({
                status: "SUCCESS",
                result:products.length,
                products
            })
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    createProduct:async(req,res)=>{
        try {
            const {product_id,title,price,description, content,images,category} =req.body;

            if(!images){
                return res.status(400).json({msg:"No Image upload"});
            }

            const product= await Products.findOne({product_id}) ;

            if(product) {
                return res.status(400).json({msg:"This product already exists ..."})
            }
            

            const newProduct = new Products({
                product_id,
                title:title.toLowerCase(),
                price,
                description, 
                content,
                images,
                category
            })

            await newProduct.save()
            res.json({msg:"Create a product "})

        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    deleteProduct:async(req,res)=>{
        try {
            await Products.findByIdAndDelete({_id:req.params.id});
            res.json({msg:"Deleted a Product!"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },

    upadateProduct:async(req,res)=>{
        try {

            const { title,price,description, content,images,category} =req.body;
            if(!images){
                return res.status(400).json({msg:"No image upload"})
            }

            await Products.findByIdAndUpdate({_id:req.params.id},{
                title:title.toLowerCase() ,
                price,description,content, images,category
            })

            res.json({msg:"Upadated a Product "})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    }
}



module.exports=products