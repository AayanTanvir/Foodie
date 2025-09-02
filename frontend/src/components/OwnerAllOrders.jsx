

const OwnerAllOrders = () => {
	// do something
	return (
		<div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
			<div className='w-full h-fit border-b-[1.5px] border-neutral-400 px-4 py-2 flex justify-center items-center'>
				<h1 className='cursor-default font-notoserif text-4xl text-neutral-800'>Orders</h1>
			</div>
			<div className="w-full h-fit grid auto-rows-auto grid-cols-3 p-6 gap-5">
				<div className="w-full min-h-[150px] border-[1px] border-neutral-400 rounded">

				</div>
				<div className="w-full min-h-[150px] border-[1px] border-neutral-400 rounded">

				</div>
				<div className="w-full min-h-[150px] border-[1px] border-neutral-400 rounded">

				</div>
				<div className="w-full min-h-[150px] border-[1px] border-neutral-400 rounded">

				</div>
				<div className="w-full min-h-[150px] border-[1px] border-neutral-400 rounded">

				</div>
			</div>
		</div>
	)
}

export default OwnerAllOrders
