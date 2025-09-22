import React, { useState } from 'react'
import { SlInfo } from 'react-icons/sl'

const Info = ({ info="", classes="" }) => {
	const [showInfo, setShowInfo] = useState(false);

	return (
		<div onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} className={classes}>
			<SlInfo className='text-xl text-neutral-700'/>
			<div className='w-fit h-fit relative'>
				{showInfo && 
					<div className='absolute bg-white border border-neutral-500 p-2 rounded-md shadow-md min-w-[15rem] max-w-[30rem] z-30'>
						<p className='font-opensans text-[0.8rem] text-wrap'>{info}</p>
					</div>
				}
			</div>
		</div>
	)
}

export default Info
