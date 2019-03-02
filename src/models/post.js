const mongoose = require('mongoose');
const {Schema} = mongoose;

//스키마를 만들 때는 mongoose 모듈의 Schema를 사용하여 정의합니다.
const Post = new Schema({
    title: String,
    body: String,
    tags: [String],
    publishedDate: {type:Date, default: new Date()}
});

//첫번째 파라미터는 스키마 이름, 두번째 파라미터는 스키마 객체 
//스키마 이름을 정해주면 이 이름의 복수 형태로 데이터 베이스에 컬렉션 이름을 만듭니다.
//ex) Post -> Posts
//이 컨벤션을 따르고 싶지 않다면 다음 코드처럼 세 번째 파라미터에 여러분이 원하는 이름을 입력하면 됩니다.
module.exports = mongoose.model('Post', Post); 