import React from 'react';

import { Context } from "../context/AuthContext";

export default function Login() {
    const { authenticated,handleLogin} = React.useContext(Context); // Usei desestrutura��o simplesmente por que foi setado o value como valor default no
                                                         // AuthProvider como objeto e n�o string

    console.log(authenticated);
    console.error("Login", authenticated);

    return (
        <button type="button" onClick={handleLogin }>Entrar</button>
    );
}