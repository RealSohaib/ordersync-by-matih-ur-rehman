import { useEffect } from 'react'
import Login from '../../components/Login'
export default function AdminLogin(){
    useEffect(()=>{

document.title="Employees Login " 
   })
    return(<>
    <Login/>
    </>)
}