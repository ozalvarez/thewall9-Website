﻿function log(val) {
    if (console.re === undefined)
        console.log(val);
    else
        console.re.log(val);
}
var _fonts = ['Arapey', 'Roboto'];
var _totalItemsToLoad = $(".bg-img").length + document.images.length;
var _contItemsToLoad = 1;

var circle = new ProgressBar.Circle('#progress', {
    color: '#ee3454',
    duration: 500,
    easing: 'easeInOut'
});

function loaded() {
    //console.log("Loading: " + _contItemsToLoad + "/" + _totalItemsToLoad);
    $('#progress-number').html(_contItemsToLoad + "/" + _totalItemsToLoad)
    circle.animate(_contItemsToLoad / _totalItemsToLoad);
    if (_contItemsToLoad >= _totalItemsToLoad) {
        setTimeout(function () {
            $("#loader").fadeOut("slow");
        }, 500);
    }
    _contItemsToLoad++;
}
function loadImages() {
    for (var i = 0; i < document.images.length; i++) {
        var tImg = new Image();
        tImg.onload = loaded;
        tImg.onerror = loaded;
        tImg.src = document.images[i].src;
        if (document.images[i].src == '')
            loaded();
        //log("Loading IMG");
    }

    $('.bg-img').bgLoaded({
        afterLoaded: function () {
            this.addClass('bg-loaded');
            loaded();
            //log("Loading IMG BG");
        }
    });
}
$(function () {
    loadImages();
})
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(document).scrollTop() > 50) {
            $(".navbar-custom").removeClass("top");
        } else {
            $(".navbar-custom").addClass("top");
        }
    });
    if ($(document).scrollTop() > 50) {
        $(".navbar-custom").removeClass("top");
    }
    //BLOG IFRAME
    reframe('iframe');
    
    //CONTACT FROM WITH AGILECRM
    function validateForm() {
        if ($("#name").val() == "") {
            toastr.error($("#name").attr('placeholder') + " " + jsMessages.isEmpty);
        }
        else if ($("#last-name").val() == "") {
            toastr.error($("#last-name").attr('placeholder') + " " + jsMessages.isEmpty);
        }
        else if ($("#company").val() == "") {
            toastr.error($("#company").attr('placeholder') + " " + jsMessages.isEmpty);
        }
        else if ($("#phone").val() == "") {
            toastr.error($("#phone").attr('placeholder') + " " + jsMessages.isEmpty);
        }
        else if ($("#email").val() == "") {
            toastr.error($("#email").attr('placeholder') + " " + jsMessages.isEmpty);
        }
        else if (!validateEmail($("#email").val())) {
            toastr.error(jsMessages.emailNotValid);
        } else
            return true;
        // console.log("FORM IS NOT VALID");
        $("#submit").removeAttr('disabled');
        return false;
    }
    function success() {
        toastr.success(jsMessages.formSent);
        //ADD TASK
        var task = {};
        task.type = "FOLLOW_UP";
        task.priority_type = "HIGH";
        task.subject = "Follow Up Web Lead - " + $("#name").val() + " " + $("#last-name").val();
        task.due = new Date().getTime() / 1000;    // Epoch time
        _agile.add_task(task, {
            success: function (data) {
                // console.log("success");
            },
            error: function (data) {
                // console.log("error");
            }
        });
        //ADD TAG
        _agile.add_tag('Web', {
            success: function (data) {
                //console.log("success");
            },
            error: function (data) {
                // console.log("error");
            }
        });

        $("#submit").removeAttr('disabled');
        $("input[type=text], input[type=email], textarea").val("");
    }
    function error() {
        toastr.error(data.error + ", write us to info@theplayer9.com");
        $("#submit").removeAttr('disabled');
    }
    $("#submit").click(function () {
        $("#submit").attr('disabled', 'disabled');
        if (validateForm()) {
            toastr.info(jsMessages.sending);

            _agile.set_email($("#email").val());
            _agile.create_contact({
                "email": $("#email").val(),
                "first_name": $("#name").val(),
                "last_name": $("#last-name").val(),
                "company": $("#company").val(),
                "phone": $("#phone").val(),
                "Description": $("#form-info").val()
            }, {
                success: function (data) {
                    success();
                },
                error: function (data) {
                    var note = {};
                    note.subject = "WEB REQUEST";
                    note.description = "Phone: " + $("#phone").val() + "\nDescription: " + $("#form-info").val();
                    _agile.add_note(note, {
                        success: function (data) {
                            success();
                        },
                        error: function (data) {
                            error();
                        }
                    });
                }
            });
        }
    });
});