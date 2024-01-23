var productModal = $("#productModal");
    $(function () {

        //JSON data by API call
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
            '<td>'+ product.name +'</td>'+
            '<td>'+ product.uom_name +'</td>'+
            '<td>'+ product.price_per_unit +'</td>'+
            '<td>' +
                '<span class="btn btn-xs btn-danger delete-product">Delete</span>' +
                '<span class="btn btn-xs btn-info edit-product">Edit</span>' +
            '</td></tr>';
    });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    var isEditMode = false;

    $(document).on("click", ".edit-product", function (){
        var tr = $(this).closest('tr');
        $("#id").val(tr.data('id'));
        $("#name").val(tr.data('name'));
        $("#unit").val(tr.data('unit'));
        $("#price").val(tr.data('price'));
        productModal.find('.modal-title').text('Edit Product');
        productModal.modal('show');
        isEditMode = true;
    });

   // Inside the click event handler for the saveProduct button
$("#saveProduct").on("click", function () {
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_name: null,
        uom_id: null,
        price_per_unit: null
    };

    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.uom_id = element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;
        }
    }
    requestPayload.product_id = $("#id").val(); 
    console.log("Request Payload for Update:", requestPayload); // Add this line

    if (isEditMode) {
        // Update product detail if in edit mode
        callApi("POST", productUpdateApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
        isEditMode = false; // Reset the flag after updating
    } else {
        // Add new product if in add mode
        callApi("POST", productSaveApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    }

    // Clear the form or perform any other necessary actions
    $("#productForm")[0].reset();
});


    $(document).on("click", ".delete-product", function (){             //Delete Function
        var tr = $(this).closest('tr');
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });
    
    productModal.on('hide.bs.modal', function(){     //Add product uom hide menu
        $("#id").val('0');
        $("#name, #unit, #price").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

    productModal.on('show.bs.modal', function(){        //add product uom show menu
        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);
            }
        });
    });