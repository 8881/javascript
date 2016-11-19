'use strict';

var Router = require('koa-router');
var query = require('./pool');
var sha1 = require('sha1');
var md5 = require('md5');

// 加固定盐
var salt = sha1('koa-restful-api');

var router = new Router({
    prefix: ''
});

/**
 * 返回数据包裹器
 * @param data
 * @returns {*}
 */
var wrapper = function (data) {
    var res;
    if (data.ok) {
        res = JSON.stringify({
            code: 200,
            msg: 'success',
            data: data.res
        });
    } else {
        res = JSON.stringify({
            code: 400,
            msg: data.res,
            data: null
        });
    }
    return res;
};

/**
 * 判断是否为字符串
 * @param str
 * @returns {boolean}
 */
var isString = function (str) {
    return {}.toString.call(str) === '[object String]';
};

/**
 * 判断是否为数组
 * @param arr
 * @returns {boolean}
 */
var isArray = function (arr) {
    return {}.toString.call(arr) === '[object Array]';
};

/**
 * 校验通行码
 * @param next
 * @returns {boolean}
 */
var checkPass = function*(next) {
    var passport = this.query.passport;

    if (!passport) {
        this.body = wrapper({
            ok: false,
            res: '请输入通行码'
        });
        return false;
    }

    var check = yield query('SELECT * FROM user WHERE password="' + md5(passport.trim() + salt) + '"');

    if (isString(check.res) || check.res.length === 0) {
        this.body = wrapper({
            ok: false,
            res: '通行码错误'
        });
        return false;
    }

    yield next;
};

// 获取标签
router.get('/tag', function*(next) {
    var sql = 'SELECT * FROM tag';
    this.cookies.set('auth', Date.now(), {
        httpOnly: true
    });
    var result = yield query(sql);

    this.body = wrapper(result);
});

// 新增标签
router.post('/tag/add',
    checkPass,
    function*(next) {
        var name = this.query.name;
        if (!name) {
            this.body = wrapper({
                ok: false,
                res: '标签名不能为空'
            });
            return false;
        }

        yield next;
    },
    function*(next) {
        var isExist = yield query('SELECT * FROM tag WHERE name="' + this.query.name + '"');

        if (isExist.res.length > 0) {
            this.body = wrapper({
                ok: false,
                res: '标签名已经存在'
            });
            return false;
        }

        yield next;
    },
    function*(next) {
        var insert = yield query('INSERT INTO tag (name) VALUES ("' + this.query.name + '")');
        if (insert.res.affectedRows === 1) {
            this.body = wrapper({
                ok: true,
                res: {
                    id: insert.res.insertId,
                    name: this.query.name
                }
            });
        } else {
            this.body = wrapper({
                ok: false,
                res: insert.res
            })
        }
    });

// 修改标签
router.post('/tag/modify',
    checkPass,
    function*(next) {
        var name = this.query.name;
        if (!name) {
            this.body = wrapper({
                ok: false,
                res: '标签名不能为空'
            });
            return false;
        }

        yield next;
    },
    function*(next) {
        var isExist = yield query('SELECT * FROM tag WHERE name="' + this.query.name + '"');

        if (isExist.res.length > 0) {
            this.body = wrapper({
                ok: false,
                res: '标签名已经存在'
            });
            return false;
        }

        yield next;
    },
    function*(next) {
        var update = yield query('UPDATE tag SET name="' + this.query.name + '" WHERE id=' + this.query.id);
        if (update.res.affectedRows === 1) {
            this.body = wrapper({
                ok: true,
                res: {
                    id: parseInt(this.query.id, 10),
                    name: this.query.name
                }
            });
        } else {
            this.body = wrapper({
                ok: false,
                res: update.res
            })
        }
    });

// 删除标签
router.post('/tag/del',
    checkPass,
    function*(next) {
        var id = this.query.id;
        if (!id) {
            this.body = wrapper({
                ok: false,
                res: '标签id不能为空'
            });
            return false;
        }
        yield next;
    },
    function*(next) {
        var del = yield query('DELETE t,ta FROM tag t LEFT JOIN tag_article ta ON t.id=ta.tid WHERE t.id=' + this.query.id);
        if (del.res.affectedRows) {
            this.body = wrapper({
                ok: true,
                res: '删除标签[' + this.query.id + ']成功'
            });
        } else {
            this.body = wrapper({
                ok: false,
                res: isString(del.res) ? del.res : '没有id等于' + this.query.id + '的标签'
            });
        }
    });

// 获取文章列表
// TODO 分页
router.get('/article',
    function *(next) {
        var pageIndex = parseInt(this.query.pageIndex, 10) || 0;
        var pageSize = parseInt(this.query.pageSize, 10) || 2;
        var limitStart = (pageIndex - 1) * pageSize;

        var sql = 'SELECT a.*,ta.tid AS tag_id,t.name AS tag_name FROM article a LEFT JOIN tag_article ta ON ta.aid=a.id LEFT JOIN tag t ON t.id=ta.tid ORDER BY a.update_time DESC';
        this.result = yield query(sql);

        if (isString(this.result.res)) {
            this.body = wrapper({
                ok: false,
                res: this.result.res
            });
            return false;
        }

        yield next;
    },
    function *(next) {
        var list = this.result.res.reduce(function (prev, next, index, array) {
            // 复制,防止污染原数组
            var _prev = JSON.parse(JSON.stringify(prev));

            if (index === 1) {
                _prev['tags'] = [{
                    id: _prev.tag_id,
                    name: _prev.tag_name
                }];
            }
            // 存储归并累加数组
            var temp = index === 1 ? [_prev] : _prev;
            var cur = temp[temp.length - 1];
            var nextTag = {
                id: next.tag_id,
                name: next.tag_name
            };

            if (cur.id === next.id) {
                console.log(cur['tags']);
                if (!isArray(cur['tags'])) {
                    cur['tags'] = [cur['tags']];
                }
                cur['tags'].push(nextTag);
            } else {
                next['tags'] = next.tag_id ? [nextTag] : [];
                temp.push(next);
            }
            return temp;
        });

        this.body = wrapper({
            ok: true,
            res: list
        });
    });

// 根据文章id获取文章
router.get('/article/:id',
    function *(next) {
        var id = this.params.id;
        var sql = 'SELECT a.*,ta.tid as tag_id,t.name as tag_name FROM article a LEFT JOIN tag_article ta ON ta.aid=a.id LEFT JOIN tag t ON t.id=ta.tid WHERE a.id=' + id;
        this.result = yield query(sql);

        if (isString(this.result.res)) {
            this.body = wrapper({
                ok: false,
                res: this.result.res
            });
            return false;
        }

        yield next;
    },
    function *(next) {
        var temp = {};
        this.result.res.forEach(function (item, index) {
            temp.tags = temp.tags || [];
            // 文章可能存在没有标签的情况
            if (item.tag_id && item.tag_name) {
                temp.tags.push({
                    id: item.tag_id,
                    name: item.tag_name
                });
            }

            if (index === 0) {
                delete item.tag_id;
                delete item.tag_name;
                temp = Object.assign({}, temp, item);
            }
        });

        this.body = wrapper({
            ok: true,
            res: temp
        });

        // 更新浏览次数,1小时更新一次
        var t = new Date(temp.last_time_view);
        if (Date.now() - t.getTime() > 3600000) {
            var view = yield query('UPDATE article SET view=view+1,last_time_view=SYSDATE() WHERE id=' + temp.id);
            if (view.res.affectedRows) {
                console.log('更新成功');
            } else {
                console.log('更新失败');
            }
        }
    });

// 新增文章                     
router.post('/article/add',
    checkPass,
    function*(next) {
        var title = this.title = this.query.title.trim();
        var digest = this.digest = this.query.digest.trim();
        var content = this.content = this.query.content.trim();
        if (!title || !digest || !content) {
            this.body = wrapper({
                ok: false,
                res: '请完善字段'
            });
            return false;
        }

        yield next;
    },
    function*(next) {
        var add = yield query('INSERT INTO article (title,digest,content,update_time) VALUES ("' + this.title + '","' + this.digest + '","' + this.content + '",SYSDATE())');
        if (add.res.affectedRows) {
            this.insertId = add.res.insertId;
            yield next;
        } else {
            this.body = wrapper({
                ok: false,
                res: isString(add.res) ? add.res : '添加文章失败'
            });
        }
    },
    function*(next) {
        var tag = this.query.tag.split(',');
        for (var i = 0, len = tag.length; i < len; i++) {
            var temp = yield query('INSERT INTO tag_article (aid,tid) VALUES ("' + this.insertId + '","' + tag[i] + '")');
            if (temp.res.affectedRows === 0) {
                this.body = wrapper({
                    ok: false,
                    res: isString(temp.res) ? temp.res : '添加文章[' + this.insertId + ']成功'
                });
                break;
            }
        }
        this.body = wrapper({
            ok: true,
            res: '添加文章[' + this.insertId + ']成功'
        });
    });

// 根据id修改文章
router.post('/article/modify',
    checkPass,
    function*(next) {
        this.id = parseInt(this.query.id, 10);
        this.title = this.query.title.trim();
        this.digest = this.query.digest.trim();
        this.content = this.query.content.trim();
        if (!this.title || !this.digest || !this.content) {
            this.body = wrapper({
                ok: false,
                res: '请完善字段'
            });
            return false;
        }

        yield next;
    },
    function*(next) {
        var add = yield query('UPDATE article SET title="' + this.title + '",digest="' + this.digest + '",content="' + this.content + '",update_time=SYSDATE() WHERE id=' + this.id);
        if (add.res.affectedRows) {
            yield next;
        } else {
            this.body = wrapper({
                ok: false,
                res: isString(add.res) ? add.res : '修改文章失败'
            });
        }

    },
    function*(next) {
        // 获取到新老标签数组
        var old = yield query('SELECT tid FROM tag_article WHERE aid=' + this.id);
        this.oldTags = [];

        if (old.res.length) {
            old.res.forEach(item => {
                this.oldTags.push(parseInt(item.tid, 10));
            });
            this.oldTags.sort();
        }

        this.newTags = this.query.tag.split(',').map(item => parseInt(item, 10)).sort();

        yield next;
    },
    function*(next) {
        // 新旧标签一样
        if (this.oldTags.join('') === this.newTags.join('')) {
            this.body = wrapper({
                ok: true,
                res: '修改文章[' + this.id + ']成功'
            });
            return false;
        }

        // 删除标签
        for (let i = 0, len = this.oldTags.length; i < len; i++) {
            if (this.newTags.indexOf(this.oldTags[i]) === -1) {
                const del = yield query('DELETE FROM tag_article WHERE aid=' + this.id + ' and tid=' + this.oldTags[i]);
                if (!del.res.affectedRows) {
                    this.body = {
                        ok: false,
                        res: '删除标签[' + this.oldTags[i] + ']时出错'
                    };
                    break;
                }
            }
        }

        // 增加标签
        for (let j = 0, l = this.newTags.length; j < l; j++) {
            if (this.oldTags.indexOf(this.newTags[j]) === -1) {
                const add = yield query('INSERT INTO tag_article (aid,tid) VALUES("' + this.id + '","' + this.newTags[j] + '")');
                if (!add.res.affectedRows) {
                    this.body = {
                        ok: false,
                        res: '新增标签[' + this.newTags[j] + ']时出错'
                    };
                    break;
                }
            }
        }

        yield next;
    },
    function*() {
        this.body = wrapper({
            ok: true,
            res: '修改文章[' + this.id + ']成功'
        });
    });

// 根据id删除文章,包括标签关联关系
router.post('/article/del',
    checkPass,
    function*(next) {
        var id = this.query.id;
        if (!id) {
            this.body = wrapper({
                ok: false,
                res: '请指定要删除文章的id'
            });
            return false;
        }
        yield next;
    },
    function*(next) {
        var del = yield query('DELETE a,ta FROM article a LEFT JOIN tag_article ta ON a.id=ta.aid WHERE a.id=' + this.query.id);
        if (del.res.affectedRows) {
            this.body = wrapper({
                ok: true,
                res: '删除文章[' + this.query.id + ']成功'
            });
        } else {
            this.body = wrapper({
                ok: false,
                res: isString(del.res) ? del.res : '没有id等于' + this.query.id + '的文章'
            });
        }
    });

// 根据标签id获取分类文章
router.get('/article/tag/:tid',
    function*(next) {
        var tid = this.params.tid;
        var sql = 'SELECT a.*,ta.tid as tag_id,t.name as tag_name FROM article a LEFT JOIN tag_article ta ON ta.aid=a.id LEFT JOIN tag t ON t.id=ta.tid WHERE t.id=' + tid + ' ORDER BY a.update_time DESC';
        this.result = yield query(sql);

        if (isString(this.result.res)) {
            this.body = wrapper({
                ok: false,
                res: this.result.res
            });
            return false;
        }

        yield next;
    },
    function*(next) {
        var result = this.result.res;
        // 查询出文章所有的标签
        for (var i = 0, len = result.length; i < len; i++) {
            var tags = yield query('SELECT ta.tid as id,t.name as name FROM tag_article ta LEFT JOIN article a ON ta.aid=a.id LEFT JOIN tag t ON t.id=ta.tid WHERE a.id=' + result[i].id);
            result[i]['tags'] = tags.res;
        }

        this.body = wrapper({
            ok: true,
            res: result
        });
    });

// 点赞
router.post('/article/good',
    function*(next) {
        var id = this.query.id;
        var good = yield query('UPDATE article SET good=good+1 WHERE id=' + id);
        if (good.res.affectedRows) {
            this.body = wrapper({
                ok: true,
                res: '点赞成功'
            });
        } else {
            this.body = wrapper({
                ok: false,
                res: isString(good.res) ? good.res : '点赞失败'
            });
        }
    });

// 鄙视
router.post('/article/bad',
    function*(next) {
        var id = this.query.id;
        var bad = yield query('UPDATE article SET bad=bad+1 WHERE id=' + id);
        if (bad.res.affectedRows) {
            this.body = wrapper({
                ok: true,
                res: '鄙视成功'
            });
        } else {
            this.body = wrapper({
                ok: false,
                res: isString(bad.res) ? bad.res : '鄙视失败'
            });
        }
    });

// 搜索
// TODO
router.get('/search',
    function*(next) {
        var keywords = this.query.keywords || '请输入关键字';
        this.body = wrapper({
            ok: true,
            res: keywords
        });
    });

module.exports = router;
