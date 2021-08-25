notification = new Notification();

function Notification() {
    this.msg = function (type, msgHedaer, msgSubHeader) {
        $(".messageBox").remove()
        switch (type) {
            case "success":
                var x = '<div class="messageBox"><div class="messageBox-header"><img src="/DisputeApp/icons/check.png" align="right"/><h3>' + msgHedaer + '</h3> <h4>' + msgSubHeader + '</h4></div></div>';
                break;
            case "faild":
                var x = '<div class="messageBox"><div class="messageBox-header"><img src="/DisputeApp/icons/x-mark.png" align="right"/><h3>' + msgHedaer + '</h3> <h4>' + msgSubHeader + '</h4></div></div>';
                break;
            default:                
                break;
        }
        $("body").prepend(x);
        setTimeout(() => { $(".messageBox").remove()},3000);
    };
    this.loading = function (msgHedaer, msgSubHeader) {
        var x = '<div class="messageBox"><div class="messageBox-header"><img src="/DisputeApp/icons/loading.png" align="right"/><h3>' + msgHedaer + '</h3> <h4>' + msgSubHeader + '</h4></div></div>';
        $("body").prepend(x);
    };
}