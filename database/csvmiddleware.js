module.exports = (req, res, next) => {
   const fileUpload = require('express-fileupload');
	   fileUpload()
   if( req.originalUrl.indexOf('upload') >= 0  ){

	   console.log(req.files);
   }
  //res.header('X-Hello', 'World')
  next()
}
