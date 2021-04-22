import {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0';
import style from './navbar.module.css'


export default function Navbar()
{
    const { user, error, isLoading } = useUser();
    return(<div className = {style.navbar}>
            {user && <p className = {style.user}>User: {user.name}</p>}
            {user ? 
            <a href="/api/auth/logout" className = {style.logInNOut}>Logout</a>: 
            <a href="/api/auth/login" className = {style.logInNOut}>Login</a>}
        </div>)
}