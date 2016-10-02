import Base from './Base'

class Search extends Base {
  index(req, res, next) {
  	let q = req.query.q
  	q = encodeURIComponent(q)
    res.redirect('https://www.google.com.hk/#hl=zh-CN&q=site:cnodejs.org+' + q);
  }
}

module.exports = Search
