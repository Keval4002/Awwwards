import React, {useEffect, useRef, useState} from 'react'
import Button from './Button'
import { TiLocationArrow } from 'react-icons/ti';
import {useWindowScroll} from 'react-use'
import gsap from 'gsap'

function Navbar() {

    const NavContainerRef = useRef(null);
    const audioElementRef = useRef(null);
    const [isAudioPlaying, setAudioPlaying] = useState(false);
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);

    const navItems = ['Nexus', 'Vault', 'Prologue', 'About', 'Contact'];

    const {y: currentScrollY} = useWindowScroll();

    const toggleAudioIndicator = ()=>{
        setAudioPlaying((prev)=>!prev);
        setIsIndicatorActive((prev)=>!prev);
    };

    useEffect(()=>{
        if(isAudioPlaying){
            audioElementRef.current.play();
        }else{
            audioElementRef.current.pause();
        }
    },[isAudioPlaying])

useEffect(() => {
    if (currentScrollY === 0) {
        setIsNavVisible(true);
        NavContainerRef.current?.classList.remove('floating-nav');
    } else if (currentScrollY - lastScrollY > 10) {
        // Scrolling down past threshold → hide
        setIsNavVisible(false);
        NavContainerRef.current?.classList.add('floating-nav');
    } else if (lastScrollY - currentScrollY > 10) {
        // Scrolling up past threshold → show
        setIsNavVisible(true);
        NavContainerRef.current?.classList.add('floating-nav');
    }

    setLastScrollY(currentScrollY);
}, [currentScrollY]);


    useEffect(() => {
        if (NavContainerRef.current) {
            gsap.to(NavContainerRef.current, {
            y: isNavVisible ? 0 : -80,
            opacity: isNavVisible ? 1 : 0,
            pointerEvents: isNavVisible ? 'auto' : 'none',
            duration: 0.4,
            ease: 'power2.out'
            });

        }
    }, [isNavVisible]);

  return (
    <div ref={NavContainerRef} className='fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6'>
        <header className='absolute top-1/2 w-full -translate-y-1/2'>
            <nav className='flex size-full items-center justify-between p-4'>
                <div className='flex item gap-7'>
                    <img src="/img/logo.png" alt="logo" className='w-10'/>
                    <Button 
                        id='product-button'
                        title="products"
                        rightIcon={<TiLocationArrow />}
                        containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
                    />
                </div>

                <div className='flex h-full items-center'>
                    <div className='hidden md:block'>
                        {navItems.map((item)=>(
                            <a key={item} href={`#${item.toLowerCase()}`} className='nav-hover-btn'>{item}</a>
                        ))}
                    </div>
                    <button className='ml-10 flex items-center space-x-0.5' onClick={toggleAudioIndicator}>
                        <audio src="/audio/loop.mp3" ref={audioElementRef} className='hidden' loop />
                            {[1,2,3,4].map((bar)=>(
                                <div
                                key={bar}
                                className={`indicator-line ${isIndicatorActive?'active':''}`} style={
                                    {animationDelay:`${bar*0.1}s`}
                                }/>
                            ))}
                    </button>
                </div>
            </nav>
        </header>
    </div>
  )
}
export default Navbar;
