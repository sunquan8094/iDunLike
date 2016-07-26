// Code for jQuery extension taken from https://blog.mastykarz.nl/jquery-regex-filter/
jQuery.extend(
    jQuery.expr[':'], {
        regex: function(a, i, m, r) {
            var r = new RegExp(m[3], 'i');
            return r.test(jQuery(a).text());
        }
    }
);

function removeElements(e) {
	e.fadeOut("fast");
}

function elementsToTop(e, before) {
	e.insertBefore(before);
}

var obs = new MutationObserver(function() {
	var res = chrome.storage.local.get({"iDunLikeREs": [], "iDunLikeREsLikey": []}, function (items) {
			var _regexes = items["iDunLikeREs"];
			for (var r = 0; r < _regexes.length; r++) {
		 		var e = $("div._4ikz:regex(\'" + _regexes[r] + "\')"); // Posts
				var h = $("div._3u1._gli._1c30:regex(\'" + _regexes[r] + "\')"); // Results Page Pages
				var u = $("div._4-u2.mbm:regex(\'" + _regexes[r] + "\')");
				var f = $("div._401d:regex(\'" + _regexes[r] + "\')");
				var n = $("div._4qjp:regex(\'" + _regexes[r] + "\')");
				var t = $("li._5my2:regex(\'" + _regexes[r] + "\')"); // Trending
				removeElements(e);
				removeElements(h);
				removeElements(u);
				removeElements(f);
				removeElements(n);
				removeElements(t);
			}

			var _regexes_likey = items["iDunLikeREsLikey"];
    	for (var r = 0; r < _regexes_likey.length; r++) {
				var e = $("div._4ikz:regex(\'" + _regexes_likey[r] + "\')"); // Posts
				var h = $("div._3u1._gli._1c30:regex(\'" + _regexes_likey[r] + "\')"); // Results Page Pages
				var u = $("div._4-u2.mbm:regex(\'" + _regexes_likey[r] + "\')"); // Feed Posts
				var f = $("div._401d:regex(\'" + _regexes_likey[r] + "\')");
				var n = $("div._4qjp:regex(\'" + _regexes_likey[r] + "\')");
				var t = $("li._5my2:regex(\'" + _regexes_likey[r] + "\')"); // Trending
			}
			elementsToTop(e, 'div._4ikz:first');
			elementsToTop(h, 'div._3u1._gli._1c30:first');
			elementsToTop(u, 'div._4-u2.mbm:first');
			elementsToTop(f, 'div._401d:first');
			elementsToTop(n, 'div._4qjp:first');
			elementsToTop(t, 'li._5my2:first');
	});
});

obs.observe(document.body, {childList: true});
