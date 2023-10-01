import React from 'react'
import { Content, Props } from './styles'
import HomePage from './pages/File Manager'
import AboutPage from './pages/About'
import SettingsPage from './pages/Settings'

const Pagination: React.FC<Props> = ({setPage})=>{

    // Set pages using switch
    var page = null
    switch(setPage){
        case 'file-manager':
            page = <HomePage visible={true} />
            break
        case 'about':
            page = <AboutPage visible={true} />
            break
        case 'settings':
            page = <SettingsPage visible={true} />
            break
    }

    return(
        <Content>            
            <div className='scrollable'>
                {page}
            </div>
        </Content>
    )
}

export default Pagination