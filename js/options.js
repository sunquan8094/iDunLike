function addToList(str) {
	var l = document.createElement("li"), rmv = document.createElement("button"), edt = document.createElement("button");
	rmv.innerHTML = "Remove";
	edt.innerHTML = "Edit";
	l.appendChild(document.createTextNode(str));
	l.appendChild(edt);
	l.appendChild(rmv);
	l.setAttribute("class", "regexp");
	document.getElementById("list").appendChild(l);
}

function addRegex() {
	if (document.getElementById("regex").value !== "") {
		addToList(document.getElementById("regex").value);
	}
	document.getElementById("regex").value = "";
}

function removeElement(e) {
	e.target.parentNode.parentNode.removeChild(e.target.parentNode);
}

function editElement(e) {
	document.getElementById("regex").value = e.target.parentNode.innerHTML.substring(0, e.target.parentNode.innerHTML.indexOf("<"));
	removeElement(e);
}

function saveOptions() {
	var regexps = document.getElementsByClassName("regexp"), regexes = [];
	for (var p = 0; p < regexps.length; p++) {
		regexes.push(regexps[p].innerHTML.substring(0, regexps[p].innerHTML.indexOf("<")));
	}
	chrome.storage.sync.set({ "iDunLikeREs": regexes }, function(items) {
		window.alert("Options saved!");
	});
}

function getOptions() {
	chrome.storage.sync.get("iDunLikeREs", function(items) {
		if (items["iDunLikeREs"].length !== 0) {
			items["iDunLikeREs"].sort();
			for (var i = 0; i < items["iDunLikeREs"].length; i++) {
				addToList(items["iDunLikeREs"][i]);
			}
		}
	});
}

function addButtonFunctions() {
	for (var d = 0; d < document.querySelectorAll('li').length; d++) {
		document.querySelectorAll('button')[d * 2].addEventListener('click', editElement);
		document.querySelectorAll('button')[d * 2 + 1].addEventListener('click', removeElement);
	}
}

document.addEventListener("DOMContentLoaded", function() {
	if(document.querySelectorAll('button') !== null) {
		addButtonFunctions();
	}
	getOptions();
});

document.addEventListener("DOMNodeInserted", addButtonFunctions);

document.getElementById("submit").addEventListener('click', addRegex);
document.getElementById("regex").addEventListener('keypress', function(e) {
	if (e.keyCode == 13) {
		addRegex();
	}
});
document.getElementById("save").addEventListener('click', saveOptions);
