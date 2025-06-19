import React, { useRef, useState, useEffect, useContext } from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { CartContext } from '../context/CartContext';
import { RestaurantContext } from '../context/RestaurantContext';


const RestaurantMenu = ({ restaurant }) => {

    const scrollRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchedItems, setSearchedItems] = useState([]);
    let { doCartItemAction,  activateChoicesPopup, cartItems } = useContext(CartContext);
    let { menuItemModifiers, sideItems } = useContext(RestaurantContext);
    let menu_items = restaurant.menu_items.filter(menu_item => !menu_item.is_side_item);
    let popularItems = menu_items.sort((a, b) => b.popularity - a.popularity).slice(0, 5);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current) {
                const { scrollWidth, clientWidth } = scrollRef.current
                setIsOverflowing(scrollWidth > clientWidth);
            }
        };
        checkOverflow()
    }, [restaurant])

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -100 : 100,
                behavior: 'smooth'
            });
        }
    };

    const handleSearching = (searchBar) => {

        if (searchBar.target.value == "") {
            setIsSearching(false);
            setSearchedItems([]);
        } else {
            setIsSearching(true);
            
            let queryItems = restaurant.menu_items.filter(item => 
                item.name.toLowerCase().includes(searchBar.target.value)
            );

            setSearchedItems(queryItems);
        }
    }

    const isInCart = (item) => {
        return cartItems.some(cartItem => cartItem.uuid === item.uuid);
    }

    const handleAdd = (item) => {
        const hasModifiers = menuItemModifiers?.some(modifier => item.name === modifier.menu_item);
        if (hasModifiers) {
            activateChoicesPopup(item, true);
        } else {
            doCartItemAction(item, "addItem");
        }
    }

    return (
        <div className='relative min-h-[60rem] w-full mt-6 flex flex-col justify-start items-center'>
            <div className='sticky z-10 top-12 w-full h-12 border-b-2 border-gray-200 bg-white flex justify-start items-center flex-row'>
                <form method='get' action="" onSubmit={(e) => {e.preventDefault()}} className='relative w-[30%]'>
                    <div className='w-[80%] h-8 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                        <span className='text-neutral-700 text-lg absolute top-[20%] left-[3%]'>
                            <IoIosSearch />
                        </span>
                        <button type='button' className={`absolute top-[20%] right-[4%] ${!isSearching ? "hidden" : ""}`} onClick={(event) => {setIsSearching(false); setSearchedItems([]);}}>
                            <span className='text-neutral-700 text-lg'>
                                <IoMdClose />
                            </span>
                        </button>
                        <input onChange={handleSearching} type="text" name='search' placeholder='Search items' className='w-full h-full border-2 border-gray-300 rounded-2xl pl-8 focus:shadow-lg outline-gray-400'/>
                    </div>
                </form>
                {isOverflowing && ( 
                    <button className='border-none w-fit h-fit cursor-pointer' onClick={() => handleScroll('left')}>
                        <span className='text-2xl cursor-pointer text-neutral-700 hover:text-neutral-800'>
                            <IoIosArrowDropleft />
                        </span>
                    </button>
                )}
                <div ref={scrollRef} className='flex-1 w-full h-full flex flex-row justify-start items-center overflow-x-auto whitespace-nowrap scrollbar-hide'>
                    <a href='#popular_items' className='w-fit h-full px-5 py-2 cursor-pointer text-gray-500 hover:text-black'>
                        <h1 className='text-lg text-nowrap text-center font-roboto'>Popular</h1>
                    </a> 
                    {restaurant.item_categories.map(category => (
                        <a href={`#${category.name.toLowerCase()}`} className='w-fit h-full px-5 py-2 cursor-pointer text-gray-500 hover:text-black' key={category.name}>
                            <h1 className='text-lg text-nowrap text-center font-roboto'>{category.name}</h1>
                        </a>
                    ))}
                    {sideItems.length > 0 && (
                        <a href='#side_items' className='w-fit h-full px-5 py-2 cursor-pointer text-gray-500 hover:text-black'>
                            <h1 className='text-lg text-nowrap text-center font-roboto'>Side Items</h1>
                        </a>
                    )}
                </div>
                {isOverflowing && ( 
                    <button className='w-fit h-fit cursor-pointer ml-1' onClick={() => handleScroll('right')}>
                        <span className='text-2xl cursor-pointer text-neutral-700 hover:text-neutral-800'>
                            <IoIosArrowDropright />
                        </span>
                    </button>
                )}
            </div>
            <div className='w-full flex-1 px-32 pt-12'>
                {isSearching ? (
                    searchedItems.length > 0 ? (
                        <div className='grid grid-cols-3 auto-rows-auto w-fit h-fit gap-x-6 gap-y-4'>
                            {searchedItems.map((item) => (
                                <div
                                key={item.uuid}
                                className='w-[20rem] h-32 px-4 py-2 mb-5 flex justify-between items-center border-[1px] border-neutral-400 rounded-xl transition-transform duration-200 hover:border-neutral-500 relative'
                                >
                                    <div className='w-4/5 h-full text-left overflow-hidden'>
                                        <h1 className='text-lg font-roboto font-semibold truncate text-neutral-700 cursor-default'>{item.name}</h1>
                                        <h1 className='text-xl text-nowrap font-hedwig text-neutral-700 cursor-default'>Rs. {item.price}</h1>
                                        {item.is_available ? (
                                            <>
                                                <h1 className='text-sm font-roboto text-gray-600 truncate cursor-default'>{item.description}</h1>
                                                {isInCart(item) ? (
                                                    <h1 className='text-lg font-roboto text-gray-600 cursor-default'>Added to cart</h1>
                                                ) : (
                                                    <button onClick={() => handleAdd(item)} className='w-6 h-6 rounded-2xl border-2 border-neutral-300 flex justify-center items-center mt-2 hover:border-neutral-400'>
                                                        <span className='text-lg text-neutral-500'>
                                                            <FiPlus />
                                                        </span>
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <h1 className='text-md font-roboto font-semibold text-red-700 cursor-default bg-red-400 w-fit px-2 rounded-lg mt-4'>Not Available</h1>
                                            </>
                                        )}
                                    </div>
                                    <div className='w-1/2 h-4/5 flex justify-center items-center'>
                                        <img src={item.image} alt="Image not found" className='w-full h-full rounded-xl object-cover' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='w-full h-full flex justify-center items-center'>
                            <h1 className='text-3xl font-semibold font-poppins text-neutral-800 cursor-default'>No results found</h1>
                        </div>
                    )
                ) : (
                    <>
                        <div id='popular_items' className='w-full flex flex-col justify-start items-start mb-12 scroll-mt-28'>
                            <h1 className='text-3xl font-semibold font-hedwig text-neutral-800 uppercase mb-4'>POPULAR</h1>
                            <div className='grid grid-cols-3 auto-rows-auto w-fit h-fit gap-x-6 gap-y-4'>
                                {popularItems.map((item) => (
                                    <div
                                        key={item.uuid}
                                        className='w-[20rem] h-32 px-4 py-2 flex justify-between items-center border-[1px] border-neutral-400 rounded-xl transition-transform duration-200 hover:border-neutral-500 relative'
                                    >
                                        <div className='w-4/5 h-full text-left overflow-hidden'>
                                            <h1 className='text-lg font-roboto font-semibold truncate text-neutral-700 cursor-default'>{item.name}</h1>
                                            <h1 className='text-xl text-nowrap font-hedwig text-neutral-700 cursor-default'>Rs. {item.price}</h1>
                                            {item.is_available ? (
                                                <>
                                                    <h1 className='text-sm font-roboto text-gray-600 truncate cursor-default'>{item.description}</h1>
                                                    {isInCart(item) ? (
                                                        <h1 className='text-lg font-roboto text-gray-600 cursor-default'>Added to cart</h1>
                                                    ) : (
                                                        <button onClick={() => handleAdd(item)} className='w-6 h-6 rounded-2xl border-2 border-neutral-300 flex justify-center items-center mt-2 hover:border-neutral-400'>
                                                            <span className='text-lg text-neutral-500'>
                                                                <FiPlus />
                                                            </span>
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <h1 className='text-md font-roboto font-semibold cursor-default text-red-700 bg-red-400 w-fit px-2 rounded-lg mt-4'>Not Available</h1>
                                                </>
                                            )}
                                        </div>
                                        <div className='w-1/2 h-4/5 flex justify-center items-center'>
                                            <img src={item.image} alt="Image not found" className='w-full h-full rounded-xl object-cover' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {restaurant.item_categories.map((category) => (
                            <div
                            id={category.name.toLowerCase()}
                            key={category.name}
                            className='w-full flex flex-col justify-start items-start mb-12 scroll-mt-28'
                            >
                                <h1 className='text-3xl font-semibold font-poppins text-neutral-800 uppercase mb-4'>{category.name}</h1>
                                <div className='grid grid-cols-3 auto-rows-auto w-fit h-fit gap-x-6 gap-y-4'>
                                    {restaurant.menu_items
                                    .filter((item) => item.category === category.name)
                                    .map((item) => (
                                        <div
                                        key={item.uuid}
                                        className='w-[20rem] h-32 px-4 py-2 flex justify-between items-center border-[1px] border-neutral-400 rounded-xl transition-transform duration-200 hover:border-neutral-500 relative'
                                        >   
                                            <div className='w-4/5 h-full text-left overflow-hidden'>
                                                <h1 className='text-lg font-roboto font-semibold text-neutral-700 truncate cursor-default'>{item.name}</h1>
                                                <h1 className='text-xl text-nowrap font-hedwig text-neutral-700 cursor-default'>Rs. {item.price}</h1>
                                                {item.is_available ? (
                                                    <>
                                                        <h1 className='text-sm font-roboto text-gray-600 truncate cursor-default'>{item.description}</h1>
                                                        {isInCart(item) ? (
                                                            <h1 className='text-lg font-roboto text-gray-600 cursor-default'>Added to cart</h1>
                                                        ) : (
                                                            <button onClick={() => handleAdd(item)} className='w-6 h-6 rounded-2xl border-2 border-neutral-300 flex justify-center items-center mt-2 hover:border-neutral-400'>
                                                                <span className='text-lg text-neutral-500'>
                                                                    <FiPlus />
                                                                </span>
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <h1 className='text-md font-roboto font-semibold text-red-700 bg-red-400 w-fit px-2 rounded-lg mt-4 cursor-default'>Not Available</h1>
                                                    </>
                                                )}
                                            </div>
                                            <div className='w-1/2 h-4/5 flex justify-center items-center'>
                                                <img src={item.image} alt="Image not found" className='w-full h-full rounded-xl object-cover' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {sideItems.length > 0 && (
                            <div id='side_items' className='w-full flex flex-col justify-start items-start mb-12 scroll-mt-28'>
                                <h1 className='text-3xl font-semibold font-hedwig text-neutral-800 uppercase mb-4'>SIDE ITEMS</h1>
                                <div className='grid grid-cols-3 auto-rows-auto w-fit h-fit gap-x-6 gap-y-4'>
                                    {sideItems.map((item) => (
                                        <div
                                            key={item.uuid}
                                            className='w-[20rem] h-32 px-4 py-2 flex justify-between items-center border-[1px] border-neutral-400 rounded-xl cursor-pointer transition-transform duration-200 hover:border-neutral-500 relative'
                                        >
                                            <div className='w-4/5 h-full text-left overflow-hidden'>
                                                <h1 className='text-lg font-roboto font-semibold truncate text-neutral-700'>{item.name}</h1>
                                                <h1 className='text-xl text-nowrap font-hedwig text-neutral-700'>Rs. {item.price}</h1>
                                                {item.is_available ? (
                                                    <>
                                                        <h1 className='text-sm font-roboto text-gray-600 truncate'>{item.description}</h1>
                                                        {isInCart(item) ? (
                                                            <h1 className='text-lg font-roboto text-gray-600'>Added to cart</h1>
                                                        ) : (
                                                            <button onClick={() => handleAdd(item)} className='w-6 h-6 rounded-2xl border-2 border-neutral-300 flex justify-center items-center mt-2 hover:border-neutral-500'>
                                                                <span className='text-lg text-neutral-500'>
                                                                    <FiPlus />
                                                                </span>
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <h1 className='text-md font-roboto font-semibold text-red-700 bg-red-400 w-fit px-2 rounded-lg mt-4'>Not Available</h1>
                                                    </>
                                                )}
                                            </div>
                                            <div className='w-1/2 h-4/5 flex justify-center items-center'>
                                                <img src={item.image} alt="Image not found" className='w-full h-full rounded-xl object-cover' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default RestaurantMenu
