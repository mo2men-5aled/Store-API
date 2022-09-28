const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({}).sort("-price")
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {

  const {featured,company,name,sort,fields, numericFilters} = req.query
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

  if(numericFilters){
    const operatorMap ={
      ">":"$gt",
      ">=":"$gte",
      "=":"$eq",
      "<":"$lt",
      "<=":"$lte"
    }
    const regEx = /\b(<|>|<=|>=|=)\b/g
    let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
    const options = ['price','rating'];
    filters = filters.split(",").forEach(element => {
      const [field,operator,value] = element.split("-")
      if(options.includes(field)){
        queryObject[field] = {[operator]:Number(value)}
      }
    });
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
