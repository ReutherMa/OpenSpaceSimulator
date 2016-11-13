function loadData(url_var, universe){
    var data = {};
    
    $.ajax({
        url: url_var,
        async: false,
        dataType: 'json',
        success: function(output) {
            //console.log(data);
            universe.init (output);
        }
    });
    
/*     var arr = $.map(data, function(el) { 
        //console.log(el);
        return el; 
    }); */
    

}