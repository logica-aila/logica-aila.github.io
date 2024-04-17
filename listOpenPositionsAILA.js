//Script by Matteo Acclavio to load on a webpage containing an element with id=noticeBoardOpenPositionsAILA
// the list of postition loaded in the repository https://github.com/logica-aila/aila-logica.github.io

console.log("Loading AILA Open Positions list")


//Setting today date
var day   =new Date().getDate()
var month =new Date().getMonth()+1
var year  =new Date().getFullYear()
console.log("today is:" + day +"/"+ month +"/"+ year);

// Parsing checking if the deadline is passed
function checkDeadline(deadline){
  var parts = deadline.split('/');
  if(year <= parts[0] && month <= parts[1] &&  day <= parts[2]){
    return true;
  }else{
    return false;
  }
}


// Access archive file and call listing method
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        listPosts(this);
    }
};
xmlhttp.open("GET", "https://logica-aila.github.io/OpenPositionsAILA.xml", true);
xmlhttp.send();


// Function listing postitions
function listPosts(xml) {
    var i;

    //Get informations to be posted
    var xmlDoc        = xml.responseXML;
    var post          = xmlDoc.getElementsByTagName("POST");
    var title         = xmlDoc.getElementsByTagName("title");
    var number         = xmlDoc.getElementsByTagName("number");
    var type          = xmlDoc.getElementsByTagName("type");
    var description   = xmlDoc.getElementsByTagName("description");
    var when          = xmlDoc.getElementsByTagName("when");
    var link          = xmlDoc.getElementsByTagName("link");
    var deadline      = xmlDoc.getElementsByTagName("deadline");

    //Get the element which will contain the posts
    var noticeBoard = document.getElementById("noticeBoardOpenPositionsAILA");
    console.log("preso noticeBoard");

    var areTherePhd=false;
    var areTherePost=false;
    var areThereProf=false;

    var phdList = document.createElement("ul");
    phdList.setAttribute("id", "phdList");
    var postList = document.createElement("ul");
    postList.setAttribute("id", "postList");
    var profList = document.createElement("ul");
    profList.setAttribute("id", "profList");


    //If not expired, create the element containing the post
    for (i = 0; i< post.length; i++) {
      if(checkDeadline(deadline[i].textContent)){
          var postElement = document.createElement("li");

          if(link[i].textContent){
            postElement.innerHTML =
              '<p> ('+ when[i].textContent +') <b>'+
              title[i].textContent  +
              '</b><br> '
              +
              description[i].textContent
              +
              "<br>Informazioni disponibili al seguente <a href='" +link[i].textContent + "' target='_blank'>link</a>"
              +
              '</p>'
            ;
          }else{
            postElement.innerHTML =
              '<p> ('+ date[i].textContent +') <b>'+ title[i].textContent +
              '</b><br> '
              +
              description[i].textContent
              +
              '</p>'
            ;
          }

          if(type[i].textContent=="phd"){
            phdList.appendChild(postElement);
            areTherePhd=true;
          }
          if(type[i].textContent=="post"){
            postList.appendChild(postElement);
            areTherePost=true;
          }
          if(type[i].textContent=="prof"){
            profList.appendChild(postElement);
            areThereProf=true;
          }
        }else{
          console.log("the announcement"+title[i].textContent+"is expired")
        }
    }

    //If positions of a specific type are available, then the corresponding list is appended
    if(areTherePhd){
      var phdH4 = document.createElement("h4");
      phdH4.innerHTML = "Dottorato";
      noticeBoard.appendChild(phdH4);
      noticeBoard.appendChild(phdList);
    }
    if(areTherePost){
      var postH4 = document.createElement("h4");
      postH4.innerHTML = "Postdoc";
      noticeBoard.appendChild(postH4);
      noticeBoard.appendChild(postList);
    }
    if(areThereProf){
      var profH4 = document.createElement("h4");
      profH4.innerHTML = "Permanenti";
      noticeBoard.appendChild(profH4);
      noticeBoard.appendChild(profList);
    }
}
