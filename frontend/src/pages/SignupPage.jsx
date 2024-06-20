import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import { useSnackbar } from 'notistack'
import { useNavigate } from "react-router-dom";
import axios from 'axios'


export const Signup = () => {

     const [firstName, setFirstName] = useState("")
     const [lastName, setLastName] = useState("")
     const [username, setUsername] = useState("")
     const [password, setPassword] = useState("")
     const navigate = useNavigate()
     const { enqueueSnackbar } = useSnackbar()

     const handleClick = async () => {
          try {
               const response = await axios.post("http://localhost:5000/api/v1/user/signup", {
                    username,
                    password,
                    firstName,
                    lastName,
               })
               if (response.status === 200) {
                    localStorage.setItem("token", response.data.token)
                    navigate("/dashboard")
                    enqueueSnackbar(response.data.message, { variant: 'success' })
               }
          } catch (error) {
               navigate("/signup")
               const message = error.response?.data.messsage || error.message;
               enqueueSnackbar(message, { variant: "error" })
          }
     }

     return (
          <div className="bg-slate-300 h-screen flex justify-center">
               <div className="flex flex-col justify-center">
                    <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                         <Heading label={"Signup"} />
                         <SubHeading label={"Enter your information to create an account"} />
                         <InputBox onChange={(e) => setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
                         <InputBox onChange={(e) => setLastName(e.target.value)} placeholder="Doe" label={"Last Name"} />
                         <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="john@example.com" label={"Email"} />
                         <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="123456" label={"Password"} />
                         <div className="pt-4">
                              <Button onClick={handleClick} label={"Sign up"} />
                         </div>
                         <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                    </div>
               </div>
          </div>
     )
}