//import data from '../../User.json';
// Check the credentails
function checkCredentails(username, password, callback) {   

        username = username.toLowerCase();
        username = username.trim();
        password = password.trim();

        console.log(username);
        console.log(password);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', '../../User.json', true); // Replace 'my_data' with the path to your file

        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
              //callback(xobj.responseText);
              var actual_JSON = JSON.parse(xobj.responseText);
              var count = Object.keys(actual_JSON).length;
              var reply = false;

              for (i= 0; i < count; i++)
              {
                  //alert('Check ' + i);
                  if (actual_JSON[i].id == username && actual_JSON[i].password == password)
                  {
                      reply = true;
                      break;
                  }
              }

              if (reply)
              {
                // console.log('Credentials found');
                 window.location.replace("screen2.html");
                //  return true;
              }
                  
              else
              {
                  window.location.reload(true);                      
              }                 
              return reply;
          }
    };
    xobj.send(null);  
}

