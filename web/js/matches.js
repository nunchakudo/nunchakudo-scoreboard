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
     function handleCalculateEvents()
     {
         $('#calculate').click(function(e)
         {
            var parCategory      = $('#category').val();
            if(parCategory==="Choose...")
                parCategory=0;
            // console.log(parName + "cat:" + parCategory);
            $.getJSON( "http://"+window.location.host+":3000/participants?category="+parCategory,function( participants ) 
            {
                // for all participants with category parCategory
		console.log(participants);
                var match;
                // make list and mixe in pool make matches
                for(var i=0;i<participants.length-1;i++) // all participants except last
                {
                  for(var j=i+1;j<participants.length;j++) // all participants after participant i
                  {
                     match = {"nameYellow": participants[i]["name"],"nameBlack": participants[j]["name"],"category": parCategory,"result": "none","done": 0};
                     console.log(match);
                     console.log("i:"+i+" j:"+j);
                     // update server                     
                     $.ajax({ type: 'POST', url: "http://"+window.location.host+":3000/matches/", data: JSON.stringify(match), contentType: 'application/json' });
                  }
                }
            });
         });
     }

      // Get the state from the server
      function getUpdatedState(){
        $.getJSON( "http://"+window.location.host+":3000/event", function( event ) {
            $("#event-name").not('.no-update').html( event.name ); //only update if the no-update class is not present
	});
	// Display matches  
        var parCategory      = $('#showcategory').val();
        if(parCategory==="Choose...")
            parCategory=0;
        // get matches filtered on category
        $.getJSON( "http://"+window.location.host+":3000/matches?category="+parCategory, function( matches,status,xhr ) 
        {
	  $("#tbody").empty(); // clear previous data
          for(var i=0;i<matches.length;i++) // add matches
          {
                 var row="<tr>";
                 row+="<td>"+matches[i]["nameYellow"]+"</td>";
                 row+="<td>"+matches[i]["nameBlack"]+"</td>";
                 row+="<td>"+matches[i]["done"]+"</td>";
                 row+="<td>";
                 if(matches[i]["done"]==1)
                    row+=matches[i]["result"];
                 row+="</td></tr>";

                $("#tbody").append(row); 
         } 

        });
      }

      // Convert category integer to string
      function getCategory(number){
        switch(number){
          case 1:
            return "<1.35m";
            break;
          case 2:
            return "1.35m-1.45m";
            break;
          case 3:
            return "1.45m-1.65m";
            break;
          case 4:
            return ">1.65m";
            break;
          default:
            return "-";
        }
      }
      // Resize when the window is first loaded
      $(window).on('load', function () {
         autoresize();
         initialize();
         handleCalculateEvents();
      });

      // Resize when the window is resized
      $(window).resize( autoresize );
