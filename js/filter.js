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

document.addEventListener("DOMNodeInserted", function() {
	var res = chrome.storage.sync.get("iDunLikeREs", function (items) {
			var regexes = items["iDunLikeREs"];
			for (var r = 0; r < regexes.length; r++) {
		 		var e = $("div._401d:regex(\'" + regexes[r] + "\')");
				var e = $("div._4-u2:regex(\'" + regexes[r] + "\')");
				removeElements(e);
			}
	});
});
