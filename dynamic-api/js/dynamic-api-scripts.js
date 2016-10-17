//This is a comment in javascipt
/*This is a multiline
comment in javascript*/
function myFunction() { // Declares a function 'myFunction'
    var person = prompt("Please enter your name", "Colin");
    /*  Creates a variable called person which is equal to the response to
        the prompt function */
    if (person != null) {     /* Changes the text in the <p> tag to the string below
                                 if variable person is not a null value */
        document.getElementById("demo1").innerHTML =
                "Hello " + person + "! How are you today?";
    }
}

function getLocation() {
var location = prompt("Please enter your city and state", "Philadelphia, PA");
    if (location != null) {
        document.getElementById("demo3").innerHTML =
            "I hear that " + location + " is great this time of year!";
    }
}

function getCityAndState() {
var city = prompt("Please enter your city", "Philadelphia");
var state = prompt("Please enter your state", "PA");
    if ((city != null) && (state != null)) {
        document.getElementById("demo4").innerHTML =
            "I hear that " + city + ", " + state + " is great this time of year!";
    }
}

// A function 'wundergroundRadar is declared'
function wundergroundRadar() {
    // Assigns variable 'wc' with a string returned from a prompt
    var wc = prompt("Please enter a city", "Philadelphia");
    // Assigns variable 'ws' with a string returned from a prompt
    var ws = prompt("Please enter a state", "PA");
    // Assigns variable 'hyperlink' with a string "Click Here for Radar"
    var hyperlink = ("Click Here for Radar");
    // Assigns variable 'totalurl' by appending the variables and adding an anchor
    var totalurl = hyperlink.link("https://api.wunderground.com/api/4e770eb535baee60/animatedradar/q/"+ws+"/"+wc+".swf?width=500&height=500&newmaps=1&radius=400");
    // Checks if any variables have a null value
    if (wc != null && ws != null) {
    // Ignore the following lines if you don't want to make the hyperlink clickable
        document.getElementById("wundergroundExample").innerHTML =
        "Your API query URL: "+ totalurl;
    }
}

function weatherConditions() {
    var city = prompt("Please enter a city", "Philadelphia");
    var state = prompt("Please enter a state", "PA");
    var debug = "https://api.wunderground.com/api/4e770eb535baee60/conditions/q/" + state + "/" + city + ".json";

    jQuery(document).ready(function($) {
        $.ajax({ // Uses a URL based off user input to take a JSON response from the WunderGround API
            url : "https://api.wunderground.com/api/4e770eb535baee60/conditions/q/" + state + "/" + city + ".json",
            dataType : "jsonp",
            success : function(parsed_json) {
                console.log(debug);
                var tempF = parsed_json['current_observation']['temp_f'];
                var tempC = parsed_json['current_observation']['temp_c'];
                var weather = parsed_json ['current_observation']['weather'];
                var location = parsed_json['current_observation']['display_location']['full'];
                if ((city != null) && (state != null)) {
                    document.getElementById('wundergroundString').innerHTML =
                        'It is currently ' + tempF + '°F (' + tempC + '°C) and ' + weather + ' in ' + location + '. Wow!';
                }
            }
        });
    });
}

function getGitRepos() {
    // Take user information
    var getUser = prompt("Enter your GitHub username", "colingreybosh");
    var getRepo = prompt("Enter the name of your GitHub Repo", "projects");
    var debug = "https://api.github.com/repos/" + getUser + "/" + getRepo + "/contents";

    jQuery(document).ready(function($) {
        $.ajax({ // Uses a URL based off user input to take a JSON response from the WunderGround API
            // Append an API call link
            url : "https://api.github.com/repos/" + getUser + "/" + getRepo + "/contents",
            dataType : "jsonp",
            success : function(parsed_json) {
                // VV Debug stuff
                console.log(debug);
                var gitResponse = parsed_json;
                console.log(parsed_json);
                console.log(gitResponse.data[0]);
                // ^^ Debug stuff
                // Get length of JSON response
                var numItems = Object.keys(gitResponse.data).length;
                console.log("Number of items in directory: " + numItems);
                // Loops through JSON response, picking out subdirectories of the repository
                for (var i = numItems - 1; i >= 0; i--) {
                    if ((gitResponse.data[i].type == "dir") && (gitResponse.data[i].name != "webstorm-stuff")) {
                        // Logs the git_url if the object is a directory
                        console.log(gitResponse.data[i].git_url);
                        // TODO add second $.ajax call to execute for the repo api links
                        $.ajax({ // Uses a URL based off user input to take a JSON response from the WunderGround API
                            // Append an API call link
                            url : gitResponse.data[i].git_url,
                            dataType : "jsonp",
                            success : function(parsed_json) {
                                // TODO add an if statement and links
                            }
                        });
                    }
                };
            }
        });
    });
}
