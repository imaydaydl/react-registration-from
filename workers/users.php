<?php

require_once 'classes/users.Class.php';

header('Access-Control-Allow-Origin: *');

$process = new Users($_POST);

echo $process->processData();

?>