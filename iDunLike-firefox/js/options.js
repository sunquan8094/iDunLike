// Code modified from answer at http://stackoverflow.com/questions/17250815/how-to-check-if-the-input-string-is-a-valid-regular-expression
function validateRegex(str) {
	var r = true;
	try {
		new RegExp(str);
	}
	catch (e) {
		r = false;
	}
	return r;
}

function sortListLikey() {
 	var eh = $('#list-likey').children('li').get().sort(function(a, b) {
		return $(a).text().localeCompare($(b).text());
	});
	$('#list-likey').empty();
	$('#list-likey').append(eh);
}

function sortListNoLikey() {
 	var eh = $('#list').children('li').get().sort(function(a, b) {
		return $(a).text().localeCompare($(b).text());
	});
	$('#list').empty();
	$('#list').append(eh);
}

// Code for toggle functions taken from http://stackoverflow.com/questions/918792/use-jquery-to-change-an-html-tag
function priToNon() {
	$('#list-likey').replaceWith($('<ul id="list-likey">' + $('#list-likey').html() + '</ul>'));
}

function nonToPri() {
	$('#list-likey').replaceWith($('<ol id="list-likey">' + $('#list-likey').html() + '</ol>'));
}

function togglePriNon() {
	if ($('#prioritize').is(':checked')) {
		nonToPri();
	}
	else priToNon();
	$('.up-down').toggleClass('invisible');
}

// begin no-likey
function addToList(str) {
	var l = document.createElement("li"), rmv = document.createElement("button"), edt = document.createElement("button");
	rmv.innerHTML = "Remove";
	edt.innerHTML = "Edit";
	rmv.setAttribute("class","rmv-no-likey");
  edt.setAttribute("class","edt-no-likey");
	l.appendChild(document.createTextNode(str));
	l.appendChild(edt);
	l.appendChild(rmv);
	l.setAttribute("class", "regexp-no-likey");
	document.getElementById("list").appendChild(l);
}

function indexOfRegexExists(str) {
	var nodes = document.getElementsByClassName("regexp-no-likey");
	nodes = [].slice.call(nodes).map(function (v) {return v.innerText.substring(0, v.innerText.indexOf("EditRemove"))});
	console.log(nodes);
	if (nodes.length == 0) return false;
	return nodes.indexOf(str) > -1;
}

function addRegex() {
	var r = document.getElementById("regex-no-likey").value;
	if (r !== "") {
		if (validateRegex(r) && !indexOfRegexExists(r)) {
			addToList(r);
			document.getElementById("regex-no-likey").value = "";
		}
		else {
			window.alert("Can't use it!");
		}
	}
}

function editElement(e) {
	document.getElementById("regex-no-likey").value = e.target.parentNode.innerHTML.substring(0, e.target.parentNode.innerHTML.indexOf("<"));
	removeElement(e);
}
// end no-likey

// begin likey
function addToListLikey(str) {
	var l = document.createElement("li"),
			rmv = document.createElement("button"),
			edt = document.createElement("button"),
			l_up = document.createElement("button"),
			l_dn = document.createElement("button");
	rmv.innerHTML = "Remove";
	edt.innerHTML = "Edit";
	l_up.innerHTML = "&#x25B2;";
	l_dn.innerHTML = "&#x25BC;";
	rmv.setAttribute("class", "rmv-likey");
  edt.setAttribute("class", "edt-likey");
	l_up.setAttribute("class", "up up-down");
	l_dn.setAttribute("class", "down up-down");
	if (!$('#prioritize').is(":checked")) {
			l_up.setAttribute("class", l_up.getAttribute("class") + " invisible");
			l_dn.setAttribute("class", l_dn.getAttribute("class") + " invisible");
	}
	l.appendChild(document.createTextNode(str));
	l.appendChild(edt);
	l.appendChild(rmv);
	l.appendChild(l_up);
	l.appendChild(l_dn);
	l.setAttribute("class", "regexp-likey");
	document.getElementById("list-likey").appendChild(l);
}

function indexOfRegexExistsLikey(str) {
	var nodes = document.getElementsByClassName("regexp-likey");
	nodes = [].slice.call(nodes).map(function (v) {return v.innerText.substring(0, v.innerText.indexOf("EditRemove"))});
	if (nodes.length == 0) return false;
	return nodes.indexOf(str) > -1;
}

function addRegexLikey() {
	var r = document.getElementById("regex-likey").value;
	if (r !== "") {
		if (validateRegex(r) && !indexOfRegexExistsLikey(r)) {
			addToListLikey(r);
			document.getElementById("regex-likey").value = "";
		}
		else {
			window.alert("Can't use it!");
		}
	}
}

function editElementLikey(e) {
	document.getElementById("regex-likey").value = e.target.parentNode.innerHTML.substring(0, e.target.parentNode.innerHTML.indexOf("<"));
	removeElement(e);
}
// end likey

function removeElement(e) {
	e.target.parentNode.parentNode.removeChild(e.target.parentNode);
}

function saveOptions() {
	var regexps = document.getElementsByClassName("regexp-no-likey"), regexes = [];
	var regexps_likey = document.getElementsByClassName("regexp-likey"), regexes_likey = [];
	for (var p = 0; p < regexps.length; p++) {
		regexes.push(regexps[p].innerHTML.substring(0, regexps[p].innerHTML.indexOf("<")));
	}
	for (var p = 0; p < regexps_likey.length; p++) {
		regexes_likey.push(regexps_likey[p].innerHTML.substring(0, regexps_likey[p].innerHTML.indexOf("<")));
	}
	if (!commonValue(regexes, regexes_likey)) {
		chrome.storage.local.set({ "iDunLikeREs": regexes, "iDunLikeREsLikey": regexes_likey, "iDunLikePri": $('#prioritize').is(':checked')}, function(items) {
			window.alert("Options saved!");
		});
	}
  else {
		window.alert("Duplicate value detected in both lists detected!");
	}
}

function commonValue(arr1, arr2) {
	var a = arr1.slice(0), b = arr2.slice(0), r = false;
	a.sort(function(c,d) { return c.localeCompare(d); });
	b.sort(function(c,d) { return c.localeCompare(d); });
	while (a.length > 0 && b.length > 0) {
		if (a[0].localeCompare(b[0]) < 0) a.shift();
		else if (a[0].localeCompare(b[0]) > 0) b.shift();
		else { r = true; break; }
	}
	return r;
}

function getOptions() {
	chrome.storage.local.get({"iDunLikeREs": [], "iDunLikeREsLikey": [], "iDunLikePri": false} , function(items) {
		$('#prioritize').prop('checked', items["iDunLikePri"]);

		if (items["iDunLikeREs"].length !== 0) {
			for (var i = 0; i < items["iDunLikeREs"].length; i++) {
				addToList(items["iDunLikeREs"][i]);
			}
		}
    if (items["iDunLikeREsLikey"].length !== 0) {
			for (var i = 0; i < items["iDunLikeREsLikey"].length; i++) {
				addToListLikey(items["iDunLikeREsLikey"][i]);
			}
		}
		if (items["iDunLikePri"]) {
			nonToPri();
		}
	});
}

function swapLis(li1, li2) {
	li1.parentNode.insertBefore(li1, li2);
}

function upLis(e) {
	if (e.target.parentNode !== e.target.parentNode.parentNode.firstChild) {
		swapLis(e.target.parentNode, e.target.parentNode.previousSibling);
	}
}

function dnLis(e) {
	if (e.target.parentNode !== e.target.parentNode.parentNode.lastChild) {
		swapLis(e.target.parentNode.nextSibling,e.target.parentNode);
	}
}

function addButtonFunctions() {
	for (var d = 0; d < document.querySelectorAll('.edt-no-likey').length; d++)
		document.querySelectorAll('.edt-no-likey')[d].addEventListener('click', editElement);

  for (var d = 0; d < document.querySelectorAll('.rmv-no-likey').length; d++)
  	document.querySelectorAll('.rmv-no-likey')[d].addEventListener('click', removeElement);

  for (var d = 0; d < document.querySelectorAll('.edt-likey').length; d++)
		document.querySelectorAll('.edt-likey')[d].addEventListener('click', editElementLikey);

  for (var d = 0; d < document.querySelectorAll('.rmv-likey').length; d++)
  	document.querySelectorAll('.rmv-likey')[d].addEventListener('click', removeElement);

	for (var d = 0; d < document.querySelectorAll('.up').length; d++) {
		document.querySelectorAll('.up')[d].addEventListener('click', upLis);
	}

	for (var d = 0; d < document.querySelectorAll('.down').length; d++) {
		document.querySelectorAll('.down')[d].addEventListener('click', dnLis);
	}
}

document.addEventListener("DOMContentLoaded", function() {
	if(document.querySelectorAll('button') !== null) {
		addButtonFunctions();
	}
	getOptions();
});

document.addEventListener("DOMNodeInserted", addButtonFunctions);

document.getElementById("submit-no-likey").addEventListener('click', addRegex);
document.getElementById("regex-no-likey").addEventListener('keypress', function(e) {
	if (e.keyCode == 13) {
		addRegex();
	}
});
document.getElementById("clear-list-no-likey").addEventListener('click', function() {
	document.getElementById("list").innerHTML = "";
});
document.getElementById("clear-input-no-likey").addEventListener('click', function(e) {
	document.getElementById("regex-no-likey").value = "";
});

document.getElementById("submit-likey").addEventListener('click', addRegexLikey);
document.getElementById("regex-likey").addEventListener('keypress', function(e) {
	if (e.keyCode == 13) {
		addRegexLikey();
	}
});
document.getElementById("clear-list-likey").addEventListener('click', function() {
	document.getElementById("list-likey").innerHTML = "";
});
document.getElementById("clear-input-likey").addEventListener('click', function(e) {
	document.getElementById("regex-likey").value = "";
});

document.getElementById("save-changes").addEventListener('click', saveOptions);
document.getElementById("prioritize").addEventListener('click', togglePriNon);
document.getElementById("sort-no-likey").addEventListener('click', sortListNoLikey);
document.getElementById("sort-likey").addEventListener('click', sortListLikey);
