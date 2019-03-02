require('dotenv').config();
const mongoose = require('mongoose');
const { PORT: port=4000, MONGO_URI: mongoURI } = process.env;
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI,{useNewUrlParser: true})
.then(() => {
    console.log('connected to mongodb'); })
.catch((e) => {
    console.error(e); 
});
const Koa = require('koa'); 
const Router = require('koa-router'); 
const bodyParser = require('koa-bodyparser'); 
const api = require('./api');  
const app = new Koa(); 
const router = new Router();  // 라우터 설정 
router.use('/api', api.routes()); // api 라우트 적용 
app.use(bodyParser()); // 라우터 적용 전에 bodyParser 적용 
app.use(router.routes()).use(router.allowedMethods()); // app 인스턴스에 라우터 적용   
app.listen(port, () => {  
    console.log('listening to port', port);
 });