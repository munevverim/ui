import React from 'react';

const Home = () => {
  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/social-auth/login/google-oauth2/';
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Home;
