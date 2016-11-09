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
    
    /*var arr = $.map(data, function(el) { 
        //console.log(el);
        return el; 
    });*/
    
    
    var arr = [];
    for (var prop in data) {
        arr.push(data[prop]);
    }
    
    
    console.log(arr[0]);
    
    
    return data;
}