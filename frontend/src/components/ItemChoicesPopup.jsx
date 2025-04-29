import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'

const ItemChoicesPopup = ({ item }) => {

    let { sideItems, menuItemModifiers } = useContext(CartContext);
    const [selectedChoices, setSelectedChoices] = useState({});

    const getModifiers = (item, modifiers) => {
        return modifiers.filter((modifier) => modifier.menu_item === item.name);
    };

    const toggleChoice = (modifierId, choiceId, isMultiSelect) => {
        setSelectedChoices((prev) => {
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

    const itemModifiers = getModifiers(item, menuItemModifiers);

    return (
        <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50'>
            <div className='w-2/4 h-3/4 bg-slate-100 border-2 border-gray-200 flex flex-col justify-start items-center rounded-lg gap-4 overflow-y-auto'>
                <div className='w-full h-[2.5rem] border-b-2 border-gray-200 p-2'>
                    <h1 className='text-left font-hedwig text-xl cursor-default text-neutral-800'>Modifications</h1>
                </div>
                <div className='w-full h-fit flex flex-col justify-start items-center gap-5'>
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
                                    const isSelected = selectedChoices[modifier.id]?.includes(choice.id);
                                    return (
                                        <div onClick={() => toggleChoice(modifier.id, choice.id, false)} key={choice.id} className={`w-[95%] h-8 rounded flex 
                                        justify-between items-center p-4 mb-2 
                                        cursor-pointer transition duration-300 
                                        ease-out border-2 border-transparent hover:border-gray-300 ${
                                            isSelected && "bg-gray-300"
                                        }`}>
                                            <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                                <div className={`w-4 h-4 rounded-full border-2 border-gray-600 p-1 ${
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
            </div>
        </div>
    )
}

export default ItemChoicesPopup
