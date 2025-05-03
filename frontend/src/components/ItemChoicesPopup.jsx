import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'
import close from '../assets/close.svg';


const ItemChoicesPopup = ({ item }) => {

    let { sideItems, menuItemModifiers, activateChoicesPopup } = useContext(CartContext);
    const [selectedModifiers, setSelectedModifiers] = useState({});
    const [selectedSideItems, setSelectedSideItems] = useState([]);

    const getModifiers = (item, modifiers) => {
        return modifiers.filter((modifier) => modifier.menu_item === item.name);
    };

    const toggleModifierChoices = (modifierId, choiceId, isMultiSelect) => {
        setSelectedModifiers((prev) => {
          const current = prev[modifierId] || [];
    
          if (isMultiSelect) {
            return {
                ...prev,
                [modifierId]: current.includes(choiceId)
                    ? current.filter((id) => id !== choiceId)
                    : [...current, choiceId],
            };
          } else {
            return {
                ...prev,
                [modifierId]: current[0] === choiceId ? [] : [choiceId],
            };
          }
        });
    };

    const toggleSideItemChoices = (sideItemId) => {
        setSelectedSideItems((prev) => {
            const isSelected = selectedSideItems.includes(sideItemId);
            if (isSelected) {
                return selectedSideItems.filter((itemID) => itemID !== sideItemId);
            } else {
                return [...prev, sideItemId];
            }
        })
    }

    const itemModifiers = getModifiers(item, menuItemModifiers);

    return (
        <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50'>
            <div className='w-2/4 h-3/4 bg-neutral-100 border-2 border-gray-200 flex flex-col justify-start items-center rounded-lg overflow-y-auto pt-2 pb-4 px-5'>
                {itemModifiers.length !== 0 ? (
                    <>
                        <div className='w-full h-[2.5rem] border-b-2 border-gray-200 px-4 flex justify-between items-center mb-4'>
                            <h1 className='text-left font-hedwig text-xl cursor-default text-neutral-800'>Modifications</h1>
                            <img src={close} alt="Close" className='cursor-pointer' onClick={() => { activateChoicesPopup(null, false) }}/>
                        </div>
                        <div className='w-full h-fit flex flex-col justify-start items-center gap-5 mb-5'>
                            {itemModifiers?.map((modifier) => (
                                <div key={modifier.id} className='w-[95%] h-fit border-2 border-gray-300 p-2 rounded'>
                                    <div className='w-full h-8 px-2 flex justify-between items-center mb-2'>
                                        <h1 className='text-left font-hedwig text-lg text-neutral-800 cursor-default'>{modifier.name}</h1>
                                        {modifier.is_required === false && (
                                            <h1 className='text-right font-roboto text-md border-2 border-gray-300 cursor-default rounded-full px-2 bg-gray-200 text-gray-500'>Optional</h1>
                                        )}
                                    </div>
                                    <div className='w-full h-fit flex flex-col justify-start items-center'>
                                        {modifier?.choices?.map((choice) => {
                                            const isSelected = selectedModifiers[modifier.id]?.includes(choice.id);
                                            return (
                                                <div onClick={() => toggleModifierChoices(modifier.id, choice.id, modifier.is_multiselect)} key={choice.id} className={`w-[95%] h-8 rounded flex 
                                                justify-between items-center p-4 mb-2 
                                                cursor-pointer transition duration-300 
                                                ease-out border-2 border-transparent hover:border-gray-300 ${
                                                    isSelected && "bg-gray-300"
                                                }`}>
                                                    <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                                        <div className={`w-4 h-4 ${modifier.is_multiselect ? "rounded-sm" : "rounded-full"} border-2 border-gray-600 p-1 ${
                                                            isSelected && "bg-gray-400"
                                                        }`}></div>
                                                        <h1 className='font-poppins text-md text-neutral-800'>{choice.label}</h1>
                                                    </div>
                                                    {choice.price != 0 ? (
                                                        <h1 className='font-hedwig text-md text-neutral-800'>+ Rs. {choice.price}</h1>
                                                    ) : (
                                                        <h1 className='font-hedwig text-md text-neutral-800'>Free</h1>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='w-full h-[2.5rem] flex justify-end items-center px-2'>
                        <img src={close} alt="Close" className='cursor-pointer' onClick={() => { activateChoicesPopup(null, false) }} />
                    </div>
                )}
                <div className='w-full h-[2.5rem] border-b-2 border-gray-200 px-4'>
                    <h1 className='text-left font-hedwig text-xl cursor-default text-neutral-800'>Side Items</h1>
                </div>
                <div className='w-full h-fit grid grid-cols-3 auto-rows-auto gap-4 p-4 mb-4'>
                    {sideItems?.map((item) => {
                        const isSelected = selectedSideItems.includes(item.id);
                        return (
                            <div key={item.id} onClick={() => { toggleSideItemChoices(item.id) }} className='w-full h-fit border-2 border-gray-300 rounded flex justify-start items-center cursor-pointer transition duration-200 hover:scale-[102%]'>
                                <div className='w-1/3 h-[5rem] flex justify-center items-center cursor-pointer'>
                                    <img src={item.image} alt="Image not found" className='object-cover w-full h-full'/>
                                </div>
                                <div className='h-[5rem] flex-1 cursor-pointer flex justify-between items-center px-2'>
                                    <div className='flex flex-col justify-start items-start'>
                                        <h1 className='text-left font-poppins text-md text-neutral-800 whitespace-break-spaces text-wrap'>{item.name}</h1>
                                        <h1 className='text-left font-hedwig text-sm text-neutral-800 whitespace-break-spaces text-wrap'>Rs. {item.price}</h1>
                                    </div>
                                    <div className={`w-4 h-4 rounded-sm border-2 border-gray-600 ${isSelected && 'bg-gray-400'}`}>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='w-full h-[2.5rem] border-b-2 border-gray-200 px-4 mb-4'>
                    <h1 className='text-left font-hedwig text-xl cursor-default text-neutral-800'>Special Instructions</h1>
                </div>
                {/* TODO: useRef on this and submit button to go to cart with the desired selections */}
                <div className='w-full h-fit flex flex-col justify-start items-start px-4'>
                    <textarea type="text" placeholder='E.g. No peanuts' className='w-3/4 h-[5rem] outline-none border-2 border-neutral-300 p-2 rounded'/>
                </div>
            </div>
        </div>
    )
}

export default ItemChoicesPopup
