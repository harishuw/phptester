var norts = Array();
if(localStorage.getItem('code_mode')==null){
   localStorage.setItem('code_mode',"php");
}
if(localStorage.getItem('code_theme')==null){
   localStorage.setItem('code_theme',"chrome");
}
$('#code_mode').val(localStorage.getItem('code_mode'));
$('#code_theme').val(localStorage.getItem('code_theme'))
var loaded=Array();
var added_scripts=['jquery-2.0.3.min.js','bootstrap.min.js','ace.js','theme-chrome.js','mode-php.js','jquery-ace.min.js','tools.js'];
$(document).ready(function(b) {
    $("body").tooltip({
        selector: ".tooltip_div"
    });
    $("#type").blur(function(a) {
        show_result();
    });
    $("#phpinfo").click(function(a) {
        a.preventDefault();
        $.post("index.php", {
            code: "phpinfo()",
            lang: "p"
        }, function(d) {
            $("#result").html(d);
            $('#mytabs li:eq(1)>a').tab('show');
        })
    });
    $("#savefile").popover({
        html: true,
        content: '<input placeholder="Name" type="text" class="form-control" id="sname"/><br/><a id="save_pop_btn" data-loading-text="Saving.." class="btn btn-success btn-xs" onclick="save_file()"><i class="glyphicon glyphicon-floppy-disk"></i> Save</a>'
    });
    $("#delete_confirm").on("show.bs.modal", function() {
        var a = $.trim($("#selectcode").val());
        var d = $.trim($("#selectcode option:selected").attr("data-type"));
        $("#del_fname").html("<b>" + a + " (" + d + ")</b>?")
    });
    $(document.body).on("keydown", "#sname", function(d) {
        var a = [111, 106, 186, 220, 191, 222, 188];
        if (($.inArray(d.which, a) != -1) || (d.which == 56 && d.shiftKey) || (d.which == 190 && d.shiftKey)) {
            d.preventDefault()
        }
    });
    $("#selectcode").change(function() {
        var d = $.trim($(this).val());
        var a = $.trim($("#selectcode option:selected").attr("data-type"));
        if (d != "-1") {
            $.post("index.php?function=view", {
                fname: a + "/" + d
            }, function(c) {
                $("#type").val(c);
                $(".file_actions").show();
                if (a == "php") {
                    $('[name="lang"][value="p"]').prop("checked", true);
                    $("#type").blur()
                } else {
                    if (a = "html") {
                        $('[name="lang"][value="h"]').prop("checked", true);
                        $("#type").blur();
                    }
                }
                $("#download_file").attr("href", "index.php?function=download&file=" + a + "/" + d + "&type=" + a);
               re_code();
            });
        } else {
            $(".file_actions").hide();
            $("#updatefile").hide()
        }
    });
    $("#updatefile").click(function(e) {
        var a = $.trim($("#selectcode").val());
        var f = $.trim($("#selectcode option:selected").attr("data-type"));
        $("#updatefile").button("loading");
        $.post("index.php?function=update", {
            file: a,
            data: $("#type").val(),
            type: f
        }, function() {
            $("#updatefile").button("reset");
        });
    });
    $("#nort_prev").click(function() {
        var e = $.trim($("#nort_msg").val());
        var f = $('[name="nort_type"]:checked').val();
        if (e == "") {
            var a = create_element("p", {
                html: "Please enter message",
                "class": "text-danger"
            });
            $("#nort_msg").after(a);
            $("#nort_msg").focus();
            return false
        }
        $("#nort_msg").next(".text-danger").remove();
        notify(e, f)
    });
    $("#nort_me").click(function() {
        var f = $.trim($("#nort_msg").val());
        var g = $('[name="nort_type"]:checked').val();
        var a = $.trim($("#nort_time").val());
        if (f == "") {
            var h = create_element("p", {
                html: "Please enter message",
                "class": "text-danger"
            });
            if ($("#nort_msg").next(".text-danger").length == 0) {
                $("#nort_msg").after(h)
            }
            $("#nort_msg").focus();
            return false
        }
        $("#nort_msg").next(".text-danger").remove();
        if (a == "" || isNaN(a)) {
            var h = create_element("p", {
                html: "Please enter valid number",
                "class": "text-danger"
            });
            if ($("#nort_time").next(".text-danger").length == 0) {
                $("#nort_time").after(h)
            }
            $("#nort_time").focus();
            return false
        }
        $("#nort_time").next(".text-danger").remove();
        $("#nort_msg").val("");
        $("#nort_time").val("");
        $('[name="nort_type"][value="desk"]').prop("checked", true);
        notify(f, g, a);
        $("#notify_me").modal("hide");
    });
    $("#length_finder").keyup(function(a) {
        $("#length_result").text($(this).val().length);
    }).change(function() {
        $("#length_result").text($(this).val().length);
    })
    re_code();
    if($('#result').text().trim()!=""){
        $('#mytabs li:eq(1)>a').tab('show');
    }
    
});
function re_code(){
    var mode=localStorage.getItem('code_mode');
    var theme=localStorage.getItem('code_theme');
    insert_acejs(mode,'mode');
    insert_acejs(theme,'theme');
    if($.inArray(mode,loaded)>=0 && $.inArray(theme,loaded)>-0){
        make_ace(mode,theme);
    }else{
        setTimeout(function(){
            make_ace(mode,theme);
        },500);
    }
    
}
function make_ace(m,t){
    var editor = $('#type').data('ace');
    if(editor!=undefined){
        editor.destroy();
    }
    $('#type').ace({
        theme: t,
        lang: m
    });
}
function show_result(){
    $.post("index.php", {
        code: $("#type").val(),
        lang: $("input[type=radio]:checked").val()
    }, function(d) {
        $("#result").html(d);
    });
    }
function jstoarray() {
    $.post('index.php', {
        json: $('#type').val()
    }, function(data) {
        $('#result').html(data);
        $('#mytabs li:eq(1)>a').tab('show');
    });
}

function get_nortifify(f, d) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        alert(f, d)
    } else {
        if (Notification.permission === "granted") {
            var e = new Notification(f, {
                body: d
            });
            e.onclick = function() {
                window.focus();
                e.close()
            }
        } else {
            if (Notification.permission !== "denied") {
                Notification.requestPermission(function(b) {
                    if (b === "granted") {
                        var a = new Notification(f, {
                            body: d
                        });
                        a.onclick = function() {
                            window.focus();
                            a.close()
                        }
                    } else {
                        alert(f, d)
                    }
                })
            } else {
                alert(f, d)
            }
        }
    }
}

function save_file() {
    var d = $.trim($("#sname").val());
    if ($.trim($("#type").val()) == "") {
        $("#sname").tooltip({
            title: "Code seems to be empty!!"
        });
        $("#sname").tooltip("show");
        return false
    }
    if (d == "") {
        $("#sname").tooltip({
            title: "Please enter a name"
        });
        $("#sname").tooltip("show");
        return false
    }
    $("#save_pop_btn").button("loading");
    var c = $('[name="lang"]:checked').attr("data-type") != "" ? $('[name="lang"]:checked').attr("data-type") : "html";
    $.post("index.php?function=save", {
        file: d,
        data: $("#type").val(),
        type: c
    }, function(a) {
        if ($.trim(a) == "d") {
            $("#sname").tooltip({
                title: "Please enter a different name"
            });
            $("#sname").tooltip("show")
        } else {
            $("#selectcode").append("<option data-type='" + c + "' value='" + d + "'>" + d + "</option>");
            $("#sname").tooltip("destroy");
            $("#savefile").popover("hide");
            $('select').val(d).change();
        }
        $("#save_pop_btn").button("reset")
    })
}

function delete_file(d) {
    var e = $.trim($("#selectcode option:selected").attr("data-type"));
    var f = $.trim($("#selectcode").val());
    if (f == "-1") {
        return false
    }
    d.button("loading");
    $.post("index.php?function=delete", {
        file: e + "/" + f
    }, function(a) {
        $("#selectcode option").each(function() {
            if ($(this).attr("value") == f && $(this).attr("data-type") == e) {
                $(this).remove()
            }
        });
        d.button("reset");
        $("#delete_confirm").modal("hide")
    });
    $("#selectcode").val("-1").change()
}

function notify(k, f) {
    var g = 0;
    if (arguments.length == 3) {
        g = arguments[2]
    }
    var e;
    var i = new Date().valueOf();
    if ($.trim(f) == "alert") {
        e = setTimeout(function() {
            alert(k);
            $("#nort_" + i).remove()
        }, g * 1000 * 60)
    } else {
        e = setTimeout(function() {
            get_nortifify("Notification", k);
            $("#nort_" + i).remove()
        }, g * 1000 * 60)
    }
    norts.push(e);
    var d = $("#nort_all tr").length;
    d++;
    var j = '<span class="tooltip_div" title="' + k + '">' + k.substr(0, 20) + "</span>";
    var h = "<tr id='nort_" + i + "'><td>" + d + "</td><td>" + j + "</td><td class='rtime'></td><td><i class='glyphicon glyphicon-trash tooltip_div' title='Delete' onclick='del_nort(" + e + ");$(this).parent().parent().remove();'> </i></td></tr>";
    $("#nort_all").append(h);
    remain_time($("#nort_" + i + " .rtime"), 0, g, 0)
}

function create_element(e, f) {
    var d = document.createElement(e);
    if (typeof f == "object") {
        $.each(f, function(b, a) {
            if (b != "html") {
                $(d).attr(b, a)
            } else {
                $(d).html(a)
            }
        })
    }
    return d
}

function del_nort(a) {
    clearTimeout(a)
}

function remain_time(f, c, a, b) {
    var d = (c * 60 * 60) + (a * 60) + (b);
    var e = setInterval(function() {
        d--;
        c = Math.floor((d / 3600), 2);
        a = Math.floor(((d % 3600) / 60), 2);
        b = (d % 60);
        f.text(c + ":" + a + ":" + b);
        if (c == 0 && a == 0 && b == 0) {
            clearInterval(e);
            f.text("Stopped")
        }
    }, 1000)
};
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};
function insert_js(sc){
    if(sc!="" && sc!=null){
       var scr=document.createElement('script');
       scr.setAttribute('src',sc);
       document.body.appendChild(scr);
    }
}
function insert_acejs(sc,type){
    if(sc!="" && sc!=null && $('[data-script="'+sc+'"]').length==0){
       var scr=document.createElement('script');
       scr.setAttribute('src',"scripts/jquery-ace/ace/"+type+"-"+sc+".js");
       scr.setAttribute('data-script',sc);
       scr.setAttribute('onload','loaded.push($(this).attr("data-script"))');
       document.body.appendChild(scr);
    }
}
function set_theme(){
    var t=$.trim($('#code_theme').val());
    localStorage.setItem('code_theme',t);
    var m=$.trim($('#code_mode').val());
    localStorage.setItem('code_mode',m);
    re_code();
}