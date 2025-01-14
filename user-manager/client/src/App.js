import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AdminPage from "./components/AdminPage.js";
import Createuser from "./components/Createuser/Createuser";
import "./App.css";

export default function App() {
  const cookie = Cookies.get("token");
  const url = window.location.origin;
  const [userInfo, setuserInfo] = useState([
    {
      user_id: "",
      username: "",
      user_name: "",
      user_surname: "",
      user_type: "",
      user_email: "",
    },
  ]);
  const [inputs, setInputs] = useState({
    username: "",
    user_name: "",
    user_surname: "",
    user_password: "",
    user_email: "",
  });
  const [option, setOption] = useState("admin");
  const [rod, setRod] = useState(false);

  const getToken = async () => {
    try {
      window.location.href = `http://localhost:3050/?redirectURL=${url}`;
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const checkToken = async () => {
    try {
      const res = await axios.post("http://localhost:3000/valid-token", {
        url: url,
        token: cookie,
      });
      if (res.data.message !== "token Validated") {
      }
    } catch (error) {
      await getToken();
    }
  };

  useEffect(async () => {
    cookie === undefined ? await getToken() : await checkToken();
    await getUserList();
  }, [rod]);

  const getUserList = async () => {
    try {
      const res = await axios.get("http://localhost:3100/get-users", {
        headers: {
          Authorization: "Bearer " + cookie,
        },
      });
      if (res.data.message === "invalid token") {
        getToken();
      } else {
        const result = res.data.result;
        setuserInfo(
          result.map((i) => ({
            user_id: i.user_id,
            username: i.username,
            user_email:i.user_email,
            user_name: i.user_name,
            user_surname: i.user_surname,
          }))
        );
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const delUser = async (user_id) => {
    try {
      const res = await axios.delete("http://localhost:3100/delete", {
        headers: {
          Authorization: "Bearer " + cookie,
        },
        data: {
          user_id: user_id,
        },
      });
      await getUserList();
    } catch (error) {
      if (error.response.data.message === "invalid token") {
        getToken();
      }
      alert(error.response.data.message);
    }
  };

  const createUser = async () => {
    try {
      await axios.post(
        "http://localhost:3100/create",
        {
          username: inputs.username,
          user_name: inputs.user_name,
          user_surname: inputs.user_surname,
          user_password: inputs.user_password,
          user_email: inputs.user_email,
          user_type: option,
        },
        {
          headers: {
            Authorization: "Bearer " + cookie,
          },
        }
      );
    } catch (error) {
      if (error.response.data.message === "invalid token") {
        getToken();
      }
      alert(error.response.data.message);
    }
  }


  const updateUser = async (id) => {

    try {
      const res = await axios.put(
        "http://localhost:3100/update-user",
        {
          user_id: id,
          username: inputs.username,
          user_name: inputs.user_name,
          user_surname:inputs.user_surname,
          user_email: inputs.user_email,
          user_type: option,
        },
        {
          headers: {
            Authorization: "Bearer " + cookie,
          },
        }
      )
      getUserList()
      if (res.data.message === "invalid token") {
        getToken();
      } else {
      }
      
    } catch (error) {
      alert(error.response.data.message)
    }
    
  };

  const rodHandle = () => setRod((rod) => !rod);

  return (
    <div className="App">
           <div className="create-user">
        <button onClick={() => rodHandle(rod)} className="bn3637 bn37">
          <img src="/images/create.png" className="create-img" alt="" />
          Create User
        </button>
      </div>
      {rod && (
        <Createuser
          createUser={createUser}
          rod={rod}
          rodHandle={rodHandle}
          inputs={inputs}
          setInputs={setInputs}
          option={option}
          setOption={setOption}
        />
      )}
      {!rod && <AdminPage users={userInfo} delUser={delUser} inputs={inputs} setInputs={setInputs} option={option}
          setOption={setOption} updateUser={updateUser} />}
    </div>
  );
}
