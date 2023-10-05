import React, { useContext, useRef, useState } from 'react'
import IconRoundedButton from '../IconRoundedButton'
import { ThemeContext } from 'styled-components'
import { shade } from 'polished'
import { Content, Props } from './styles'
import { 
    SvgIconFolder,
    SvgIconInfo,
    SvgIconSettings
} from '../SvgIcon'
import { Settings } from '../../Settings'

const LeftMenuBar: React.FC<Props> = ({
    setPageName,
    width,
    iconLeftPadding,
    textLeftPadding,
    defaultPage,
    buttonsIconSize
})=>{
    const svgIconMenuClosed = <SvgIconFolder size={'20'} />

    const menu = useRef<HTMLElement>(null)
    const logoImg = useRef<HTMLImageElement>(null)

    const theme = useContext(ThemeContext)

    function changePage(event: any){
        
        var page = event.target.getAttribute('page-name')
        var isActivated = event.target.getAttribute('is-ctivated')

        if(menu.current && isActivated === 'true') {
            var btns = menu.current.querySelectorAll('a')
            btns.forEach(btn => {
                btn.classList.remove('menu-active')
            });
        }

        if(isActivated === 'true'){
            event.target.setAttribute('class','menu-active')
        }

        if(page){
            setPageName(page)
        }
    }

    return(
        <Content
            setPageName={setPageName}
            width={width}
            iconLeftPadding={iconLeftPadding}
            textLeftPadding={textLeftPadding}
            ref={menu}
            data-tauri-drag-region>
            <nav  className='nav-menus'>
                <ul className='flex-1'>
                    <li>
                        <a className={defaultPage == 'home' ? 'menu-active' : ''}  is-ctivated='true' href="#" onClick={changePage} title='File Manager' page-name='file-manager'>
                            {svgIconMenuClosed}
                            <span>File Manager</span>
                        </a> 
                    </li>
                    <li>
                        <a className={defaultPage == 'about' ? 'menu-active' : ''} href="#" onClick={changePage} is-ctivated='true' title='Settings' page-name='settings'>
                            <SvgIconSettings size={buttonsIconSize ? buttonsIconSize : '24'} />
                            <span>Settings</span>
                        </a>
                    </li>
                </ul>
                <ul className='bottom-menus'>
                    <li>
                        <a className={defaultPage == 'about' ? 'menu-active' : ''} href="#" onClick={changePage} is-ctivated='true' title='About' page-name='about'>
                            <SvgIconInfo size={buttonsIconSize ? buttonsIconSize : '24'} />
                            <span>About</span>
                        </a>
                    </li>
                </ul>
                <div className='div-line'></div>
            </nav>
        </Content>
    )
}

export default LeftMenuBar