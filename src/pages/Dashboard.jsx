import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom'

export const Dashboard = () =>{
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const [link, setLink] = useState('')
    const {request} = useHttp()


  

    return (<>Dashboard      page Here</>)
}