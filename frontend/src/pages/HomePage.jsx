import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
  
  const {user} = useContext(AuthContext)

  return (
    <div className='mt-4'>
      {user ? <h1 className='text-center'>Welcome {user.username}!</h1> : <h1 className='text-center'>Welcome please login!</h1>}
    </div>
  )
}

export default HomePage
