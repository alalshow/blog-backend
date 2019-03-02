const { ObjectId } = require('mongoose').Types;
exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;
    if(!ObjectId.isValid(id)) {
        ctx.status = 400;
        ctx.body = "잘못된 ObjectId 입니다.";
        return;
    }
    return next();
}

const Post = require('models/post');  
const Joi = require('joi');

exports.write = async (ctx) => {
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required()
    });
    const result = Joi.validate(ctx.request.body, schema);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const {title, body, tags} = ctx.request.body;
    const post = new Post({title, body, tags});//인스턴스 만들기
    try {
        await post.save(); //DB저장
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500)
    }
};  
exports.list = async (ctx) => {
    try {
        const page = parseInt(ctx.query.page || 1, 10);
        if(page < 1) {
            ctx.status = 400;
            return;
        }
        //lean은 반환 형식이 JSON형태로 바뀜
        //find함수 호출 후 exec()를 붙여야 서버에 쿼리를 요청함
        const posts = await Post.find().sort({_id: -1}).limit(10).skip((page-1)*10).lean().exec(); 
        //const postCount = await Post.count().exec();
        const limitBodyLength = post => ({
            ...post, 
            title: post.title.length < 10? post.title : `${post.title.slice(0, 10)}...`,
            body: post.body.length < 200? post.body : `${post.body.slice(0, 200)}...`
        });
        ctx.body = posts.map(limitBodyLength);
        //ctx.set('Last-Page', Math.ceil(postCount/10));
        //ctx.body = posts;
    } catch(e) {
        ctx.throw(e, 500);
    }
};  
exports.read = async (ctx) => {
    const {id} = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500)
    }
};  
exports.remove = async(ctx) => {
    const {id} = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch(e) {
        ctx.throw(e, 500);
    }
};  
exports.update = async(ctx) => {
    const {id} = ctx.params;
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {new: true}).exec(); 
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

/* 
//mongoDB Connect 전에 데이터 처리 

let postId = 1;
const posts = [
    {id:1, title:'제목', body:'내용'}
]
exports.write = (ctx) => {
    const { title,  body  } = ctx.request.body;
    postId += 1;
    const post = { id: postId, title, body };
    posts.push(post);  ctx.body = post;
}

exports.list = (ctx) => {  ctx.body = posts; };

exports.read = (ctx) => {
    const { id } = ctx.params;
    const post = posts.find(p => p.id.toString() === id);
    if(!post) {
        ctx.status = 404;
        ctx.body = {message: '포스트가 존재하지 않습니다.'}
        return;
    }
    ctx.body = post;
}

exports.remove = (ctx) => {  const { id } = ctx.params;
    // 해당 id를 가진 post가 몇 번째인지 확인합니다.
    const index = posts.findIndex(p => p.id.toString() === id);
    if(index === -1) {
        ctx.status = 404;
        ctx.body = {message: '포스트가 존재하지 않습니다.'}
        return;
    }
    posts.splice(index, 1);
    ctx.status = 204;
}

exports.replace = (ctx) => {
        // 해당 id를 가진 post가 몇 번째인지 확인합니다.
        const index = posts.findIndex(p => p.id.toString() === id);
        if(index === -1) {
            ctx.status = 404;
            ctx.body = {message: '포스트가 존재하지 않습니다.'}
            return;
        }
        posts[index] = {  id,  ...ctx.request.body };  
        ctx.body = posts[index];
}

exports.update = (ctx) => {  
    // PATCH 메서드는 주어진 필드만 교체합니다. 
    const { id } = ctx.params;  // 해당 id를 가진 post가 몇 번째인지 확인합니다. 
    const index = posts.findIndex(p => p.id.toString() === id);  
    // 포스트가 없으면 오류를 반환합니다. 
    if(index === -1) {
        ctx.status = 404;
        ctx.body = {message: '포스트가 존재하지 않습니다.'}
        return;
    }

    posts[index] = {  ...posts[index],  ...ctx.request.body };  
    ctx.body = posts[index];
}


*/





