function start() {
	var re = document.getElementById('11')
	var re2 = document.getElementById('12')
	re.remove()
	re2.remove()
	document.getElementById('people').innerHTML = Object.keys(original_data).join(",  ")
	current_question = get_question(original_data)
	document.getElementById('question').innerHTML = current_question
}

function abs(a) {
	if (a < 0) {
		return -a
	} else {
		return a
	}
}

function load_data() {
	ret = {}
	names = document.getElementById('people').innerHTML.split(",  ")
	a = []
	Object.keys(original_data).forEach(c => {
		if (!(c in names)) {
			a.push(c)
		}
	})
	names.forEach(name => {
		ret[name] = original_data[name]
	})
	return ret
}

function separator(data, question) {
	s = 0
	y = 0
	n = 0

	 Object.keys(data).forEach(character => {
		if (question in data[character]) {
			s += 1
			if (data[character][question]) {
				y += 1
			} else {
				n += 1
			}
		}
	})
	add = 0
	Object.keys(data).every(name => {
		if ("האם הדמות שלך היא " + name + "?" == question) {
			add = 0.1
			return false
		} else {
			return true
		}
	})
	return abs(y - n) / s + add
}

function get_question(data) {
	if (Object.keys(data).length == 1) {
		return "האם הדמות שלך היא " + Object.keys(data)[0] + " ?"
	}
	questions = new Set()
	
	Object.keys(data).forEach(cha => {
		Object.keys(data[cha]).forEach(q => {
			enter = true
			used_questions.every(uq => {
				if (uq == q) {
					enter = false
					return false
				} else {
					return true
				}
			})
			if (enter) {
				questions.add(q)
			}
		})
	})
	best_question = "b"
	best_score = 1.1
	questions.forEach(q => {
		sep = separator(data, q)
		if (sep < best_score) {
			best_question = q
			best_score = sep
		}
	})
	return best_question
}

function decrease(data, question, answer) {
	to_pop = []
	Object.keys(data).forEach(cha => {
		Object.keys(data[cha]).every(q => {
			if (q == question) {
				if (data[cha][question] != answer) {
					to_pop.push(cha)
				}
				return false
			} else {
				return true
			}
		})
	})
	console.log(to_pop)
	to_pop.forEach(p => {
		delete data[p]
	})
	document.getElementById('people').innerHTML = Object.keys(data).join(",  ")
	return data
}


function yes() {
	data = load_data()
	Object.keys(data).forEach(name => {
		if ("האם הדמות שלך היא " + name + "?" == current_question) {
			console.log(name)
			return
		}
	})
	data = decrease(data, current_question, true)
	used_questions[current_question] = true

	current_question = get_question(data)
	console.log(current_question)
	if (current_question) {
		used_questions[current_question] = null
		document.getElementById('question').innerHTML = current_question
	} //else {	
	console.log("yes")
	}

function no() {
	data = load_data()
	data = decrease(data, current_question, false)
	used_questions[current_question] = false
	current_question = get_question(data)
	if (current_question) {
		used_questions[current_question] = null
		document.getElementById('question').innerHTML = current_question
	} //else {

	
	console.log("no")
	}

function dontKnow() {
	data = load_data()
	current_question = get_question(data)
	used_questions[current_question] = null
	document.getElementById('question').innerHTML = current_question
	console.log("don't know")
	}