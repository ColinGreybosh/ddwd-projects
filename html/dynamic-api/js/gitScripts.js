function getGitRepos() {
    // Makes a variable for the oauth token
    var oauthToken = '13ef1c4fa910124f11';
    var oauthToken2 = '2c96eb9daeae4bfeb364bf';
    var oauth = "?access_token=" + oauthToken + oauthToken2;
    // Makes two variables that contain empty strings
    var userName = '';
    var repoName = '';
    var folder = '';
    //var other = '';
    // Sets userName and repoName equal to the current value of the inputs
    userName = $('#user').val();
    repoName = $('#repo').val();
    folder = $('#folder').val();
    //other = $('#other').val();
    var mainChecked = isChecked('mainToggle');
    var folderChecked = isChecked('folderToggle');
    //var otherChecked = isChecked('otherToggle');
    // This if, else if, else statement checks if all required inputs are given
    if (mainChecked) {
        jQuery(document).ready(function($) {
            userName = $('#user').val();
            repoName = $('#repo').val();
            $.ajax({
                url : "https://api.github.com/repos/" + userName + "/" + repoName + "/contents" + oauth,
                dataType : 'jsonp',
                success : function(mainDir) {
                    document.getElementById('repoStructure').style.display = 'block';
                    mainDirLength = mainDir.data.length;
                    console.log('mainDirLength: ' + mainDirLength);
                    console.log(mainDir);
                    getUserInfo(userName, repoName, oauth);
                    var urlList = '';
                    for (var i = 0; i < mainDirLength; i++) {
                        console.log('mainDir Iteration: ' + i);
                        if (mainDir.data[i].type == 'dir') {
                            var baseUrl = 'https://' + userName + '.github.io' + '/' + repoName + '/' + mainDir.data[i].path + '/html/' + 'index.html';
                            currentDir = mainDir.data[i].path;
                            // Appends the urlList string with table data tags which include a hyperlink to the GitHub pages site
                            urlList += '<tr><td class="tableLeft">' + '<a href="' + baseUrl + '"" target="_blank">' + currentDir + '\/' + 'html\/index.html<\/a>' + '<\/td><td class="tableRight">' + currentDir + '<\/td></tr>';
                            // Outputs urlList to the HTML table
                            document.getElementById('output').innerHTML = urlList;
                        };
                    }
                    document.getElementById('hidden').style.display = 'flex';
                    document.getElementById('error').style.display = 'none';
                },
                error : function() {
                    printError('Ajax just threw an error! Please try again.');
                }
            });
        });
    } else if (folderChecked && !isEmpty(folder)) {
        userName = $('#user').val();
        repoName = $('#repo').val();
        folder = $('#folder').val();
        jQuery(document).ready(function($) {
            $.ajax({
                url : "https://api.github.com/repos/" + userName + "/" + repoName + "/contents" + oauth,
                dataType : 'jsonp',
                success : function(gitDir) {
                    console.log('gitDir:');
                    console.log(gitDir);
                    document.getElementById('repoStructure').innerHTML = 'Loading...';
                    // Take length of API response data
                    gitDirLength = (gitDir.data.length);
                    console.log('gitDirLength: ' + gitDirLength);
                    for (var i = 0; i < gitDirLength; i++) {
                        // IF the specific object is a directory with size 0 and a name of folder, call the API again
                        if (gitDir.data[i].type == 'dir' && gitDir.data[i].size == 0 && gitDir.data[i].name == folder) {
                            $.ajax({
                                url : gitDir.data[i]._links.git + oauth,
                                dataType : 'jsonp',
                                success : function(folderDir) {
                                    console.log('folderDir:');
                                    console.log(folderDir);
                                    // API call returns the file structure of the html folder in the repo
                                    var folderDirLength = Object.keys(folderDir.data.tree).length;
                                    var baseUrl = 'https://' + userName + '.github.io' + '/' + repoName + '/' + folder + '/';
                                    var urlList = '';
                                    // Loops through JSON code and takes the path of the folders within "user/repo/folder/"
                                    for (var j = 0; j < folderDirLength; j++) {
                                        // IF the item in the directory is a tree, log the name
                                        if (folderDir.data.tree[j].type == "tree") {
                                            currentDir = folderDir.data.tree[j].path;
                                            // Appends the urlList string with table data tags which include a hyperlink to the GitHub pages site
                                            urlList += '<tr><td class="tableLeft">' + '<a href="' + baseUrl + currentDir + '\/' + 'html' + '\/index.html" target="_blank">' + currentDir + '\/' + 'html\/index.html<\/a>' + '<\/td><td class="tableRight">' + currentDir + '<\/td></tr>';
                                            // Outputs urlList to the HTML table
                                            document.getElementById('output').innerHTML = urlList;
                                        }
                                    };
                                    getUserInfo(userName, repoName, oauth);
                                    // Unhides the table once the information is entered
                                    document.getElementById('hidden').style.display = 'flex';
                                    document.getElementById('error').style.display = 'none';
                                },
                                error : function() {
                                    printError('Something went wrong! Please try again.');
                                }
                            });
                        }
                        // Edit if else statement to remove error flickering before table is unhidden
                        else {
                            printError('Invalid repository information! Please try again.');
                        }
                    }
                },
                error : function() {
                    printError('Ajax just threw an error! Please try again.')
                }
            });
        });
    } /*else if (otherChecked && !isEmpty(other)) {
        userName = $('#user').val();
        repoName = $('#repo').val();
        other = $('#other').val();
        dirStr = other.split('/');
        dirStrLength = dirStr.length;
        jQuery(document).ready(function($) {
            $.ajax({
                url : "https://api.github.com/repos/" + userName + "/" + repoName + "/contents" + oauth,
                dataType : 'jsonp',
                success : function(otherDir) {
                    console.log('otherDir:');
                    console.log(otherDir);
                    // for (var i = 0; i < otherDir.length -1; i++) {
                    //     $.ajax({
                    //         url :
                    //     });
                    // }
                    getUserInfo(userName, repoName, oauth);
                },
                error : function() {
                    printError('Ajax just threw an error! Please try again.')
                }
            });
        });
    }*/ else if (!mainChecked && !folderChecked /*&& !otherChecked*/) {
        // If no radio buttons were checked, then output this error.
        printError("No structure option was chosen! Please try again.");
    } else if (folderChecked && isEmpty(folder)) {
        // If the folder radio button was checked but the text input is empty, output this error.
        printError("You checked the second option but did not input a folder name! Please try again.");
    } /*else if (otherChecked && isEmpty(other)) {
        // If the other radio button was checked but the text input is empty, output this error.
        printError("You checked the third option but did not input a folder name! Please try again.");
    }*/ else if (isEmpty(userName) || isEmpty(repoName)) {
        // If the username or repository name is blank, output this error.
        printError('You did not enter a username or repository name! Please try again.');
    } else {
        printError('Uh oh, something unexpected happened!');
    }
}

// jQuery function to call getGitRepos when an input box is active and enter is pressed
$('.input').bind('keyup', function(e) {
    if ( e.keyCode === 13 ) { // 13 is the keyCode for Enter
        getGitRepos();
    }
});

function printError(message) {
    document.getElementById('error').innerHTML = message;
    document.getElementById('error').style.display = 'block';
}

function isEmpty(cred) {
    return jQuery.trim(cred).length < 1;
}

function isChecked(radID) {
    return document.getElementById(radID).checked;
}

function getUserInfo(userName, repoName, oauth) {
    $.ajax ({
        url : "https://api.github.com/users/" + userName + oauth,
        dataType : 'jsonp',
        success : function(userInfo) {
            console.log('userInfo:');
            console.log(userInfo);
            displayName = userInfo.data.login;
            document.getElementById('repoStructure').innerHTML = '<a href="https://www.github.com/'+ displayName + '" target="_blank">' + displayName + '</a>' + ' / ' + '<a href="https://www.github.com/'+ displayName + '/' + repoName + '" target="_blank">' + '<span class="bold">' + repoName + '</span>' + '</a>' + ' / ';
            document.getElementById('repoStructure').style.display = 'block';
        },
        error : function() {
            printError('Something went wrong! Please try again.');
        }
    });
}
