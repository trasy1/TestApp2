// Reportlist data array for filling in info box
var reportListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
	
	//populateMap();
	
	 // Username link click
    $('#reportList table tbody').on('click', 'td a.linkshowreport', showReportInfo);
	
	 // Add User button click
    $('#btnAddReport').on('click', addReport);

});

// Functions =============================================================

//var marker =  new L.marker([53.38790, -6.25724]).addTo(map);

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/reportlist', function( data ) {
		
		// Stick our user data array into a userlist variable in the global object
		reportListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
			
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowreport" rel="' + this.Lon + '">' + this.Lon + '</a></td>';
            tableContent += '<td>' + this.Lat + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.Category + '">' + this.Category + '</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#reportList table tbody').html(tableContent);
    });
};

// Fill map with markers
/*function populateMap() {

	$.getJSON( '/users/reportlist', function( data ) {

		reportListData = data;

		$.each(data, function(){
			L.marker([this.Lat,this.Lon]).addTo(map);
		});

	});

};*/

// Show User Info
function showReportInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve longitude from link rel attribute
    var thisLon = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = reportListData.map(function(arrayItem) { return arrayItem.Lon; }).indexOf(thisLon);
 
	// Get our User Object
    var thisReportObject = reportListData[arrayPosition];

    //Populate Info Box
    $('#reportInfoLon').text(thisReportObject.Lon);
    $('#reportInfoLat').text(thisReportObject.Lat);
    $('#reportInfoCategory').text(thisReportObject.Category);
    $('#reportInfoPhoto').html(thisReportObject.Photo);

};

// Add Report
function addReport(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addReport input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newReport = {
            'Lon': $('#addReport fieldset input#inputLon').val(),
            'Lat': $('#addReport fieldset input#inputLat').val(),
            'Category': $('#addReport fieldset input#inputCategory').val(),
            'Photo': $('#addReport fieldset input#inputPhoto').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newReport,
            url: '/users/addreport',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addReport fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


