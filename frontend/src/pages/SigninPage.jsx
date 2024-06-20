import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import { useSnackbar } from 'notistack'
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const Signin = () => {
     const [username, setUsername] = useState("")
     const [password, setPassword] = useState("")
     const navigate = useNavigate();
     const { enqueueSnackbar } = useSnackbar()

     const handleClick = async () => {
          try {
               const response = await axios.post("http://localhost:5000/api/v1/user/signin", {
                    username,
                    password
               });
               if (response.status === 200) {
                    localStorage.setItem("token", response.data.token)
                    navigate("/dashboard")
                    enqueueSnackbar(response.data.message, { variant: 'success' })
               }
          } catch (error) {
               navigate("/signin")
               const message = error.response?.data.message || error.message;
               enqueueSnackbar(message, { variant: 'error' })
          }
     }

     return (
          <div className="bg-slate-300 h-screen flex justify-center">
               <div className="flex flex-col justify-center">
                    <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                         <Heading label={"Sign in"} />
                         <SubHeading label={"Enter your credentials to access your account"} />
                         <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="john@example.com" label={"Email"} />
                         <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="123456" label={"Password"} />
                         <div className="pt-4">
                              <Button onClick={handleClick} label={"Sign in"} />
                         </div>
                         <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                    </div>
               </div>
          </div>
     )
}