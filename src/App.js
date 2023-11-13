import './App.css';
// jQuery
import $ from 'jquery';
// izitoast
import izitoast from 'izitoast';
import "izitoast/dist/css/iziToast.css";
// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

$('.login').on('click', function() {
  let type = 'login';
  let f = fields(type);

  let js = {};
  for(const i in f) {
    js[f[i]] = $('.'+f[i]).val();
  }
  js['action'] = type;

  if(js['login_email'] == '') {
    izitoast.warning({
      title: 'Warning!',
      message: 'Email field can\'t be empty',
      close: false,
      position: 'topRight',
      timeout: 3000,
      zindex: 9999999999999
    });
  } else if(js['login_password'] == '') {
    izitoast.warning({
      title: 'Warning!',
      message: 'Password field can\'t be empty',
      close: false,
      position: 'topRight',
      timeout: 3000,
      zindex: 9999999999999
    });
  } else {

    $.post(`${process.env.REACT_APP_DOMAIN_URL}/workers/users.php`, js, function(data){
      data = JSON.parse(data);
      if(data.error) {
        izitoast.error({
          title: 'Error!',
          message: data.error,
          close: false,
          position: 'topRight',
          timeout: 3000,
          zindex: 9999999999999
        });
      } else if(data.success) {
        clear(f);

        $('.form-block').hide();

        $('#id').html(data.user_id);
        $('#name').html(data.user_second_name + ' ' + data.user_name);
        $('#resitration_date').html(data.registered);

        $('.userblock').show();

        izitoast.success({
          title: 'Success!',
          message: 'Login successful',
          close: false,
          position: 'topRight',
          timeout: 3000,
          zindex: 9999999999999
        });
      }
    });

  }
});

$('.register').on('click', function() {
  let type = 'register';
  let f = fields(type);

  let js = {};
  for(const i in f) {
    js[f[i]] = $('.'+f[i]).val();
  }
  js['action'] = type;

  if(js['name'] == '') {
    izitoast.warning({
      title: 'Warning!',
      message: 'First Name field can\'t be empty',
      close: false,
      position: 'topRight',
      timeout: 3000,
      zindex: 9999999999999
    });
  } else if(js['sname'] == '') {
    izitoast.warning({
      title: 'Warning!',
      message: 'Second Name field can\'t be empty',
      close: false,
      position: 'topRight',
      timeout: 3000,
      zindex: 9999999999999
    });
  } else if(!validateEmail(js['email'])) {
    izitoast.error({
      title: 'Error!',
      message: 'Email is not valid',
      close: false,
      position: 'topRight',
      timeout: 3000,
      zindex: 9999999999999
    });
  } else if(js['password'] !== js['repeat_password']) {
    izitoast.error({
      title: 'Error!',
      message: 'Password and Repeat Password fields must match',
      close: false,
      position: 'topRight',
      timeout: 3000,
      zindex: 9999999999999
    });
  } else {
    $.post(`${process.env.REACT_APP_DOMAIN_URL}/workers/users.php`, js, function(data){
      data = JSON.parse(data);
      if(data.error) {
        izitoast.error({
          title: 'Error!',
          message: data.error,
          close: false,
          position: 'topRight',
          timeout: 3000,
          zindex: 9999999999999
        });
      } else if(data.success) {
        clear(f);

        $('button.active').removeClass('active');
        $('div.show').removeClass('show active');

        $('ul#myTab li:first-child button').addClass('active');
        $('div.tab-content div:first-child').addClass('show active');

        izitoast.success({
          title: 'Success!',
          message: 'Registration successful. Now you can log in with your data',
          close: false,
          position: 'topRight',
          timeout: 3000,
          zindex: 9999999999999
        });
      }
    });
  }
});

function fields(type) {
  let f = [];
  switch(type) {
    case 'login':
      f = ['login_email', 'login_password'];
      break;
    case 'register':
    default:
      f = ['name', 'sname', 'email', 'password', 'repeat_password'];
      break;
  }

  return f;
}

function clear(fields) {
  for(const i in fields) {
    $('.'+fields[i]).val('');
  }
}

function validateEmail(email) {
  let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return re.test(String(email).toLowerCase());
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="form-block">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Login</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Register</button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab">
              <div className="input-group mb-3">
                <span className="input-group-text" id="login_email">Email</span>
                <input type="email" className="form-control login_email" required placeholder="Email" aria-label="Email" aria-describedby="login_email"></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="login_password">Password</span>
                <input type="password" className="form-control login_password" required placeholder="Password" aria-label="Password" aria-describedby="login_password"></input>
              </div>
              <button type="button" className="btn btn-primary login">Login</button>
            </div>
            <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab">
              <div className="input-group mb-3">
                <span className="input-group-text" id="register_name">First Name</span>
                <input type="text" className="form-control name" required placeholder="First Name" aria-label="First Name" aria-describedby="register_name"></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="register_sname">Second Name</span>
                <input type="text" className="form-control sname" required placeholder="Second Name" aria-label="Second Name" aria-describedby="register_sname"></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="register_email">Email</span>
                <input type="email" className="form-control email" required placeholder="Email" aria-label="Email" aria-describedby="register_email"></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="register_password">Password</span>
                <input type="password" className="form-control password" required placeholder="Password" aria-label="Password" aria-describedby="register_password"></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="register_rpassword">Repeat password</span>
                <input type="password" className="form-control repeat_password" required placeholder="Repeat password" aria-label="Repeat password" aria-describedby="register_rpassword"></input>
              </div>
              <button type="button" className="btn btn-primary register">Register</button>
            </div>
          </div>
        </div>
        <div className="userblock">
          <div className="user-foto">
            <div className="foto-block">
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
          <div className="user-info">
            <p><b>ID:</b> <span id="id"></span></p>
            <p><b>Name:</b> <span id="name"></span></p>
            <p><b>Register date:</b> <span id="resitration_date"></span></p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
