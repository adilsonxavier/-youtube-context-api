import React from "react"
import api from "../api"

import history from "../history";
//import { useHistory } from 'react-router-dom';
//import { createBrowserHistory } from 'history';


const Context = React.createContext();

function AuthProvider(props) {

    const [authenticated, setAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(true); // este estado loading é setado para false quando finalizar a autenticação no
                                                        // user effect. Enquanto isso ele renderiza Loading ... (ver if abaixo) e não
                                                        // o componente principal em props.children
                                                        // Este artifício é necessário para não dar conflito no useEffect deste componente
                                                        // e o useEffect de Login.js que são executados de forma assíncrona ao mesmo tempo
                                                        // o que faz com que possa dar erro 401( não autorizado) quando executar o
                                                        // Users.js sem ter terminado a autenticação aqui

    //const history = useHistory();

   //const history = createBrowserHistory();



    React.useEffect(() => {
       // console.log("AC.useeffect executado");
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
            setAuthenticated(true);
        }
        setLoading(false);
    }, []);

  async   function handleLogin(e) {
      //e.preventDefault();
       const { data: { token } } = await api.post("/authenticate");

        
        //Desestruturação acima:
        // data é o retorno padrão do axios
        // os 2 pontos é pra dar um alias pro data
        // {token} é um filho de data e aqui ele é desestruturado para que venha só o token


       // console.log("dados " + data.user.name+ " token é" + data.token );
        console.log("dados agora "+JSON.stringify( token));  // sem o JSON.stringfy o token retorna nao entre aspas
        setAuthenticated(true);

        localStorage.setItem("token", JSON.stringify(token));
        api.defaults.headers.Authorization = `Bearer ${token}`; // Aqui é guardada na api (axios) o header já com o token que retornou no 
                                                                //  api.post("/authenticate") acim para que seja usada na próxima vês que 
                                                                // um método do axios for usado ( neste caso é o get de Users.js)

        history.push("./users");
       // createBrowserHistory().push("./users");
    }


    function handleLogout() {

        setAuthenticated(false);
        localStorage.removeItem("token");
        api.defaults.headers.Authorization = undefined;


        history.push("./login");
    }

    return (
        // O value abaixo eu passo como objeto e não variável por que ele é usado nos outros componentes com desestruturação
        <Context.Provider value={{loading, authenticated,handleLogin,handleLogout}}> 
            {props.children}
        </Context.Provider>
        );
}

export { Context, AuthProvider };