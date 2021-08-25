

admin = new Admin();
admin.getNewTrans();
/*admin.getUnderReviewTrans();
admin.getUnderProcessTrans();*/
var Inter = setInterval(function () { admin.IntervalTransQuery() }, 5000);

function Admin() {
    this.lastTransId = 0;
    this.TotalNewTrans = 0;
    this.ApiAddress = '/Api';
    this.reFresh = function () {
        notification.loading('جاري تحديث البيانات', 'الرجاء الانتظار');
        admin.getNewTrans();
        admin.getUnderReviewTrans();
        admin.getUnderProcessTrans();
        $(".messageBox").remove();
    };

    this.IntervalTransQuery = function () {
        $.ajax({
            url: admin.ApiAddress + '/Search?id=' + admin.lastTransId + '&state=W',
            method: 'get',
            success: function (res) {
                for (var i in res) {
                    if (res[i].length > 0) {
                        for (var j in res[i]) {

                        }
                        admin.lastTransId = res[i][j]["id"];
                        admin.TotalNewTrans = admin.TotalNewTrans + res[i].length;
                        $(".new-trans-li font").text("+"+admin.TotalNewTrans);
                    }
                }
            }
        });
    };
    this.getNewTrans = function () {
        $.ajax({
            url: admin.ApiAddress + '/Search?searchKey=state&searchValue=W',
            method: 'get',
            success: function (res) {
                for (var i in res) {
                    $(".rightBar").html("<h4>المنازعات الجديدة</h4><table class='table table-responsive table-bordered'><tr class='THR'><td>الرقم التعريفي</td><td>القيمة</td><td>الفرع</td></tr></table>");
                    if (res[i].length > 0) {
                        var c = 0;
                        for (var j in res[i]) {
                            c = c + 1;
                        }
                        admin.TotalNewTrans = res[i].length;
                        admin.lastTransId = res[i][j]["id"];
                        $(".new-trans-li font").text("+"+admin.TotalNewTrans);
                    }else{
                        $(".new-trans-li font").text("0");
                    }

                }
            }
        });
    };

    this.search = function () {
        notification.loading('جاري البحث', 'الرجاء الانتظار');
        $(".showWindow").remove();
        $.ajax({
            url: obj.ApiAddress + '/Search?searchKey=send_date&searchValue=' + $(".SearchRightBar input[name=TransDate]").val(),
            method: '',
            success: function (res) {
                for (var i in res) {
                    if (res[i].length > 0) {
                        $('.messageBox').remove();
                        $(".SearchRightBar .box-body").html("<div><h4> النتائج " + res[i].length + "</h4></div><table class='table table-responsive'><tr class='THR'><td>رقم الحركة</td><td>القيمة</td><td>الحالة</td></tr></table>");
                        for (var j in res[i]) {
                            $(".SearchRightBar .box-body table").append("<tr><td>" + res[i][j]["rrn"] + "</td><td>" + res[i][j]["PAY_AMT"] + "</td><td><span class='" + res[i][j]["state"] + "'>" + obj.transState[res[i][j]["state"]] + "</span></td></tr>");
                        }

                    } else {
                        notification.msg('success', 'تم البحث', 'لا توجد منازعات اليوم');
                        $(".SearchRightBar .box-body").html('');
                    }
                }
            }
        });
    };

    this.filter = function (TransState,title) {
        $(".workBox div").html("");
        notification.loading('جاري البحث', 'الرجاء الانتظار');
        $(".showWindow").remove();
        $.ajax({
            url: admin.ApiAddress + '/Search?searchKey=state&searchValue=' + TransState,
            method: 'get',
            success: function (res) {
                for (var i in res) {
                    if (res[i].length > 0) {
                        $(".messageBox").remove();
                        $(".workBox .workBox-header").html("<h4>"+title+" "+res[i].length+"</h4>");
                        $(".workBox .workBox-body").html("<ul></ul>");
                        for (var j in res[i]) {
                            //$(".workBox .workBox-body ul").append("<li onclick='admin.OpenTran(\"search\",\"" + res[i][j]["rrn"] + "\",\"" + res[i][j]["send_date"] + "\",\"" + res[i][j]["PAY_AMT"] + "\",\"" + res[i][j]["PAY_CURR"] + "\",\"" + res[i][j]["user_name"] + "\",\"" + res[i][j]["branch"] + "\")'><h4>" + res[i][j]["rrn"] + "</h4>" + res[i][j]["user_name"] + "<font>" + res[i][j]["send_date"] + "</font><span class='" + res[i][j]["state"] + "'>" + obj.transState[res[i][j]["state"]] + "</span></li>");
                            switch(accessLevel){
                                case 4:
                                    $(".workBox .workBox-body ul").append("<li><h4>" + res[i][j]["rrn"] + "</h4><span>" + res[i][j]["send_date"] + "</span><img src='/icons/see.png' onclick='admin.commentForm(\"" + res[i][j]["rrn"] + "\",\"" + res[i][j]["user_name"] + "\",\"" + res[i][j]["PAY_AMT"] + "\",\"" + res[i][j]["PAY_CURR"] + "\")'/></li>");
                                    break;
                                default:
                                    $(".workBox .workBox-body ul").append("<li><h4>" + res[i][j]["rrn"] + "</h4><span>" + res[i][j]["send_date"] + "</span><img src='/icons/see.png' onclick=''/></li>");
                                    break;
                            }
                        }
                    }
                    else {
                        notification.msg('faild', 'تم البحث', 'لا توجد نتائج');
                        //$(".filter .box-header h5").text("النتائج " + res[i].length)
                    }
                }
            }
        });
    };



    this.sendComment = function (rrn) {
        var tmp = document.getElementsByClassName("reply-field");
                
        $.ajax({
            url: admin.ApiAddress + '/Trans?id=0&R=' + rrn + '&S=' + tmp[0].value + '&C=' + tmp[1].value,
            method: 'get',
            success: function (res) {
                alert(res);
                /*
                if (res) {
                    notification.msg('success', 'تمت العملية', 'تم ارسال الرد الى الموظف');
                    $(".dispute-action-div").remove();
                } else {
                    notification.msg('faild', 'فشل العملية', 'لم يتم ارسال الرد');
                }
                */
            }
        });
    };
    this.showHistory = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        notification.loading('جاري البحث', 'جاري تحميل منازعات اليوم');
        $.ajax({
            url: obj.ApiAddress + '/Search?searchKey=send_date&searchValue=' + year + "-" + month + "-" + day,
            method: '',
            success: function (res) {
                for (var i in res) {
                    if (res[i].length > 0) {
                        $(".historyWindow").show();
                        $('.messageBox').remove();
                        $(".historyWindow").html("<div><h4> النتائج " + res[i].length + "</h4><img src='/icons/black-x-mark.png' onclick='$(\".historyWindow\").hide()' align='left'/></div><ul></ul>");
                        for (var j in res[i]) {
                            $(".historyWindow ul").append("<li onclick='admin.OpenTran(\"search\",\"" + res[i][j]["rrn"] + "\",\"" + res[i][j]["send_date"] + "\",\"" + res[i][j]["PAY_AMT"] + "\",\"" + res[i][j]["PAY_CURR"] + "\",\"" + res[i][j]["user_name"] + "\",\"" + res[i][j]["branch"] + "\")'>"+res[i][j]["rrn"] + "<span class='" + res[i][j]["state"] + "'>" + obj.transState[res[i][j]["state"]] + "</span></li>");
                        }

                    } else {
                        notification.msg('success', 'تم البحث', 'لا توجد منازعات اليوم');
                    }
                }
            }
        });
    };

    this.QuickSearchForm = function () {
        $(".workBox div").html("");
        $(".workBox .workBox-header").html("<font>الرقم التعريفي</font><input type='text' placeholder=''/><button onclick='admin.QuickSearch()'>search</button>");
    };

    this.DateSearchForm = function () {
        $(".workBox div").html("");
        $(".workBox .workBox-header").html('<font>تاريخ المنازعة</font><input type="date" name="TransDate" placeholder="search" /><img src="/icons/search.png" onclick="admin.DateSearchFormAction()" />');
    }

    this.DateSearchFormAction = function () {
        notification.loading('جاري البحث', 'الرجاء الانتظار');
        $(".showWindow").remove();
        $.ajax({
            url: obj.ApiAddress + '/Search?searchKey=send_date&searchValue='+$(".workBox .workBox-header input[name=TransDate]").val(),
            method: '',
            success: function (res) {
                for (var i in res) {
                    if (res[i].length > 0) {
                        $('.messageBox').remove();
                        $(".workBox .workBox-body").html("<ul></ul>");
                        for (var j in res[i]) {
                            switch(accessLevel){
                                case 4:
                                    $(".workBox .workBox-body ul").append("<li><h4>" + res[i][j]["rrn"] + "</h4><span>" + res[i][j]["send_date"] + "</span><img src='/icons/see.png' onclick='admin.test()'/></li>");
                                    break;
                                case 5:
                                    $(".workBox .workBox-body ul").append("<li><h4>" + res[i][j]["rrn"] + "</h4><span>" + res[i][j]["send_date"] + "</span><img src='/icons/see.png' onclick=''/></li>");
                                    break;
                                default:
                                    alert("less than 4");
                                    break;
                            }
                        }

                    } else {
                        notification.msg('success', 'تم البحث', 'لا توجد منازعات اليوم');
                        $(".SearchRightBar .box-body").html('');
                    }
                }
            }
        });
    };

    this.QuickSearch = function () {
        var rrn = $(".workBox .workBox-header input").val();
        notification.loading('جاري البحث', 'الرجاء الانتظار');
        $(".showWindow").remove();
        $.ajax({
            url: admin.ApiAddress + '/Search?searchKey=rrn&searchValue=' + rrn,
            method: 'get',
            success: function (res) {
                for (var i in res) {
                    if (res[i].length > 0) {
                        $(".messageBox").remove();
                        $(".workBox .workBox-body").html("<ul></ul>");
                        for (var j in res[i]) {
                            $(".workBox .workBox-body ul").append("<li>" + res[i][j]["rrn"] + "<span>" + res[i][j]["send_date"] + "</span><img src='/icons/see.png' onclick=''/></li>");
                        }

                    }
                    else {
                        notification.msg('faild', 'تم البحث', 'لا توجد نتائج');
                        $(".workBox .workBox-body").html("");
                    }
                }
            }
        });
    };

    this.commentForm = function (rrn, user, pay_amount) {
        $(".dispute-action-div").remove();
        var x = '<div class="dispute-action-div">\
                        <div class="dispute-action-div-body">\
                            <h4>'+ rrn + '</h4>\
                            <h4><font>'+ user + '</font><font>' + pay_amount + '</font></h4>\
                            <font>حالة المنازعة</font>\
                            <select class="reply-field">\
                                <option value="S">ناجحة</option>\
                                <option value="UP">تحت المعالجة</option>\
                                <option value="UR">تحت المعاينة</option>\
                                <option value="RD">ارسال الى</option>\
                            </select>\
                            <font>تعليق</font>\
                            <input type="text" placeholder="" class="reply-field"/>\
                            <button onclick="admin.sendComment('+ rrn + ')">تم</button><button onclick="$(\'.dispute-action-div\').remove();">الغاء</button>\
                        </div>\
                      </div>';
        $(".admin-main-row").append(x);
    };

    this.userForm = function () {
        $(".workBox div").html("");
        $(".workBox .workBox-header").html("<font>اسم حساب المستخدم</font><input type='text' placeholder='' id='useName' /><button onclick='admin.addUser()'>search</button>");
    };

    this.addUser = function () {
        alert($("#useName").val());
    };
}