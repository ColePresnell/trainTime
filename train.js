// Initialize Firebase
var config = {
    apiKey: "AIzaSyA4KKcM11uhvtKfEonlC7_DkR-Z3a_wIFo",
    authDomain: "traintime-71bdb.firebaseapp.com",
    databaseURL: "https://traintime-71bdb.firebaseio.com",
    projectId: "traintime-71bdb",
    storageBucket: "",
    messagingSenderId: "547906382967"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var trainFrequency;
var userStartTime;

 //Button for adding trains
 $("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    userStartTime = $("#train-start-input").val().trim();


    //Record user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#train-destination-input").val().trim();
    var trainStartTime = moment(userStartTime,"HH:mm").format("X");
    trainFrequency = $("#train-frequency-input").val().trim();

    //Upload train data to database
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        start: trainStartTime,
        frequency: trainFrequency
    });

    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStartTime);
    console.log(trainFrequency);

    //Clear the intake form
    $("#train-name-input").val("");
    $("#train-destination-input").val("");
    $("#train-start-input").val("");
    $("#train-frequency-input").val("");

  });

  //Create a database event for adding trains
  database.ref().on("child_added", function(childSnapshot, prevChildKey){
    
    //Change start time from military time to AM/PM
    var startTimeAmPm = moment(childSnapshot.val().start,"X");

    //Difference between current time and train start time
    var timeDifference = moment().diff(moment(startTimeAmPm), "minutes");

    //Time remaining
    var timePassed =  timeDifference % childSnapshot.val().frequency;

    //Calculate Minutes Away
    var minutesAway = childSnapshot.val().frequency - timePassed;

    //Calculate Next Arrival
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

    //Add train's data to the timetable 
    $("#mainTable").append("<tr><td>" + (childSnapshot.val().name) + "</td><td>" + (childSnapshot.val().destination) + "</td><td>" + (childSnapshot.val().frequency) + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td><td>");
  });
