function loadData(url_var){
    var data = {};
    
    $.ajax({
        url: url_var,
        async: false,
        dataType: 'json',
        success: function(output) {
            data = output;
        }
    });
    
     var arr = $.map(data, function(el) { 
        //console.log(el);
        return el; 
    }); 
    
    //console.log(data);
    return data;
}