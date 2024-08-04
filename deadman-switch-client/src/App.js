import React, { useState } from 'react';
import axios from 'axios';

function base64urlToUint8Array(base64url) {
  const padding = '='.repeat((4 - base64url.length % 4) % 4);
  const base64 = (base64url + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function uint8ArrayToBase64url(uint8Array) {
  const base64 = window.btoa(String.fromCharCode(...uint8Array));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function App() {
  const [user, setUser] = useState({ email: '' });

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleWebAuthnRegister = async () => {
    try {
      const { data: options } = await axios.post('http://localhost:3000/api/auth/webauthn/register', { email: user.email });

      options.challenge = base64urlToUint8Array(options.challenge);
      options.user.id = base64urlToUint8Array(options.user.id);

      const credential = await navigator.credentials.create({ publicKey: options });

      const response = {
        id: credential.id,
        rawId: uint8ArrayToBase64url(new Uint8Array(credential.rawId)),
        response: {
          clientDataJSON: uint8ArrayToBase64url(new Uint8Array(credential.response.clientDataJSON)),
          attestationObject: uint8ArrayToBase64url(new Uint8Array(credential.response.attestationObject)),
        },
        type: credential.type,
        email: user.email,
      };

      await axios.post('http://localhost:3000/api/auth/webauthn/verify', response);
      alert('User registered successfully');
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  const handleWebAuthnLogin = async () => {
    try {
      const { data: options } = await axios.post('http://localhost:3000/api/auth/webauthn/login-options', { email: user.email });

      options.challenge = base64urlToUint8Array(options.challenge);
      options.allowCredentials[0].id = base64urlToUint8Array(options.allowCredentials[0].id);

      const assertion = await navigator.credentials.get({ publicKey: options });

      const response = {
        id: assertion.id,
        rawId: uint8ArrayToBase64url(new Uint8Array(assertion.rawId)),
        response: {
          clientDataJSON: uint8ArrayToBase64url(new Uint8Array(assertion.response.clientDataJSON)),
          authenticatorData: uint8ArrayToBase64url(new Uint8Array(assertion.response.authenticatorData)),
          signature: uint8ArrayToBase64url(new Uint8Array(assertion.response.signature)),
          userHandle: assertion.response.userHandle ? uint8ArrayToBase64url(new Uint8Array(assertion.response.userHandle)) : null,
        },
        type: assertion.type,
        email: user.email,
      };

      await axios.post('http://localhost:3000/api/auth/webauthn/login-verify', response);
      alert('User logged in successfully');
    } catch (error) {
      console.error(error);
      alert('Error logging in user');
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    handleWebAuthnRegister();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    handleWebAuthnLogin();
  };

  return (
    <div className="App">
      <h1>Dead Man Switch</h1>
      
      <form onSubmit={handleUserSubmit}>
        <h2>Register User</h2>
        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleUserChange} required />
        <button type="submit">Register</button>
      </form>

      <form onSubmit={handleLoginSubmit}>
        <h2>Login User</h2>
        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleUserChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
