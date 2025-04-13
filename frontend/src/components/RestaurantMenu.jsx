import React, { useRef, useState, useEffect, useContext } from 'react';
import search from '../assets/search.svg';
import arrow_right from '../assets/arrow_right.svg';
import arrow_left from '../assets/arrow_left.svg';
import add from '../assets/add.svg';
import close from '../assets/close.svg';
import CartContext from '../context/CartContext';


const RestaurantMenu = ({ restaurant }) => {

    const scrollRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const popularTagElement = <h1 className='text-[0.7rem] text-green-600 py-[5px] px-2 bg-green-300 font-semibold font-roboto rounded-lg absolute bottom-2 left-12'>POPULAR</h1>;
    let popularItems = restaurant.menu_items.sort((a, b) => b.popularity - a.popularity).slice(0, 5);
    const [isSearching, setIsSearching] = useState(false);
    const [searchedItems, setSearchedItems] = useState([]);
    let { addItemToCart } = useContext(CartContext);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current) {
                const { scrollWidth, clientWidth } = scrollRef.current
                setIsOverflowing(scrollWidth > clientWidth);
            }
        };
        checkOverflow()

        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [restaurant])

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -100 : 100,
                behavior: 'smooth'
            });
        }
    };

    const isItemPopular = (item) => {
        return popularItems.some(popularItem => popularItem.id === item.id && popularItem.name === item.name);
    }

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

    return (
        <div className='relative min-h-[60rem] w-full mt-6 flex flex-col justify-start items-center'>
            <div className='sticky z-10 top-12 w-full h-12 border-b-2 border-gray-200 bg-white flex justify-start items-center flex-row'>
                <form method='get' action="" onSubmit={(e) => {e.preventDefault()}} className='relative w-[30%]'>
                    <div className='w-[80%] h-8 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                        <img src={search} alt="" className='absolute top-[20%] left-[4%]'/>
                        <button type='button' className={`absolute top-[20%] right-[4%] ${!isSearching ? "hidden" : ""}`} onClick={() => {setIsSearching(false); setSearchedItems([]);}}>
                            <img src={close} alt="X"/>
                        </button>
                        <input onChange={handleSearching} type="text" name='search' className='w-full h-full border-2 border-gray-300 rounded-2xl pl-8 focus:shadow-lg outline-gray-400'/>
                    </div>
                </form>
                {isOverflowing && ( 
                    <button className='border-none w-fit h-fit cursor-pointer' onClick={() => handleScroll('left')}>
                        <img src={arrow_left} alt="" className='rounded-2xl w-8 h-8 cursor-pointer hover:bg-gray-100'/>
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
                </div>
                {isOverflowing && ( 
                    <button className='w-fit h-fit cursor-pointer ml-1' onClick={() => handleScroll('right')}>
                        <img src={arrow_right} alt="" className='rounded-2xl w-8 h-8 cursor-pointer hover:bg-gray-100'/>
                    </button>
                )}
            </div>
            <div className='w-full flex-1 px-32 pt-12'>
                {isSearching ? (
                    searchedItems.length > 0 ? (
                        <div className='grid grid-cols-3 auto-rows-auto w-fit h-fit gap-x-6 gap-y-4'>
                            {searchedItems.map((item) => (
                                <div
                                key={item.id}
                                className='w-[20rem] h-32 px-4 py-2 mb-5 flex justify-between items-center border-2 border-gray-200 rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105 relative'
                                >
                                    <div className='w-4/5 h-full text-left overflow-hidden'>
                                        <h1 className='text-lg font-roboto truncate'>{item.name}</h1>
                                        <h1 className='text-xl text-nowrap font-roboto font-semibold text-green-500'>${item.price}</h1>
                                        {item.is_available ? (
                                            <>
                                                <h1 className='text-sm font-roboto text-gray-600 truncate'>{item.description}</h1>
                                                <button onClick={() => addItemToCart(item)} className='w-6 h-6 rounded-2xl border-2 border-gray-300 flex justify-center items-center mt-2 hover:bg-gray-100'>
                                                    <img src={add} alt="add" className='w-full h-full' />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h1 className='text-md font-roboto font-semibold text-red-700 bg-red-400 w-fit px-2 rounded-lg'>Not Available</h1>
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
                            <h1 className='text-3xl font-semibold font-poppins text-neutral-800'>No results found</h1>
                        </div>
                    )
                ) : (
                    <>
                        <div id='popular_items' className='w-full flex flex-col justify-start items-start mb-12 scroll-mt-28'>
                            <h1 className='text-3xl font-semibold font-poppins text-neutral-800 uppercase mb-4'>POPULAR</h1>
                            <div className='grid grid-cols-3 auto-rows-auto w-fit h-fit gap-x-6 gap-y-4'>
                                {popularItems.map((item) => (
                                    <div
                                    key={item.id}
                                    className='w-[20rem] h-32 px-4 py-2 flex justify-between items-center border-2 border-gray-200 rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105 relative'
                                    >
                                        <div className='w-4/5 h-full text-left overflow-hidden'>
                                            <h1 className='text-lg font-roboto truncate'>{item.name}</h1>
                                            <h1 className='text-xl text-nowrap font-roboto font-semibold text-green-500'>${item.price}</h1>
                                            {item.is_available ? (
                                                <>
                                                    <h1 className='text-sm font-roboto text-gray-600 truncate'>{item.description}</h1>
                                                    <button onClick={() => addItemToCart(item)} className='w-6 h-6 rounded-2xl border-2 border-gray-300 flex justify-center items-center mt-2 hover:bg-gray-100'>
                                                        <img src={add} alt="add" className='w-full h-full' />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <h1 className='text-md font-roboto font-semibold text-red-700 bg-red-400 w-fit px-2 rounded-lg'>Not Available</h1>
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
                                        key={item.id}
                                        className='w-[20rem] h-32 px-4 py-2 flex justify-between items-center border-2 border-gray-200 rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105 relative'
                                        >   
                                            {item.is_available && isItemPopular(item) ? popularTagElement : null}
                                            <div className='w-4/5 h-full text-left overflow-hidden'>
                                                <h1 className='text-lg font-roboto truncate'>{item.name}</h1>
                                                <h1 className='text-xl text-nowrap font-roboto font-semibold text-green-500'>${item.price}</h1>
                                                {item.is_available ? (
                                                    <>
                                                        <h1 className='text-sm font-roboto text-gray-600 truncate'>{item.description}</h1>
                                                        <button onClick={() => addItemToCart(item)} className='w-6 h-6 rounded-2xl border-2 border-gray-300 flex justify-center items-center mt-2 hover:bg-gray-100'>
                                                            <img src={add} alt="add" className='w-full h-full' />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h1 className='text-md font-roboto font-semibold text-red-700 bg-red-400 w-fit px-2 rounded-lg'>Not Available</h1>
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
                    </>
                )}
            </div>
        </div>
    )
}

export default RestaurantMenu
