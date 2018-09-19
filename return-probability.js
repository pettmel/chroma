//Determine Tolerance
//Page Load
jQuery(function(){
    var qAnswers = Cookies.get('q1') + "-" + Cookies.get('q2') + "-"+ Cookies.get('q3');
    if(qAnswers.indexOf("A-A") == 0){
        Cookies.set("tolerance","LOW");
    }else{
        if(qAnswers.indexOf("B") >= 0){
            Cookies.set("tolerance","HIGH");
        }else{
            Cookies.set("tolerance","MODERATE");
        }
    }
    // Show/Hide selections based on tolerance
    switch(Cookies.get("tolerance")){
        case 'LOW':{
            var selRow = jQuery("#conservative-selection");
            jQuery("#calculated-selection").empty().append(selRow);
            selRow.click();
            jQuery("#aggressive-selection").hide();
            //Language
            jQuery('#q-risk-portfolio').text("CONSERVATIVE");
            jQuery('#q-risk-portfolio-return').text("5%");
            jQuery('#q-risk-portfolio-loss').text("10%");
        }break;
        case 'MODERATE':{
            var selRow = jQuery("#moderate-selection");
            jQuery("#calculated-selection").empty().append(selRow);
            selRow.click();
            //Language
            jQuery('#q-risk-portfolio').text("MODERATE");
            jQuery('#q-risk-portfolio-return').text("7%");
            jQuery('#q-risk-portfolio-loss').text("20%");
            jQuery('#contrast-placeholder').text("Conservative and Aggressive investment strategies are");             
        }break;
        case 'HIGH':{
            var selRow = jQuery("#aggressive-selection");
            jQuery("#calculated-selection").empty().append(selRow);
            selRow.click();
            jQuery("#conservative-selection").hide();
            //Language
            jQuery('#q-risk-portfolio').text("AGGRESIVE");
            jQuery('#q-risk-portfolio-return').text("9%");
            jQuery('#q-risk-portfolio-loss').text("30%");      
        }
        default:break;
    }
});
//Handle Row selection
jQuery('#conservative-selection, #moderate-selection, #aggressive-selection').on('click',function(){
    var row = jQuery(this);
    var chkbx = row.find('input.sel-strategy').first();
    if(chkbx.prop('checked') == true){
        row.removeClass('selected-strategy');
        chkbx.prop('checked',false);
    }
    else{
        chkbx.prop('checked',true);
        row.addClass('selected-strategy');
        
        var rowID = row.attr('id');
        switch(rowID){
            case 'conservative-selection' :{
                var otherRows = jQuery('#moderate-selection, #aggressive-selection');
                otherRows.removeClass('selected-strategy');
                otherRows.find('input.sel-strategy:checked').prop('checked',false);
            }break;
            case 'moderate-selection' :{
                var otherRows = jQuery('#conservative-selection, #aggressive-selection');
                otherRows.removeClass('selected-strategy');
                otherRows.find('input.sel-strategy:checked').prop('checked',false);
            }break;
            case 'aggressive-selection' :{
                var otherRows = jQuery('#conservative-selection, #moderate-selection');
                otherRows.removeClass('selected-strategy');
                otherRows.find('input.sel-strategy:checked').prop('checked',false);
            }break;                
            default:break;
            //find rows with checked options and uncheck them
        }        
    }

})