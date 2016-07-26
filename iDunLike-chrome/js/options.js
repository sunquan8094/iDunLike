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

function addRegex() {
	var r = document.getElementById("regex-no-likey").value;
	if (r !== "") {
		if (validateRegex(r)) {
			addToList(r);
			document.getElementById("regex-no-likey").value = "";
		}
		else {
			window.alert("Invalid regex!");
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
	var l = document.createElement("li"), rmv = document.createElement("button"), edt = document.createElement("button");
	rmv.innerHTML = "Remove";
	edt.innerHTML = "Edit";
	rmv.setAttribute("class","rmv-likey");
  edt.setAttribute("class","edt-likey");
	l.appendChild(document.createTextNode(str));
	l.appendChild(edt);
	l.appendChild(rmv);
	l.setAttribute("class", "regexp-likey");
	document.getElementById("list-likey").appendChild(l);
}

function addRegexLikey() {
	var r = document.getElementById("regex-likey").value;
	if (r !== "") {
		if (validateRegex(r)) {
			addToList(r);
			document.getElementById("regex-likey").value = "";
		}
		else {
			window.alert("Invalid regex!");
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
		chrome.storage.sync.set({ "iDunLikeREs": regexes, "iDunLikeREsLikey": regexes_likey}, function(items) {
			window.alert("Options saved!");
		});
	}
  else {
		window.alert("Same value in both lists detected!");
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
	chrome.storage.sync.get({"iDunLikeREs": [], "iDunLikeREsLikey": []} , function(items) {
		if (items["iDunLikeREs"].length !== 0) {
			items["iDunLikeREs"].sort();
			for (var i = 0; i < items["iDunLikeREs"].length; i++) {
				addToList(items["iDunLikeREs"][i]);
			}
		}
    if (items["iDunLikeREsLikey"].length !== 0) {
			items["iDunLikeREsLikey"].sort();
			for (var i = 0; i < items["iDunLikeREsLikey"].length; i++) {
				addToListLikey(items["iDunLikeREsLikey"][i]);
			}
		}
	});
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
document.getElementById("submit-likey").addEventListener('click', addRegexLikey);
document.getElementById("regex-likey").addEventListener('keypress', function(e) {
	if (e.keyCode == 13) {
		addRegexLikey();
	}
});

document.getElementById("save-changes").addEventListener('click', saveOptions);
