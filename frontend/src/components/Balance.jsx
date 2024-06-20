import { useState, useEffect } from "react"
import axios from "axios"

export const Balance = ({ value }) => {
     const [balance, setBalance] = useState()

     useEffect(() => {
          axios.get('http://localhost:5000/api/v1/account/balance', {
               headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
               }
          })
          .then(response => {
               setBalance(response.data.balance)
          })
     }, []);
     

     return (
          <div className="flex">
               <div className="font-bold text-lg">
                    Your balance
               </div>
               <div className="font-semibold ml-4 text-lg">
                    Rs {balance}
               </div>
          </div>
     )
}
