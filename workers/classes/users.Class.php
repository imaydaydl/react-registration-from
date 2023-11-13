<?php

class Users {
    private $post = [];
    private $file = '';
    private $userList = [];

    public function __construct($post) {
        $this->post = $post;
        $this->file = __DIR__ . '/../data/user_list.json';

        if (!is_dir($path = pathinfo($this->file, PATHINFO_DIRNAME))) {
            mkdir($path, 0777, true);
        }

        $this->userList = $this->checkFile();

        if($this->userList === false) {
            $this->userList = $this->createFile();
        }
    }

    public function processData() {
        $res = '';
        switch($this->post['action']) {
            case 'login':
                $res = $this->login();
                break;
            case 'register':
            default:
                $res = $this->register();
                break;
        }

        return $res;
    }

    private function login() {
        $result = [];
        if(empty($this->userList)) {
            $result = ['error' => 'No such email was found'];
            return json_encode($result);
        } else {
            $user_id = 0;
            $user_name = $user_second_name = $registered = '';

            $find = false;
            
            foreach($this->userList as $k => $uL) {
                $user_data = explode('|||', $uL);

                if($user_data[2] == $this->post['login_email']) {
                    $user_id = $k+1;
                    $user_name = $user_data[0];
                    $user_second_name = $user_data[1];
                    $registered = $user_data[4];
                    $find = true;
                    if($user_data[3] !== $this->post['login_password']) {
                        $result = ['error' => 'The password is incorrect'];
                        return json_encode($result);
                    }
                }
            }

            if($find) {
                $result = ['success' => 'User was found', 'user_id' => $user_id, 'user_name' => $user_name, 'user_second_name' => $user_second_name, 'registered' => $registered];
            } else {
                $result = ['error' => 'No such email was found'];
            }
        }

        return json_encode($result);
    }

    private function register() {
        $result = [];

        $valid = $this->validate();

        if($valid != '') {
            $result = ['error' => $valid];
            return json_encode($result);
        }

        if(!empty($this->userList)) {
            foreach($this->userList as $k => $uL) {
                $user_data = explode('|||', $uL);
                if($user_data[2] == $this->post['email']) {
                    $result = ['error' => 'This email is already registered'];
                    return json_encode($result);
                }
            }
        }

        $this->writeToFile();

        $result = ['success' => 'Successful registration'];

        return json_encode($result);
    }

    private function checkFile() {
        $userList = false;

        if (file_exists($this->file)) {
            $userList = file_get_contents($this->file);
        }

        return $userList ? json_decode($userList, true) : false;
    }

    private function createFile() {
        file_put_contents($this->file, []);

        return [];
    }

    private function writeToFile() {
        $this->userList[] = $this->post['name'] . '|||' . $this->post['sname'] . '|||' . $this->post['email'] . '|||' . $this->post['password'] . '|||' . date('d.m.Y H:i:s');

        file_put_contents($this->file, json_encode($this->userList));
    }

    private function validate() {
        $result = [];
        if($this->post['name'] == '') {
            $result[] = 'First Name field is empty';
        }

        if($this->post['sname'] == '') {
            $result[] = 'Second Name field is empty';
        }

        if (!filter_var($this->post['email'], FILTER_VALIDATE_EMAIL)) {
            $result[] = 'Email field has invalid value';
        }

        if(!empty($this->post['password']) && ($this->post['password'] == $this->post['repeat_password'])) {
            if (strlen($this->post["password"]) <= '8') {
                $result[] = "Your Password must contain at least 8 characters!";
            } elseif(!preg_match("#[0-9]+#", $this->post['password'])) {
                $result[] = "Your Password must contain at least 1 number!";
            } elseif(!preg_match("#[A-Z]+#", $this->post['password'])) {
                $result[] = "Your Password must contain at least 1 capital letter!";
            } elseif(!preg_match("#[a-z]+#", $this->post['password'])) {
                $result[] = "Your Password must contain at least 1 lowercase letter!";
            }
        } elseif($this->post['password'] != $this->post['repeat_password']) {
            $result[] = "Password and Repeat Password fields must match";
        } elseif(!empty($this->post['password'])) {
            $result[] = "Please check you've entered or confirmed your password!";
        } else {
            $result[] = "Please enter password";
        }

        return !empty($result) ? implode(', ', $result) : '';
    }

}

?>