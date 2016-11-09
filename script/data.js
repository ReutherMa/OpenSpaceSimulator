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
    //console.log(data);
    return data;
}