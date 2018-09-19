function loadUsrProfile(usr){
    $('#reg-sel-riskTolerance').val(Cookies.get('tolerance'));
    $('#reg-amt-Investment').val(usr.investment);
    $('#reg-amt-Investment').autoNumeric("init");
    $('#reg-txt-FName').val(usr.firstName);
    $('#reg-txt-LName').val(usr.lastName);
    $('#reg-txt-Mobile').val(usr.mobilePhone);
    $('#reg-txt-Email').val(usr.email);
    $('#reg-txt-RetypeEmail').val(usr.email);
}

jQuery(function(){
    $('#reg-amt-Investment').autoNumeric("init", {aSign:"$ ",aSuffix:" USD"});

    $("#reg-txt-BankLogin, #reg-txt-BankPasswd").on("keyup",function(){
        if($(this).val())
            $(".glyphicon-eye-open").show();
        else
            $(".glyphicon-eye-open").hide();
        });
    $(".glyphicon-eye-open").mousedown(function(){
            $("#reg-txt-BankLogin, #reg-txt-BankPasswd").attr('type','text');
        }).mouseup(function(){
            $("#reg-txt-BankLogin, #reg-txt-BankPasswd").attr('type','password');
        }).mouseout(function(){
            $("#reg-txt-BankLogin, #reg-txt-BankPasswd").attr('type','password');
    });            
    //Find User Profile Based on tolerance
    switch(Cookies.get('tolerance')){
        case "LOW":
        {
            dbChroma.ref('users/chromaLowRisk')
                    .once('value').then(function(snapshot){
                        var usr = snapshot.val();
                        loadUsrProfile(usr);
                        $('#reg-amt-Investment').autoNumeric('set',$('#reg-amt-Investment').val());
            });
            break;
        }
        case "MODERATE":
        {
            dbChroma.ref('users/chromaModRisk')
                    .once('value').then(function(snapshot){
                        var usr = snapshot.val();
                        loadUsrProfile(usr);
                        $('#reg-amt-Investment').autoNumeric('set',$('#reg-amt-Investment').val());
            });
            break;
        }
        case "HIGH":
        {
            dbChroma.ref('users/chromaHighRisk')
                    .once('value').then(function(snapshot){
                        var usr = snapshot.val();
                        loadUsrProfile(usr);
                        $('#reg-amt-Investment').autoNumeric('set',$('#reg-amt-Investment').val());
            });
            break;
        }
        default:break;
    }
})