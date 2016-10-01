
class Base {
	constructor() {

	}

	success(res, result={}) {
	  result.success = true
	  let { message } = result
	  if (message) {
	  	console.log(message)
	  }

	  res.json(result) 
	}

	error(res, result) {
	  result.success = false
	  let { message } = result
	  if (message) {
	  	console.log(message)
	  }

	  res.json(result)       
	}
}

module.exports = Base