<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    // since it's impossible to access mysql remotely, just put the user/pass of mysql here
    // also ensure that this user can only read the tables
    $server = "localhost";
    $user = "reader";
    $pass = "password";

    // get the function and arguments
    extract($_GET);

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
        // execute the mysql 
        $sql = "select * from asset where asset.asset_type=\"". $a_type . "\" and asset.file_type=\"" . $f_type . "\"";

        $statement = $conn->prepare($sql);

        $statement->execute();

        $count = $statement->rowCount();

        // found some in the table
        if ($count > 0) {
            $json_value = array();
            $json_value['count'] = $count;

            // loop all the contents
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                // extract everything
                extract($row);

                $asset = array(
                    "name" => $name,
                    "location" => $location
                );

                array_push($json_value, $asset);
            }

            http_response_code(200);

            echo json_encode($json_value);
        }
    }

    // get the ranking
    if ($func === 'get_ranking') {

    }
?>