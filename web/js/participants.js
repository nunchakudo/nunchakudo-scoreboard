// Global variables
      
      //initialize the system
      function initialize(){
        // Once, get the name of the event
        $.getJSON( "http://"+window.location.host+":3000/event", function( event ) {
          $("#event-name").html( event.name );
        });

        // Every second, get the state from the server!
        setInterval(getUpdatedState, 1000);
      }
     function handleVoegtoeEvents(){
         $('#voeg-toe').click(function(e){
    
            var parName       = $('#name').val();
            var parCategory      = parseInt( $('#category').val() );
            var parGrade       = parseInt($('#grade').val());
            if(parCategory==="Choose...")
                parCategory=0;
            console.log("name:" + parName , "cat:" + parCategory, "grade:" + parGrade);
            //$.getJSON( "http://"+window.location.host+":3000/participants",function( participants ) {
                //var newPersonId = participants.length + 1;
                participant = {"name":parName,"category":parCategory,"grade":parGrade};
                // update server
                $.ajax({ type: 'POST', url: "http://"+window.location.host+":3000/participants/", data:JSON.stringify(participant), contentType: 'application/json' }, function(thedata){console.log(thedata);});
                //console.log(participants);
            //});
         
         });
     }

      // Get the state from the server
      function getUpdatedState(){
        $.getJSON( "http://"+window.location.host+":3000/event", function( event ) {
          $("#event-name").not('.no-update').html( event.name ); //only update if the no-update class is not present
	 });
        $.getJSON( "http://"+window.location.host+":3000/participants", function( participants,status,xhr ) {
	
         // Display participants
          
          //var tbl=$("<table/>").attr("id","mytable");
          //$("#div1").append(tbl);
          //console.log(participants);
          $("#tbody").empty();
          for(var i=0;i<participants.length;i++)
          {
              var tr="<tr>";
              var td1="<td>"+participants[i]["name"]+"</td>";
              var td2="<td>"+getCategory(participants[i]["category"])+"</td>";
			  var td3="<td>"+participants[i]["grade"]+"</td></tr>";
              
              $("#tbody").append(tr+td1+td2+td3); 

         } 

        });
      }

      // Resize when the window is first loaded
      $(window).on('load', function () {
         initialize();
         handleVoegtoeEvents();
         
      });
