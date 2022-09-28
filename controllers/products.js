const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({}).sort("-price")
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {

  const {featured,company,name,sort,fields} = req.query
  const queryObject ={}

  //filtering
  if(featured){
    queryObject.featured = featured
  }

  if(company){
    queryObject.company = company
  }

  if(name){
    queryObject.name = { $regex: name, $options: "i"}
  }

  let result = Product.find(queryObject)

  //sorting
  if(sort){
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  }
  else{
    result = result.sort("")
  }

  //selecting
  if(fields){
    const fieldsList = fields.split(",").join(" ")
    result = result.select(fieldsList)
  }


  //limit
  //number of pages depend on limit that user choses
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit)||10
  const skip = (page-1)*limit 

  result = result.skip(skip).limit(limit)

  const products = await result
  if(products.length<1){
    res.status(404).json({msg:"No Results Found"})
  }
    res.status(200).json({ products })
};

module.exports = { getAllProducts, getAllProductsStatic };
