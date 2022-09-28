const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({}).sort("-price")
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {

  const {featured,company,name,sort} = req.query
  const queryObject ={}
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
  if(sort){
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  }
  else{
    result = result.sort("")
  }

  const products = await result
  if(products.length<1){
    res.status(404).json({msg:"No Results Found"})
  }
    res.status(200).json({ products })
};

module.exports = { getAllProducts, getAllProductsStatic };
