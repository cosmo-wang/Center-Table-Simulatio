<?php


    $error = false;
    
    ## Code to check the GET parameters
    if (isset($_GET["mode"])) {
        if ($_GET["mode"] == "open" && isset($_GET["day"])) {
            header('Content-Type: text/plain');
            print("Test");
        } else {
            $error = true;     
        }
    } else {
        $error = true; 
    }
    
    # if we have an error we want to send an invalid request back. 
    if ($error) {
        header("HTTP/1.1 400 Invalid Request");
        header('Content-type: text/plain');
        echo "Error: Please provide a correct mode.";
    }


?>