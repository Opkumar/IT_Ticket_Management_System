import React from 'react'
import { Link } from 'react-router-dom'

function FooterPage() {
  return (
    <div className='text-center'>
      <div className="  bg-gray-400 text-center">
       
       <ul className='flex  justify-center gap-5 text-[12px]  md:text-sm '>
        <li>IT Ticketing Management System made by :</li>
        <li><Link to="https://www.linkedin.com/in/om-prakash-323186280/">@Om prakash</Link></li>
        <li>@Anurag</li>
        <li>@Anjali</li>
       </ul>
      </div>
    </div>
  )
}

export default FooterPage
