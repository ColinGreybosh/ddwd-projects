function getGitRepos() {
    // Makes a variable for the oauth token
    var oauthToken = 'be68ce6cf783cc99dcda0073a47422ec5179ff01';
    // Makes two variables that contain empty strings
    var userName = '';
    var repoName = '';
    var folder = '';
    var folders = '';
    // Sets userName and repoName equal to the current value of the inputs
    userName = $('#user').val();
    repoName = $('#repo').val();
    folder = $('#folder').val();
    folders = $('#folders').val();
    var mainChecked = document.getElementById('mainToggle').checked;
    var folderChecked = document.getElementById('folderToggle').checked;
    var otherChecked = document.getElementById('otherToggle').checked;
    console.log(mainChecked + ' ' + folderChecked + ' ' + otherChecked);
    console.log('isEmpty : ' + isEmpty(folder));
    if (mainChecked == false && folderChecked == false && otherChecked == false) {
        printError('error', "No structure option was chosen! Please try again.");
    }
    else if (folderChecked == true && jQuery.trim(folder).length < 1) {
        printError('error', "You checked the first option but did not input a folder name! Please try again.");
    }
    else if (otherChecked == true && jQuery.trim(folders).length < 1) {
        printError('error', "You checked the second option but did not input a folder name! Please try again.");
    }
        // Uses jQuery and ajax to pull repository information from GitHub
        jQuery(document).ready(function($) {
            $.ajax({
                // Appends the userName, repository name, and oauth token to create an API call URL
                url : "https://api.github.com/repos/" + userName + "/" + repoName + "/contents" + "?access_token=" + oauthToken,
                dataType : 'jsonp',
                success : function(gitDir) {
                    console.log('gitDir:');
                    console.log(gitDir);
                    // This entire if, else if, else statement filters out possible API returns that do not include the wanted data.
                    // If the requested data is in the response, the code runs normally
                    if (typeof gitDir.data[0] == 'object') {
                        document.getElementById('repoStructure').style.display = 'block';
                        // Take length of API response data
                        gitDirLength = (gitDir.data.length);
                        for (var i = 0; i < gitDirLength; i++) {
                            // IF the specific object is a directory with size 0 and a name of 'html', call the API again
                            if (gitDir.data[i].type == 'dir' && gitDir.data[i].size == 0 && gitDir.data[i].name == 'html') {
                                $.ajax({
                                    url : gitDir.data[i].git_url + "?access_token=" + oauthToken,
                                    dataType : 'jsonp',
                                    success : function(htmlDir) {
                                        console.log('htmlDir:');
                                        console.log(htmlDir);
                                        // API call returns the file structure of the html folder in the repo
                                        var htmlDirLength = Object.keys(htmlDir.data.tree).length;
                                        var baseUrl = 'https://' + userName + '.github.io' + '/' + repoName + '/html/' + "?access_token=" + oauthToken;
                                        var urlList = '';
                                        // Loops through JSON code and takes the path of the folders within "user/repo/html/"
                                        for (var j = 0; j < htmlDirLength; j++) {
                                            // IF the item in the directory is a tree, log the name
                                            if (htmlDir.data.tree[j].type == "tree") {
                                                currentDir = htmlDir.data.tree[j].path;
                                                // Appends the urlList string with table data tags which include a hyperlink to the GitHub pages site
                                                urlList += '<tr><td class="tableLeft">' + '<a href="' + baseUrl + currentDir + '\/' + 'html' + '\/index.html" target="_blank">' + currentDir + '\/' + 'html\/index.html<\/a>' + '<\/td><td class="tableRight">' + currentDir + '<\/td></tr>';
                                                // Outputs urlList to the HTML table
                                                document.getElementById('output').innerHTML = urlList;
                                            }
                                        };
                                        $.ajax ({
                                            url : "https://api.github.com/users/" + userName + "?access_token=" + oauthToken,
                                            dataType : 'jsonp',
                                            success : function(userInfo) {
                                                console.log('userInfo:');
                                                console.log(userInfo);
                                                displayName = userInfo.data.login;
                                                document.getElementById('repoStructure').innerHTML = '<a href="https://www.github.com/'+ displayName + '" target="_blank">' + displayName + '</a>' + ' / ' + '<a href="https://www.github.com/'+ displayName + '/' + repoName + '" target="_blank">' + repoName + '</a>' + ' / ' + '<span class="bold">' + 'html' + '</span> / ';
                                            },
                                            error : function() {
                                                alert('Something went wrong! Please try again.');
                                            }
                                        });
                                        // Unhides the table once the information is entered
                                        document.getElementById('hidden').style.display = 'block';
                                        document.getElementById('error').style.display = 'none';
                                    },
                                    // If ajax throws an error, an alert box will appear
                                    error : function() {
                                        alert('Something went wrong! Please try again.');
                                    }
                                });
                            }
                            // Edit if else statement to remove error flickering before table is unhidden
                            else {
                                document.getElementById('error').innerHTML = "Invalid repository information! Please try again.";
                                document.getElementById('error').style.display = 'block';
                            }
                        }
                    }
                    else if (jQuery.trim(userName).length < 1 || jQuery.trim(repoName).length < 1) {
                        document.getElementById('error').innerHTML = "You entered an incorrect username or repository name! Please try again.";
                        document.getElementById('error').style.display = 'block';
                    }
                    else if (jQuery.trim(folder).length < 1 || jQuery.trim(folders).length < 1) {
                        document.getElementById('error').innerHTML = "You entered an invalid folder name! Please try again.";
                        document.getElementById('error').style.display = 'block';
                    }
                    // If there is a message in the API response, it knows something went wrong.
                    else if (typeof gitDir.data.message == 'string') {
                        // If the message is "Not Found," then the repo name was incorrect
                        if (gitDir.data.message == 'Not Found') {
                            document.getElementById('error').innerHTML = "Repository not found! Please try again.";
                            document.getElementById('error').style.display = 'block';
                        }
                        // If the message is "API rate limit exceeded," then an error is displayed
                        else if (gitDir.data.message.substr(0, 23) == 'API rate limit exceeded') {
                            document.getElementById('error').innerHTML = "API rate limit exceeded!";
                            document.getElementById('error').style.display = 'block';
                        }
                        // If some other message is sent, an ambiguous error is displayed
                        else {
                            document.getElementById('error').innerHTML = "Something went wrong! Please try again.";
                            document.getElementById('error').style.display = 'block';
                        }
                    }
                    // If an unaccounted-for response is given, an error is displayed
                    else {
                        document.getElementById('error').innerHTML = "Uh oh, Something unexpected happened!";
                        document.getElementById('error').style.display = 'block';
                    }
                },
                // If ajax throws an error, an alert box will appear
                error : function() {
                    password = null;
                    alert('Invalid information! Please try again.');
                }
            });
        });
    }
}


// jQuery function to call getGitRepos when an input box is active and enter is pressed
$('.input').bind('keyup', function(e) {
    if ( e.keyCode === 13 ) { // 13 is the keyCode for Enter
        getGitRepos();
    }
});

function printError(error, message) {
    document.getElementById(error).innerHTML = message;
}

function isEmpty(cred) {
    return jQuery.trim(cred).length < 1;
}

