


index = new Api();
transitionType = 0;
$("input[type=radio]").click(function(){
    transitionType = $(this).val();
});
// ApiAddress = '/TransManager/Api';
function Api() {
    this.ApiAddress = '/Api';
    this.addTrans = function () {
        //alert(transitionType)
        $("#branchCode").val($("#branchCode").val().trim());
        if ($("#branchCode").val().length > 0) {
            if (transitionType == 0) {
                notification.msg('faild', 'فشل ارسال المنازعة', 'الرجاء اختيار نوع المنازعة');
            } else {
                if (window.confirm("اضافة المنازعة؟")) {
                    notification.loading('جاري ارسال المنازعة', 'الرجاء الانتظار');
                    $.ajax({
                        url: index.ApiAddress + '/Trans?RRN=' + $("#rrn").val() + '&transType=' + transitionType + '&branchCode=' + $("#branchCode").val() + '&employee=' + userName,
                        method: 'get',
                        success: function (res) {
                            if (res[0] === "success") {
                                $("#rrn").val('');
                                notification.msg('success', 'تم ارسال المنازعة', res[1]);
                            }
                            else if (res[0] === "reversed") {
                                $("#rrn").val('');
                                notification.msg('success', 'تمت العملية', res[1]);
                            }
                            else {

                                notification.msg('faild', 'فشل ارسال المنازعة', res[1]);
                            }
                        }
                    });
                }
            }
        } else {
            notification.msg('faild', 'كود الفرع','ادخال كود الفرع');
        }
    };
}
/*
window.addEventListener("keydown", quickSearchKeyDown, false);
function quickSearchKeyDown(key) {
    switch(key.keyCode){
        case 13:
            obj.quickSearch($("#qucikSearchField").val())
            $("#qucikSearchField").val('');
            break;
        default:
            break;
    }
}
*/
