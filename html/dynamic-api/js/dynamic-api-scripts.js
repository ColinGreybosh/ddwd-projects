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
                var tempF = parsed_json.current_observation.temp_f;
                var tempC = parsed_json.current_observation.temp_c;
                var weather = parsed_json.current_observation.weather;
                var loc = parsed_json.current_observation.display_location.full;
                if ((city != null) && (state != null)) {
                    document.getElementById('wundergroundString').innerHTML =
                        'It is currently ' + tempF + '°F (' + tempC + '°C) and ' + weather + ' in ' + loc + '. Wow!';
                    $.ajax({ // Uses a URL based off user input to take a JSON response from the WunderGround API
                        url : "https://api.wunderground.com/api/4e770eb535baee60/conditions/q/" + state + "/" + city + ".json",
                        dataType : "jsonp",
                        success : function(parsed_json) {
                            console.log(debug);
                            var tempF = parsed_json.current_observation.temp_f;
                            var tempC = parsed_json.current_observation.temp_c;
                            var weather = parsed_json.current_observation.weather;
                            var loc = parsed_json.current_observation.display_location.full;
                            if ((city != null) && (state != null)) {
                                document.getElementById('wundergroundString').innerHTML =
                                    'It is currently ' + tempF + '°F (' + tempC + '°C) and ' + weather + ' in ' + loc + '. Wow!';
                                $.ajax({
                                    url : "http://api.wunderground.com/api/4e770eb535baee60/forecast10day/q/" + state + "/" + city + ".json",
                                    dataType : "jsonp",
                                    success : function(parsed_json) {
                                        var forecast = parsed_json.forecast.simpleforecast.forecastday;
                                        var rows = '';
                                        for (var i = 0; i < (forecast.length / 2); i ++) {
                                            console.log(parsed_json.forecast.simpleforecast.forecastday[i] + ': ' + i);
                                            rows += '<tr><td>' + forecast[i].date.monthname + ' ' + forecast[i].date.day + '</td><td>' + forecast[i].conditions + '<td>' + forecast[i + (forecast.length / 2)].date.monthname + ' ' + forecast[i + (forecast.length / 2)].date.day + '</td><td>' + forecast[i + (forecast.length / 2)].conditions + '</td></tr>';
                                            document.getElementById('output').innerHTML = (rows);
                                        }
                                        document.getElementById('hidden').style.display = 'block';
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });
}

// function getGitRepos() {
//     // Take username, password, and repository name from input tags
//     username = document.getElementById('user').value;
//     password = document.getElementById('pass').value;
//     reponame = document.getElementById('reponame').value;
//     // Use jQuery and ajax to pull repository information from GitHub
//     jQuery(document).ready(function($) {
//         $.ajax({
//             // Appends the username and repository name to create an API call URL
//             url : "https://api.github.com/repos/" + username + "/" + reponame + "/git/trees/459946515bd7045ac4aac1f36d2fa2047fe338fe",
//             dataType : "jsonp",
//             // Adds a Basic Auth header to the API call
//             beforeSend: function(req) {
//                 req.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
//             },
//             success : function(parsed_json) {
//                 // Sets password equal to null for security purposes
//                 var password = null;
//                 var gitResponse = parsed_json;
//                 // Get length of JSON response
//                 var numItems = Object.keys(gitResponse.data.tree).length;
//                 console.log(numItems);
//                 // Creates an empty string to place URL information into
//                 var urlList = '';
//                 var baseUrl = 'https://' + username + '.github.io' + '/' + reponame + '/html/';
//                 // Loops through JSON response, picking out subdirectories of the repository
//                 for (var i = numItems - 1; i >= 0; i--) {
//                     if (gitResponse.data.tree[i].type == "tree") {
//                         currentDir = gitResponse.data.tree[i].path;
//                         // Appends the urlList string with table data tags which include a hyperlink to the GitHub pages site
//                         urlList += '<tr><td>' + '<a href="' + baseUrl + currentDir + '\/' + 'html\/index.html" target="_blank">' + currentDir + '<\/a>' + '<\/td><td>' + currentDir + '<\/td></tr>';
//                         // Outputs urlList to the HTML table
//                         document.getElementById('output').innerHTML = urlList;
//                         console.log(currentDir);
//                     }
//                 };
//                 // Unhides the table once the information is entered
//                 document.getElementById('hidden').style.display = 'block';
//             },
//             error : function() {
//                 var password = null;
//                 alert('Invalid information! Please try again.');
//             }
//         });
//     });
// }

function getGitRepos() {
    // Take username, password, and repository name from input tags
    username = document.getElementById('user').value;
    password = document.getElementById('pass').value;
    reponame = document.getElementById('reponame').value;
    // Use jQuery and ajax to pull repository information from GitHub
    jQuery(document).ready(function($) {
        $.ajax({
            // Appends the username and repository name to create an API call URL
            url : "https://api.github.com/repos/" + username + "/" + reponame + "/contents",
            dataType : "jsonp",
            // Adds a Basic Auth header to the API call
            beforeSend: function(req) {
                req.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
            },
            success : function(parsed_json) {
                var gitDir = parsed_json;
                console.log(gitDir);
                gitDirLength = (gitDir.data.length);
                console.log(gitDirLength);
                for (var i = gitDirLength; i >= 0; i--) {
                    if ((gitDir.data[i].type == dir) && (gitDir.data[i].size == 0)) {
                        $.ajax({
                            url : gitDir.data[i].git_url,
                            dataType : 'jsonp',
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
                            },
                            success : function(htmlDir) {
                                password = null;
                                var htmlDirLength = Object.keys(htmlDir.data.tree).length;
                                console.log('numItems = ' + htmlDirLength);
                                var baseUrl = 'https://' + username + '.github.io' + '/' + reponame + '/html/';
                                console.log('Base URL = ' + based);
                                var urlList = '';
                                // Loops through JSON response, picking out subdirectories of the repository
                                for (var j = htmlDirLength - 1; j >= 0; j--) {
                                    if (htmlDir.data.tree[j].type == "tree") {
                                        currentDir = htmlDir.data.tree[j].path;
                                        console.log('currentDir = ' + currentDir);
                                        // Appends the urlList string with table data tags which include a hyperlink to the GitHub pages site
                                        urlList += '<tr><td>' + '<a href="' + baseUrl + currentDir + '\/' + 'html\/index.html" target="_blank">' + currentDir + '<\/a>' + '<\/td><td>' + currentDir + '<\/td></tr>';
                                        // Outputs urlList to the HTML table
                                        document.getElementById('output').innerHTML = urlList;
                                    }
                                };
                                // Unhides the table once the information is entered
                                document.getElementById('hidden').style.display = 'block';
                                console.log('Done!');
                            },
                            error : function() {
                                password = null;
                                alert('Something went wrong! Please try again.');
                            }
                        });
                    }
                }
                // // Sets password equal to null for security purposes
                // var password = null;
                // var gitResponse = parsed_json;
                // // Get length of JSON response
                // var numItems = Object.keys(gitResponse.data.tree).length;
                // // Creates an empty string to place URL information into
                // var urlList = '';
                // var baseUrl = 'https://' + username + '.github.io' + '/' + reponame + '/html/';
                // // Loops through JSON response, picking out subdirectories of the repository
                // for (var j = numItems - 1; j >= 0; j--) {
                //     if (gitResponse.data.tree[j].type == "tree") {
                //         currentDir = gitResponse.data.tree[j].path;
                //         // Appends the urlList string with table data tags which include a hyperlink to the GitHub pages site
                //         urlList += '<tr><td>' + '<a href="' + baseUrl + currentDir + '\/' + 'html\/index.html" target="_blank">' + currentDir + '<\/a>' + '<\/td><td>' + currentDir + '<\/td></tr>';
                //         // Outputs urlList to the HTML table
                //         document.getElementById('output').innerHTML = urlList;
                //     }
                // };
                // // Unhides the table once the information is entered
                // document.getElementById('hidden').style.display = 'block';
            },
            error : function() {
                password = null;
                alert('Invalid information! Please try again.');
            }
        });
    });
}
