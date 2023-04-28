import React, { useEffect, useState } from 'react';
import '../styles/create-session.css';
import { MdEdit , MdOutlineDelete } from 'react-icons/md';
import { AlertData } from '../context/AlertContext';
import { uid } from 'uid';
import { db } from '../config/firebaseConfig';
import { doc,setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const CreateSession = () => {
    const { setAlertData } = AlertData();

    const [words,setWords] = useState([]);
    console.log(words)
    const [sessionCode,setSessionCode] = useState('');
    const [isCopied,setIsCopied] = useState(false);

    const [newWordInput,setNewWordInput] = useState('');
    const [changeWordInput,setChangeWordInput] = useState('');

    const [current,setCurrent] = useState(null);

    function newWordChange(e){
        if(!isNaN(parseInt(e[e.length -1]))){
            setAlertData({type:'warrning',showen:true,msg:'the word should only contain letters'})
        }else {
            setNewWordInput(e)
        }
    }

    function changeWordChange(e){
        if(!isNaN(parseInt(e[e.length -1]))){
            setAlertData({type:'warrning',showen:true,msg:'the word should only contain letters'})
        }else {
            setChangeWordInput(e)
        }
    }

    function handleAdd(){
        if(newWordInput.length < 3){
            setAlertData({type:'warrning',showen:true,msg:'the word should contains at least 3 letters'})
        }else if(newWordInput.length > 12){
            setAlertData({type:'warrning',showen:true,msg:'the word should contains at most 12 letters'})
        } else {
            let isExists = false;
            for(let i =0;i<words.length && !isExists;i++){
                if(words[i].wordStr === newWordInput){
                    isExists = true
                }
            }
            if(isExists){
                setAlertData({type:'warrning',showen:true,msg:'the word already exists'})
            }else {
                let visibility = Array(newWordInput.length).fill(false);
                visibility[0] = true
                let word = []
                for(let i =0;i<newWordInput.length;i++){
                    word.push(newWordInput[i])
                }
                setWords(prev => [...prev,{word,visibility,wordStr:newWordInput}])
                setNewWordInput('')
            }
        }
    }

    function handleChangeVisisbility(i,current){
        setWords(prev => {
            let counter = 0;
            let visibility = !prev[current].visibility[i];
            for(let i = 0; i < prev[current].visibility.length ; i++){
                if(prev[current].visibility[i]) counter++;
            }
            if(counter === 1 && !visibility) {
                setAlertData({type:'warrning',showen:true,msg:'there should be at least one visibile letter'})
                return prev;
            }else if (counter === prev[current].visibility.length - 1 && visibility){
                setAlertData({type:'warrning',showen:true,msg:'there should be at least one hidden letter'})
                return prev;
            }else {
                let newArr = prev.map((e,index)=> {
                    if(index === current){
                        let newVisibility = [...e.visibility]
                        newVisibility[i] = visibility
                        return {word:[...e.word],visibility:newVisibility,wordStr:e.wordStr}
                    }else {
                        return e;
                    }
                })
                return newArr;
            }
        })
    }

    function handleChageClick(current,words){
        if(changeWordInput.length < 3){
            setAlertData({type:'warrning',showen:true,msg:'the word should contains at least 3 letters'})
        }else if(changeWordInput.length > 12){
            setAlertData({type:'warrning',showen:true,msg:'the word should contains at most 12 letters'})
        } else {
            let isExists = false;
            for(let i =0;i<words.length && !isExists;i++){
                if(words[i].wordStr === changeWordInput){
                    isExists = true
                }
            }
            if(isExists){
                setAlertData({type:'warrning',showen:true,msg:'the word already exists'})
            }else {
                let visibility = Array(changeWordInput.length).fill(false);
                visibility[0] = true
                let word = []
                for(let i =0;i<changeWordInput.length;i++){
                    word.push(changeWordInput[i])
                }
                setWords(prev => {
                    let newArr = prev.map((e,index)=>{
                    if(current === index){
                        return {word,visibility,wordStr:changeWordInput}
                    }else {
                        return e
                    }
                    })

                    return newArr
                })
                setChangeWordInput('')
            }
        }
    }

    function handleDelete(index,current){
        setWords(prev => {
            let newArr = prev.filter((e,i)=> i !== index);
            return newArr;
        })
        if(current > index){
            setCurrent(prev => prev - 1);
        }else if (current === index){
            setCurrent(null)
        }
    }

    function handleShare(){
        if(words.length < 1){
            setAlertData({type:'warrning',showen:true,msg:'there should be at least 1 word'})
        }else {
            let newUid = uid(12);
            const ref = doc(db,'sessions',newUid)
            setDoc(ref,{allwords:words})
            .then(()=>{
                setSessionCode(newUid);
                setAlertData({type:'success',showen:true,msg:'session created successfully'})
            })
            .catch((err)=>{
                setAlertData({type:'error',showen:true,msg:err.message})
            })
        }
    }

    function handleCopy(){
        navigator.clipboard.writeText(sessionCode);
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 3000);
    }

    return (
        <section className='create-session'>
            <aside>
                <h2>Create Session</h2>
                <div>
                    <input
                        type="text"
                        placeholder='enter a new word'
                        value={newWordInput}
                        onChange={(e)=> newWordChange(e.target.value)}
                        />
                    <button className='Btn' onClick={handleAdd}>Add</button>
                </div>
                <ul>
                    {words.map((e,i) => <li key={i}>
                        <p>{e.word}</p>
                        <span onClick={()=>setCurrent(i)}>{MdEdit({})}</span>
                        <span onClick={()=>handleDelete(i,current)}>{MdOutlineDelete({})}</span>
                    </li>)
                    }
                </ul>
                <button className='save-btn Btn' onClick={handleShare}>
                    save & share
                </button>
                <Link to='/'>
                    <button className='go-back '>
                        Go Back To Home Page
                    </button>
                </Link>
            </aside>
            <article className={current === null? 'hide' : ''}>
                <div className='change-word'>
                    <input 
                        type="text"
                        placeholder='change the word'
                        value={changeWordInput}
                        onChange={(e)=> changeWordChange(e.target.value)}
                        />
                    <button className='Btn' onClick={()=>handleChageClick(current,words)}>change</button>
                </div>
                <div className='word-sittings'>
                    <p className='showen'>showen letters</p>
                    {current !== null?
                        <div>
                            {words[current].word.map((e,i)=>{
                                return <span 
                                            onClick={()=>handleChangeVisisbility(i,current)} 
                                            key={i} 
                                            className={words[current].visibility[i]? '':'hidden-letter'}
                                            >{e}
                                        </span>
                            })
                            }
                        </div>
                        :
                        <>
                        </>
                    }
                    <p className='hidden'>hidden letters</p>
                    <span className='note'>*click on the letter to change its visibility</span>
                </div>
            </article>
            <div className={`share-session ${sessionCode !== ''? 'active' : ''}`}>
                <div>
                    <p>{sessionCode}</p>
                    <button className='Btn' onClick={handleCopy}>{isCopied? 'copied': 'copy'}</button>
                </div>
                <Link to='/'>
                    <button className='go-back Btn'>
                        go back to home page
                    </button>
                </Link>
            </div>
        </section>
    )
}

export default CreateSession