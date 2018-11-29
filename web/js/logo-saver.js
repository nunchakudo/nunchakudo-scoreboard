
 function handleVoegtoeEvents()
 {
	 $('#voeg-toe').click(function(e)
	 {
		 
		// Upload afbeelding naar Minio
		var filename = $('#clubimage')[0].files[0].name;
		var file = $('#clubimage')[0].files[0];
		var url = 'http://' + window.location.host + ':9000/minio/upload/nuncha/' + filename;
		
		var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
                console.log(e.loaded / e.total);
            }
        });

        xhr.upload.addEventListener("load", function () {
            console.log("uploaded");
        });

        xhr.open("PUT", url);
        xhr.overrideMimeType(file.type);

        xhr.send(file);
        
        //Save naar json-server
        var team = { 'teamName': $("#name").val(), 'teamLogo': 'http://' + window.location.host + ':9000/nuncha/' + filename };
        $.ajax(
			{ type: 'POST', url: "http://"+window.location.host+":3000/teams/", data:JSON.stringify(team), contentType: 'application/json', success:
			function(thedata){
				getUpdatedState();
			}});
		
	 });
 }
 
 function getUpdatedState(){
        $.getJSON( "http://"+window.location.host+":3000/teams", function( teams,status,xhr ) {
	
         // Display participants
          
          //var tbl=$("<table/>").attr("id","mytable");
          //$("#div1").append(tbl);
          console.log(teams);
          $("#tbody").empty();
          for(var i=0;i<teams.length;i++)
          {
              var tr="<tr>";
              var td1="<td>"+teams[i]["teamName"]+"</td>";
              var td2='<td><img width=100 src="'+teams[i]['teamLogo'] + '"/></td></tr>';
              
              $("#tbody").append(tr+td1+td2); 

         } 

        });
      }

     
  // Resize when the window is first loaded
  $(window).on('load', function () {
	 getUpdatedState();
	 handleVoegtoeEvents(); 
  });


/*
// Make a bucket called europetrip.
minioClient.makeBucket('test', 'us-east-1', function(err) {
    if (err) return console.log(err)

    console.log('Bucket created successfully in "us-east-1".')

    var metaData = {
        'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        'example': 5678
    }
    // Using fPutObject API upload your file to the bucket europetrip.
    minioClient.fPutObject('nuncha', 'defaultIMG', file, metaData, function(err, etag) {
      if (err) return console.log(err)
      console.log('File uploaded successfully.')
    });
});
*/
