// Toggle between register form and login form
$('.message a').click(function () {
  $('form').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
});

const signIn = document.querySelector('.login-form');
const signup = document.querySelector('.register-form');

// Post request to Register API
async function register(body) {
  try {
    const param = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `/api/${apiVersion}/user/signup`,
      param
    );
    const result = await response.json();

    if (result.error) {
      Swal.fire({
        icon: 'info',
        text: `${result.error}`,
      });
    } else {
      window.localStorage.setItem('access_token', result.data.access_token); // Save token

      Swal.fire({
        icon: 'success',
        title: 'Register successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      // 登入成功後，導向profile page
      setTimeout(() => {
        window.location.href = '/lookup.html';
      }, 1600);
    }
  } catch (err) {
    console.error(err);
  }
}

// 註冊按鈕的event listener
signup.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.querySelector(
    ".register-form input[type='text']"
  ).value;
  const email = document.querySelector(
    ".register-form input[type='email']"
  ).value;
  const password = document.querySelector(
    ".register-form input[type='password']"
  ).value;
  if (!email || !password || !name) {
    Swal.fire({
      icon: 'info',
      text: 'Please type your email and password and name',
    });
    return;
  }
  if (password.length < 6) {
    Swal.fire({
      icon: 'info',
      text: 'The password length should be longer than 6',
    });
    return;
  }
  const body = {
    name,
    email,
    password,
  };
  // Send Post request
  register(body);
});

// Post request to login api
async function login(body) {
  try {
    const param = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `/api/${apiVersion}/user/signin`,
      param
    );
    const result = await response.json();

    if (result.error) {
      Swal.fire({
        icon: 'info',
        text: `${result.error}`,
      });
    } else {
      window.localStorage.setItem('access_token', result.data.access_token); // Save token
      Swal.fire({
        icon: 'success',
        title: 'Login successfully',
        showConfirmButton: false,
        timer: 2000,
      });
      // 若登入成功，就導向profile page
      setTimeout(() => {
        window.location.href = '/lookup.html';
      }, 1600);
    }
  } catch (err) {
    console.error(err);
  }
}

// 登入頁面按鈕的event listener
signIn.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector(".login-form input[type='email']").value;
  const password = document.querySelector(
    ".login-form input[type='password']"
  ).value;
  if (!email || !password) {
    Swal.fire({
      icon: 'info',
      text: 'Please type your email and password',
    });
  }
  const body = {
    email,
    password,
    provider: 'native',
  };
  // Send Post request
  login(body);
});
