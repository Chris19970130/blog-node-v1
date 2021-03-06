var express = require('express');
var Sequelize = require('sequelize')

//entity object
var Category = require('../entity/category');
var Course = require('../entity/Course');

var router = express.Router();

var Op = Sequelize.Op;


// connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//ajax get categories
router.get('/getCategoryList',function (req, res, next) {
    var categoryList = new Array();
    Category.findAll({
        where: {
            [Op.and]: [
                {
                    del_flag: 0,
                },
                {
                    level: {
                        [Op.lte]: 2,
                    }
                }
            ]
        },
        order:['sort']
    }).then(function (categories) {
        // console.log('query.' + JSON.stringify(categories));
        for (let i=0;i<categories.length;i++){
            if (categories[i].parent_id === 0){
                var item = {
                    name:'',
                    list:[]
                };
                console.log('this is par:'+categories[i].name);
                item.name = categories[i].name;
                for (let j=0;j<categories.length;j++){
                    if(categories[j].parent_id === categories[i].id ){
                        var subItem = {
                            name:'',
                            url:'',
                            id:''
                        };
                        subItem.name = categories[j].name;
                        subItem.url = categories[j].url;
                        subItem.id = categories[j].id
                        console.log(subItem);
                        item.list.push(subItem);
                    }
                }
                for (let i=0;i<item.list.length;i++)
                console.log('this is item:'+item.list[i].name)
                categoryList.push(item);
            }
        }
        console.log(categoryList.length);
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
        res.end(JSON.stringify(categoryList));
    }).catch(function (err) {
        console.log('failed: ' + err);
    });
    console.log(1);
    console.log(categoryList.length);
});

//ajax get courses
router.get('/getCourseList',function (req, res, next) {
    Course.findAll({
        attributes: ['title','description','img','url'],
        where: {
            del_flag: 0
        }
    }).then(function (courses) {
        console.log(JSON.stringify(courses));
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
        res.end(JSON.stringify(courses));
    }).catch(function (err) {
        console.log('failed: '+err)
    })

});

router.get('/getCategoriesByParentId',function (req, res, next) {
    console.log(1)
    console.log(JSON.stringify(req));
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
    res.end(JSON.stringify('hello'));
})

module.exports = router;
