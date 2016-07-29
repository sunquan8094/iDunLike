var selectors = ["div._4ikz", "div._3u1._gli._1c30", "div._4-u2.mbm._5v3q._4-u8", "div._401d", "div._4qjp", "li._5my2._3uz4"];

// Code for jQuery extension taken from https://blog.mastykarz.nl/jquery-regex-filter/
jQuery.extend(
    jQuery.expr[':'], {
        regex: function(a, i, m, r) {
            var r = new RegExp(m[3], 'i');
            return r.test(jQuery(a).text());
        }
		}
);

function elementsToTop(e, before) {
	e.insertBefore(before);
}

function magicalFilter(e) {
	var res = chrome.storage.local.get({"iDunLikeREs": [], "iDunLikeREsLikey": [], "iDunLikePri": false}, function (items) {
		var _regexes = items["iDunLikeREs"], _regexes_likey = items["iDunLikeREsLikey"];
		for (var b = 0; b < selectors.length; b++) {
			for (var r = 0; r < _regexes.length; r++) {
				if ($(document).find(selectors[b] + ":regex(\'" + _regexes[r] + "\')").length > 0) {
					$(document).find(selectors[b] + ":regex(\'" + _regexes[r] + "\')").fadeOut('fast');
				}
			}

			if (!items["iDunLikePri"]) {
	    	for (var r = 0; r < _regexes_likey.length; r++) {
					if ($(document).find(selectors[b] + ":regex(\'" + _regexes_likey[r] + "\')").length > 0) {
						elementsToTop($(document).find(selectors[b] + ":regex(\'" + _regexes_likey[r] + "\')"), $(selectors[b] + ':first'));
					}
				}
			}
			else {
				for (var r = _regexes_likey.length - 1; r >= 0; r--) {
					if ($(document).find(selectors[b] + ':regex(\'' + _regexes_likey[r] + '\')').length > 0) {
						elementsToTop($(document).find(selectors[b] + ':regex(\'' + _regexes_likey[r] + '\')'),
																					 r < _regexes_likey.length - 1 ? $(selectors[b] + ':regex(\'' + _regexes_likey[r + 1] + '\'):first') : $(selectors[b] + ':first'));
					}
				}
			}
		}
	});
}

var obs = new MutationObserver(magicalFilter);
obs.observe(document.body, {childList: true});
