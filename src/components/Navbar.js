import React from 'react'

import Navigation from './Navbar/Navigation'
import Search from './Navbar/Search'
import Auth from './Navbar/Auth'
import { useMatch } from "react-router-dom"

function Navbar() {

  const searchRoute = useMatch('/home')
  const searchRoute2 = useMatch('/deneme')

  return (
    <nav className='h-[3.75rem] flex items-center justify-between px-8'>
      <Navigation/>
      {(searchRoute || searchRoute2) && <Search/>}
      {/* {searchRoute  && <Search/>} */}
      <Auth/>

    </nav>
  )
}

export default Navbar