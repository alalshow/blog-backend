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








