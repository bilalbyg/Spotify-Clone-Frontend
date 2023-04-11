import React from 'react'
import { Icon } from "../../Icons"
import {useNavigate} from "react-router-dom"

export default function Navigation() {

    const navigate = useNavigate()

    function prevPage(){
        navigate(-1);
    }

    function nextPage(){
        navigate( 1);
    }

  return (
    <nav className='flex items-center gap-x-4'>
        <button onClick={prevPage} className='h-8 w-8 flex items-center justify-center rounded-full bg-black bg-opacity-70'><Icon name="back" size={20}/></button>
        <button onClick={nextPage} className='h-8 w-8 flex items-center justify-center rounded-full bg-black bg-opacity-70'><Icon name="next" size={20}/></button>      
    </nav>
  )
}
