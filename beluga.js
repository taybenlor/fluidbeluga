(function () {
    function h(a) {
        return (a = document.cookie.match("\\b" + a + "=([^;]*)\\b")) ? a[1] : undefined
    }
    function n(a) {
        a.autocomplete(p_friends, {
            minChars: 1,
            multiple: false,
            autoFill: true,
            selectFirst: false,
            scrollHeight: 0,
            formatItem: function (b, c, d) {
                return c + "/" + d + ': "' + b.name + '" [' + b.to + "]"
            },
            formatMatch: function (b) {
                if (b.name == b.to) return b.to;
                return b.name + " <" + b.to + ">"
            },
            formatResult: function (b) {
                if (b.name == b.to) return b.to;
                return b.name + " <" + b.to + ">"
            }
        })
    }
    function w() {
        var a = o;
        if (typeof p_mobile_ui == "undefined") p_mobile_ui = false;
        if (p_mobile_ui) {
            var b = "<div class='edit-email-input-row'><input class='addemail textinput' id='addemail" + a + "' name='addemail' type='text' /><div class='edit-remove-email'></div></div>";
            $(".edit-email-input-row:last").after(b)
        } else {
            b = $(".addemail:last").attr("class");
            b = '<tr style="display:none" class="emailrow" id="row' + a + '"><td class="c1"><img class="emailminus" index="' + a + '" src="/static/img/minusround.png"></td><td><input name="addemail" class="' + b + '" id="addemail' + a + '" type="text"></td></tr>';
            $(".emailrow:last").after(b);
            $("#row" + a).css("display", "table-row")
        }
        b = $("#addemail" + a);
        n(b);
        b.Watermark("Enter e-mail");
        o = a + 1
    }
    function p(a) {
        var b = document.createElement("div");
        a = document.createTextNode(a);
        b.appendChild(a);
        return b.innerHTML
    }
    function i(a, b) {
        b = typeof b != "undefined" ? b : "";
        if (a < 10) return "just now";
        if (a < 60) return a + " sec" + b;
        if (a < 120) return "1 min" + b;
        minutes = Math.floor(a / 60);
        if (a < 3600) return minutes + " min" + b;
        if (a < 10800) return Math.floor(a / 3600) + " hr " + minutes % 60 + " min" + b;
        if (a < 86400) return Math.floor(a / 3600) + " hr" + b;
        if (a < 172800) return "yesterday";
        var c = new Date((new Date).getTime() - a * 1E3),
            d = y[c.getMonth()] + " " + c.getDate();
        return a < 31536E3 ? d : d + " " + c.getFullYear()
    }
    function z(a) {
        var b = (new Date).getTime() / 1E3;
        return i(parseInt(b) - parseInt(a))
    }
    function q() {
        $.ajax({
            type: "GET",
            url: "/api/poll/newUpdates",
            dataType: "text",
            data: {
                podid: p_podid
            },
            async: true,
            timeout: 18E5,
            success: A,
            error: B
        });
        r++
    }
    function A(a) {
        r = 0;
        if (a) if (a = $.parseJSON(a).result) for (var b = a.length - 1; b >= 0; b--) {
            u = a[b];
            window.notifier && window.notifier.newMessage(u);
            j(u, "top")
        }
        setTimeout("waitForUpdates()", 1E3)
    }
    function B(a, b) {
        b == "timeout" && setTimeout("waitForUpdates()", 1E3)
    }
    function k(a) {
        if (a > p_uc - p_fetched) a = p_uc - p_fetched;
        var b = {
            podid: p_podid,
            start: p_uc - p_fetched - a,
            n: a
        };
        requested = a;
        $("#getmore").fadeOut();
        $.ajax({
            type: "GET",
            url: "/api/updates/getUpdates",
            dataType: "text",
            async: true,
            data: b,
            success: C,
            error: function () {
                $("#getmore").fadeIn()
            }
        });
        return false
    }
    function C(a) {
        a = $.parseJSON(a).result;
        var b = false;
        if (a) {
            var c = a.length;
            p_fetched += c;
            requested = 0;
            lastindex = a[c - 1].i;
            if (lastindex > 0) b = true;
            for (var d = 0; d < c; d++) j(a[d], "bottom")
        }
        if (b) if (l) p_fetched < 500 && k(20);
        else $("#getmore").fadeIn();
        else l = false
    }
    function j(a, b) {
        var c;
        a: {
            for (c = 0; c < p_updateids.length; c++) if (p_updateids[c] == a.ct) {
                c = true;
                break a
            }
            c = false
        }
        if (!c) {
            p_updateids.push(a.ct);
            c = $("#updates > #template").clone().attr("id", a.i);
            a.admin && c.addClass("uadmin");
            c.attr("href", "/details/" + p_podid + "/" + a.i);
            c.find(".uname").text(p(a.name));
            ct = parseInt(a.ct / 1E6);
            c.find(".utime").attr("ct", ct);
            c.find(".utime").text(z(ct));
            a.html ? c.find(".utext").html(a.html) : c.find(".utext").html(p(a.text));
            user = p_users["u" + a.uid];
            url = "";
            if (user && user.ihash) {
                url = "/userimg/100/" + a.uid + "/" + user.ihash;
                c.find(".upic img").attr("src", url)
            }
            if (a.img) c.find(".inline").attr("src", "/img/300/" + p_podid + "/" + a.ct);
            else {
                c.find(".uimg").remove();
                c.find(".inline").remove()
            }
            a.lat || c.find(".upin").remove();
            if (b == "top") {
                D();
                c.prependTo("#realupdates");
                p_animate ? c.slideDown("normal") : c.show()
            } else c.appendTo("#realupdates").show();
            $("#noupdates").fadeOut("slow")
        }
    }
    function E(a) {
        p_mypos = a;
        var b = '<img style="vertical-align:bottom" width=15 height=15 src="' + p_redpin + '">';
        $.ajax({
            type: "GET",
            url: "/api/util/reverseGeocode",
            dataType: "text",
            data: {
                lat: p_mypos.coords.latitude,
                lon: p_mypos.coords.longitude
            },
            success: function (c) {
                addr = $.parseJSON(c).result.address;
                addr = addr.replace(/ \d{5}.*/, "");
                $("#placemark").html(b + " Near " + addr)
            },
            error: function () {
                addr = "unknown location";
                $("#placemark").html(b + " Near " + addr)
            }
        })
    }
    function s() {
        $("#placemark").html("No location found");
        $("#geo").attr("checked", "")
    }
    function D() {
        window.reloadStalePage = function () {};
        $("#page_is_fresh").attr("src", "/static/stale.html")
    }
    var o = 1,
        l = false,
        r = 0,
        y = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    window.removeEmailEntry = function () {
        id = $(this).attr("index");
        $("#row" + id).slideUp().remove()
    };
    window.checkNeedNewEmail = function () {
        var a = false;
        $(".addemail").each(function () {
            var b = $.trim($(this).val());
            if (!b || b == "Enter e-mail") a = true
        });
        a || w()
    };
    window.setupAutoComplete = n;
    window.createPod = function () {
        $("div.error").fadeOut(200);
        $("tr.error").hide();
        $.Watermark.HideAll();
        var a = $.trim($("#what").val()),
            b = [];
        $(".addemail").each(function () {
            b[b.length] = $.trim($(this).val())
        });
        var c = b.join(","),
            d = [];
        a || (d[d.length] = "what");
        for (var e = 0; e < d.length; e++) {
            x = $("#" + d[e]).parent().parent().next();
            x.show();
            x.find("div.error").fadeIn(200)
        }
        $.Watermark.ShowAll();
        if (d.length > 0) return false;
        a = {
            what: a,
            emails: c,
            _xsrf: h("_xsrf")
        };
        $.ajax({
            type: "POST",
            url: "/api/pods/createPod",
            dataType: "text",
            data: a,
            success: function () {
                loc = window.location.href;
                window.location.href = loc.replace("create", "pods")
            },
            error: function () {
                $("#errormsg").slideDown()
            }
        });
        return false
    };
    window.savePod = function (a) {
        $("div.error").fadeOut(200);
        $("tr.error").hide();
        $.Watermark.HideAll();
        var b = $.trim($("#what").val()),
            c = [];
        $(".addemail").each(function () {
            c[c.length] = $.trim($(this).val())
        });
        var d = c.join(","),
            e = [];
        b || (e[e.length] = "what");
        for (var g = 0; g < e.length; g++) $("#" + e[g]).parent().parent().next().slideDown();
        for (g = 0; g < e.length; g++) {
            x = $("#" + e[g]).parent().parent().next();
            x.show();
            x.find("div.error").fadeIn(200)
        }
        $.Watermark.ShowAll();
        if (e.length > 0) return false;
        a = {
            podid: a,
            what: b,
            addemails: d,
            _xsrf: h("_xsrf")
        };
        $.ajax({
            type: "POST",
            url: "/api/pods/modifyPod",
            dataType: "text",
            data: a,
            success: function () {
                loc = window.location.href;
                window.location.href = loc.replace("edit", "pod")
            },
            error: function () {
                $("#errormsg").slideDown()
            }
        });
        return false
    };
    window.trySignup = function () {
        $("div.error").fadeOut(200);
        $("tr.error").hide();
        $.Watermark.HideAll();
        var a = $.trim($("#first").val()),
            b = $.trim($("#last").val()),
            c = $.trim($("#email").val()).toLowerCase(),
            d = $.trim($("#phone").val()),
            e = $("#newpassword").val(),
            g = $("#podid").val(),
            F = $("#fbat").val(),
            f = [],
            t = c.indexOf("@"),
            G = c.lastIndexOf("."),
            v = d.replace(/[^\d \-\(\)\+]/g, ""),
            m = v.replace(/[^\d]/, "");
        a || (f[f.length] = "first");
        b || (f[f.length] = "last");
        if (!c || t < 0 || G < t) f[f.length] = "email";
        if (d && (v.length != d.length || m.length < 10 || m.length > 12)) f[f.length] = "phone";
        if (e.length < 6) f[f.length] = "newpassword";
        for (d = 0; d < f.length; d++) {
            x = $("#" + f[d]).parent().parent().next();
            x.show();
            x.find("div.error").fadeIn(200)
        }
        $.Watermark.ShowAll();
        if (f.length > 0) return false;
        $.ajax({
            type: "POST",
            url: "/api/users/createUser",
            dataType: "text",
            data: {
                first: a,
                last: b,
                email: c,
                podid: g,
                phone: m,
                password: e,
                fbat: F,
                autologin: 1,
                sendmail: 1
            },
            success: function () {
                loc = window.location.href;
                window.location.href = p_next
            },
            error: function () {
                $("#errormsg").slideDown()
            }
        });
        return false
    };
    window.hideMessage = function () {
        $("#message").slideUp()
    };
    window.waitForUpdates = q;
    window.createUpdate = function () {
        $.Watermark.HideAll();
        var a = $.trim($("#composetext").val());
        if (a == "") return false;
        a = {
            podid: p_podid,
            text: a,
            _xsrf: h("_xsrf")
        };
        if (p_mypos && $("#geomenu").val() != "") {
            a.lat = p_mypos.coords.latitude;
            a.lon = p_mypos.coords.longitude
        }
        $.ajax({
            type: "POST",
            url: "/api/updates/createUpdate",
            dataType: "text",
            data: a,
            success: function (b) {
                b = $.parseJSON(b).result;
                b.ago = 0;
                j(b, "top")
            },
            error: function () {}
        });
        $("#composetext").val("");
        $.Watermark.ShowAll();
        $("#geo").attr("checked", "");
        $("#placemark").html("");
        p_mypos = 0;
        q();
        if (p_mobile_ui) {
            $("#composetext").blur();
            $("#compose").addClass("collapsed")
        } else $("#composetext").focus();
        return false
    };
    window.updateTimes = function () {
        var a = (new Date).getTime() / 1E3;
        $(".utime").each(function () {
            var b = $(this),
                c = parseInt(a) - parseInt(b.attr("ct"));
            c = i(c);
            c != b.text() && b.text(c)
        });
        setTimeout("updateTimes()", 15E3)
    };
    window.loadMoreUpdates = k;
    window.loadAllUpdates = function () {
        l = true;
        return k(20)
    };
    window.onGeoCheckbox = function () {
        $("#placemark").html("");
        if ($(this).attr("checked")) if (p_mypos) geoSuccess(p_mypos);
        else {
            $("#placemark").html('<img style="vertical-align:bottom" src="' + p_ajaxloader + '"> Finding location');
            if (geo_position_js.init()) {
                options = {
                    accuracy: 1,
                    maximumAge: 3E5
                };
                geo_position_js.getCurrentPosition(E, s, options)
            } else s()
        }
    };
    window.timeAgo = i;
    window.reloadStalePage = function () {
        location.reload()
    }
})();
