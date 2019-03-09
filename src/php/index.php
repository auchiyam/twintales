<!DOCTYPE html>

<html>
    <?php
        // since it's impossible to access mysql remotely, just use the user/pass of mysql here
        // also ensure that this user can only read the tables
        $server = "localhost";
        $user = "reader";
        $pass = "password";

        // get the function and arguments
        $func = $_GET['func'];
        $args = $_GET['args'];

        // create connection to the 
        try {
            $conn = new PDO("mysql:host=$server;dbname=twintales", $user, $pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "connection success";
        }
        catch (PDOException $e) {
            echo "connection failed: \n" . $e->getMessage();
        }

        if ($func === 'get_assets') {
            echo "hey this is a test"
        }

        if ($func === 'get_ranking') {

        }
    ?>
</html>