<?php
// resource for creating API in php: https://www.codeofaninja.com/2017/02/create-simple-rest-api-in-php.html
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    // since it's impossible to access mysql remotely, just put the user/pass of mysql here
    // also ensure that this user can only read the tables for double safety
    $server = "localhost";
    $user = "reader";
    $pass = "password";

    // get the function and arguments
    $func = $_GET['func'];
    extract(json_decode($_GET['args'], true));

    // create connection to the mysql
    $conn = null;

    try {
        $conn = new PDO("mysql:host=$server;dbname=twintales", $user, $pass);
    }
    catch (PDOException $e) {
        die("connection failed: \n" . $e->getMessage());
    }

    // get all the assets for the given argument
    if ($func === 'get_assets') {
        // execute the mysql query if it's not all
        if ($f_type !== "all") {
            $sql = "select * from asset where asset.asset_type=\"". $a_type . "\" and asset.file_type=\"" . $f_type . "\"";
        }
        else {
            $sql = "select * from asset where asset.asset_type=\"". $a_type . "\"";
        }

        $statement = $conn->prepare($sql);

        $statement->execute();

        // create the array that will be used to make json with
        $json_value = array();
        $json_value['count'] = $statement->rowCount();
        $json_value['assets'] = array();

        // loop all the contents
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
            // extract info
            extract($row);

	        $asset = $location;

            $has_key = false;
            
	        foreach (array_keys($json_value['assets']) as $k) {
		        if ($k === $file_type) {
			        $has_key = true;
			        break;
		        }
	        }

            // if there's no array for the type, make one
            if (!$has_key) {
                $json_value['assets'][$file_type] = array();
            }

            $json_value['assets'][$file_type][$name] = $location;
        }

        // respond with success code and return the json value
        http_response_code(200);

        echo json_encode($json_value);
    }

    // get the ranking
    if ($func === 'get_ranking') {

    }
?>
