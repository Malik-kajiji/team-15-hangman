import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertData } from '../context/AlertContext';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const SignUp = () => {
    const navigate = useNavigate()
    const { setAlertData } = AlertData()
    const [ formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConf: '',
        username:''
    })

    const { email, password, passwordConf,username } = formData


    const handleSubmit = e => {
        e.preventDefault()
        if(email === '' || password === '' || passwordConf === '' || username === ''){
            setAlertData({type:'warrning',showen:true,msg:'make sure to fill all the inputs'})
        }else if(password !== passwordConf ){
            setAlertData({type:'warrning',showen:true,msg:'make sure to match the passwords'})
        } else {
            createUserWithEmailAndPassword(auth,email,password)
            .then((res)=>{
                updateProfile(res.user,{displayName:username})
                setAlertData({type:'success',showen:true,msg:'created account successfully'})
                navigate('/')
            })
            .catch((err) => setAlertData({type:'error',showen:true,msg:err.message}))
        }
    }

    const handleChange = e => {
        
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value,
        })
    }
    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <label htmlFor="">username</label>
            <input 
                type="text" 
                placeholder='username' 
                autoComplete='off'
                id='username'
                name='username'
                value={username}
                onChange={handleChange}
                />
            <label htmlFor="">Email</label>
            <input 
                type="text" 
                autoComplete='off'
                id='email'
                name='email'
                placeholder='name@example.com'
                value={email}
                onChange={handleChange}
            />
            <label htmlFor="">password</label>
            <input 
                type='password'
                autoComplete='off'
                id='password'
                name='password'
                placeholder='****************'
                value={password}
                onChange={handleChange}
            />
            <label htmlFor="">confirm password</label>
            <input 
                type='password'
                autoComplete='off'
                id='confirm'
                name='passwordConf'
                placeholder='****************'
                value={passwordConf}
                onChange={handleChange}
            />
            <button className='Btn'>
                create account
            </button>
            <p>
                already have an account? <Link to='/'><span> login</span></Link> 
            </p>
        </form>
    )
}

export default SignUp