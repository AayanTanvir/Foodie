import React, { useState } from 'react'
import { SlInfo } from 'react-icons/sl'

const Info = ({ info="" }) => {
	const [showInfo, setShowInfo] = useState(false);

	return (
		<div onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
			<SlInfo className='text-xl text-neutral-700'/>
			{showInfo && 
				<div className='absolute bg-white border border-neutral-500 p-2 rounded-md shadow-md max-w-[20rem] z-10'>
					<p className='font-opensans text-[0.8rem] text-wrap'>{info}</p> 
				</div>
			}
		</div>
	)
}

export default Info
