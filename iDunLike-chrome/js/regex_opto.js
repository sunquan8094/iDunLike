function eliminateDups(str) {
	var ret = str;
	var m = str.match(/(.)\1+/);
	if (m !== null) {
		for (var p = 0; p < m.length; p++) {
			ret = ret.replace(m[0], m[0].substring(0,1));
		}
	}
	return ret;
}

function compactStr(str1) {
	var arrP = str1.match(/\(.*\)/g);
	var strwop = str1.replace(/\(.*\)/g, "");
	var arrwop = strwop.split("");
	arrwop.sort();
	strwop = eliminateDups(arrwop.join(""));
	var ret = strwop;
	ret += arrP !== null ? arrP.join() : "";
	return ret;
}

function regex_opto_brackets(contents) {
	var not = contents.indexOf('^') === 0;
	var dashes = contents.match(/[^\[]\-[^\]]/g).slice(0);
	console.log(dashes);
	var dirtyStr = contents.replace(/^\^/, "").replace(/[\[\]]/g,"");
	dirtyStr = dirtyStr.split("");
	dirtyStr.sort();
	dirtyStr = dirtyStr.join("").replace(/\-/g, "");
	dirtyStr = compactStr(dirtyStr);
	console.log(dirtyStr);
	if (dashes !== null) {
		for (var d = 0; d < dashes.length; d++) {
			dirtyStr = dirtyStr.replace(new RegExp(dashes[d].substring(0, 1) + ".*" + dashes[d].substring(2,3)), dashes[d]);
		}
	}
	console.log(dirtyStr);
	var pureStr = dirtyStr;
	var ret = "";
	var jumps = new Array(pureStr.length - 1);
	for (var p = 1; p < pureStr.length; p++) {
		if (pureStr.charAt(p) == '-' || pureStr.charAt(p - 1) == '-')
			jumps[p - 1] = -1;
		else
			jumps[p - 1] = pureStr.charCodeAt(p) - pureStr.charCodeAt(p - 1);
	}
	var ranges = [], r = 0, r_i = null; r_j = null;
	for (var j = 0; j < jumps.length; j++) {
		if (Math.abs(jumps[j]) === 1) {
			if (r_i === null) r_i = j;
		}
		else if (jumps[j] > 1) {
			if (r_i !== null) {
				r_j = j;
				ranges[r] = {r_i: r_i, r_j: r_j};
				r++;
				r_i = null;
				r_j = null;
			}
		}
	}
	if (r_i !== null && r_j === null) {
		ranges[r] = {r_i: r_i, r_j: j};
	}

	var dr = 0;
	r = 0;
	if (ranges.length > 0) {
		for (var pl = 0; pl < pureStr.length; pl++) {
			if (ranges[r] === undefined) {
				ret += pureStr[pl];
			}
			else if (pl !== ranges[r].r_i) {
				ret += pureStr[pl];
			}
			else {
				ret += ranges[r].r_j - ranges[r].r_i > 1 ? pureStr[ranges[r].r_i] + "-" + pureStr[ranges[r].r_j] : pureStr[ranges[r].r_i] + pureStr[ranges[r].r_j];
				pl = ranges[r].r_j;
				r++;
			}
		}
	}
	else ret = pureStr;
	console.log(ret);
	ret = ret.replace(/[\[\]]/g,"");
	return not ? "^" + ret : ret;
}

function regex_opto_brackets_2(con1, con2) {
	if (!con1.startsWith("^") && !con2.startsWith("^")) {
		return regex_opto_brackets(con1+con2);
	}
	else if (con1.startsWith("^") && con2.startsWith("^")) {
		return "^" + regex_opto_brackets(con1.substring(1)+con2.substring(1));
	}
	else return regex_opto_brackets(con1 + con2);
}

// Adapted from https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Longest_common_substring#JavaScript
function lcs(str1, str2) {
	str1 = str1.replace(/[\[\]]/g, "");
	str2 = str2.replace(/[\[\]]/g, "");
	var seq = "", num = new Array(str1.length), max = 0, lastB = 0;
	for (var i = 0; i < str1.length; i++) {
		var sub = new Array(str2.length);
		for (var j = 0; j < str2.length; j++) {
			sub[j] = 0;
		}
		num[i] = sub;
	}
	var thisB = 0;
	for (var i = 0; i < str1.length; i++) {
		for (var j = 0; j < str2.length; j++) {
			if (str1.charCodeAt(i) !== str2.charCodeAt(j)) {
				num[i][j] = 0;
			}
			else {
				if (i == 0 || j == 0) {
					num[i][j] = 1;
				}
				else num[i][j] = 1 + num[i - 1][j - 1];

				if (num[i][j] > max) {
					max = num[i][j];
					thisB = i - num[i][j] + 1;
					if (lastB === thisB) {
						seq += str1[i];
					}
					else {
						lastB = thisB;
						seq = "";
						seq += str1.substr(lastB, (i+1) - lastB);
					}
				}
			}
		}
	}
	seq = seq.replace(/[\[\]\(\)\ ]/g, "");
	return (str1.match(new RegExp("\\(.*" + seq + ".*\\)")) !== null ||
				 str2.match(new RegExp("\\(.*" + seq + ".*\\)")) !== null) || seq.length == 1 ? "" : seq;
}

function magicalSplit(str, del) {
	var r = str.split(del, 1).slice(0);
	r.push(str.replace(str.substring(0, str.indexOf(del)) + del, ""));
	return r;
}

function parens(str1, str2) {
	if (str1 === str2) return "(" + str1 + ")";
	if (lcs(str1, str2) !== "") {
		var daLcs = lcs(str1,str2), ret = "";
		var arr1 = magicalSplit(str1, daLcs), arr2 = magicalSplit(str2, daLcs);
		arr1.map(function(v) { v = v.replace(/[\(\)]/g,""); });
		arr2.map(function(v) { v = v.replace(/[\(\)]/g,""); });


		if ((arr1[0] === undefined || arr1[0] === "") && arr2[0] !== "") {
			ret += "(" + arr2[0] + ")"
		}
		else if ((arr2[0] === undefined || arr2[0] === "") && arr1[0] !== "") {
			ret += "(" + arr1[0] + ")"
		}
		else if (arr1[0] !== "" && arr2[0] !== "") ret +=  "(" + arr1[0] + "|" + arr2[0] + ")";

		ret += daLcs;

		if ((arr1[1] === undefined || arr1[1] === "") && arr2[1] !== "") {
			ret += "(" + arr2[1] + ")"
		}
		else if ((arr2[1] === undefined || arr2[1] === "") && arr1[1] !== "") {
			ret += "(" + arr1[1] + ")"
		}
		else if (arr1[1] !== "" && arr2[1] !== "") ret +=  "(" + arr1[1] + "|" + arr2[1] + ")";
		return ret;
	}
	else return "(" + str1 + "|" + str2 + ")";
}

function regex_opto_2(str1, str2) {
	var ret;
	var dummy;
	var daLcs = lcs(str1, str2);
	if (str1.startsWith(daLcs) && str2.startsWith(daLcs)) {
		ret = daLcs + "[" + regex_opto_brackets_2(str1.replace(daLcs, ""), str2.replace(daLcs, "")) + "]";
	}
	else if (str1.endsWith(daLcs) && str2.endsWith(daLcs)) {
		ret = "[" + regex_opto_brackets_2(str1.replace(daLcs, "").replace(/[\[\]]/g, ""), str2.replace(daLcs, "").replace(/[\[\]]/g, "")) + "]" + daLcs;
	}
	else ret = parens(str1.replace(/^\(|\)$/g,""), str2.replace(/^\(|\)$/g,""));
	return ret;
}

function anyLcs(array) {
	var r = false, p = 0, q = 0, ret = "";
	for (p = 0; p < array.length; p++) {
		for (q = 0; q < array.length; q++) {
			if (p !== q && lcs(array[p], array[q]) !== "") {
				r = true;
				ret = lcs(array[p], array[q])
				break;
			}
		}
		if (q < array.length) {
			break;
		}
	}
	return {p: p, q: q, lcs: ret};
}

function regex_opto(array) {
  var ret = array.slice(0);
	while (anyLcs(ret).lcs !== "") {
		var mp = ret[anyLcs(ret).p];
		var mq = ret[anyLcs(ret).q];
		var ml = anyLcs(ret).lcs;

		ret.splice(ret.indexOf(mp), 1);
		ret.splice(ret.indexOf(mq), 1);
		ret.push(regex_opto_2(mp, mq));
	}
	return ret;
}
