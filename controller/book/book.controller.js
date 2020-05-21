
const db = require('../../db')
const shortid = require('shortid')

module.exports.index = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const books = db.get("todo").value();
    const perPage = 8;
    const perPagination = 3;
    const start = (page - 1) * perPage;
    const end = page * perPage;

    if((books.length) % perPage !== 0){
        var totalPages = Math.floor((books.length) / perPage) + 1;
    }else{
        var totalPages = books.length / perPage
    }

    function spreadOut(x){
        var arr=[];
        for(let i = 1; i <= x; i++ ){
            arr.push(i)
        }
        return arr
    }

    function indexPagination(x,arr,index){
        let slicePagination = [];

        if(arr.length % x !== 0){
            var n = Math.floor((arr.length) / x) + 1;
        }else{
            var n = arr.length / x
        }

        for(let i = 1; i <= n; i++){
            var start = (i-1) * x;
            var end = (i-1) * x + x;
            slicePagination.push([start,end]) 
        }

        let itemSlicePagination = slicePagination.find(item => {
            return item[0] <= index && item[1] >= index
        })
        
        if(books.length === 0){
          return arr
        }

        return arr.slice(itemSlicePagination[0], itemSlicePagination[1])
    }

    const collectionPages = spreadOut(totalPages);

    const pagination = indexPagination(perPagination, collectionPages, page);

    db.get("todo")
        .forEach((item, index) => {
        item.stt = index + 1;
        })
        .write();
    res.render("book/index", {
        todos: books.slice(start, end),
        titleHeader: 'Sách hay của tôi',
        activeBook: 'text-primary',
        page,
        totalPages,
        collectionPages,
        pagination

    })
}

module.exports.delete = (req, res) => {
    let id = req.params.id;
    res.render("book/delete", {
        id
    });
};

module.exports.deleteOk = (req, res) => {
    var id = req.params.id;
    db.get("todo")
        .remove({ id: id })
        .write();
    db.get("transection")
        .remove({ bookId: id })
        .write();
    res.redirect("/book");
};

module.exports.post = (req, res) => {
    res.render("book/post", {});
};

module.exports.postCreate = (req, res) => {
    req.body.coverImage = req.file.path.split('/').slice(1).join('/');
    req.body.id = shortid.generate();
    req.body.stt = db.get("todo").value().length + 1;
    db.get("todo")
        .push(req.body)
        .write();
    res.redirect("/book");
}

module.exports.update = (req, res) => {
    let id = req.params.id;
    let isBook = db
        .get("todo")
        .find({ id: id })
        .value();
    res.render("book/update", {
        id,
        title: isBook.title,
        description: isBook.description
    });
}

module.exports.updateDone = (req, res) => {
    let id = req.params.id;
    let title = req.body.title;
    let description = req.body.description;
    db.get("todo")
        .find({ id: id })
        .assign({ title, description })
        .write();
    res.redirect("/book");
}