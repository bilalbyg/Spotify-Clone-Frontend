import {  Navigate } from 'react-router-dom'
import Content from './components/Content'
import ApplicationContainer from './components/ApplicationContainer'

const PrivateRoutes = () => {
    let auth = {'user': localStorage.getItem("currentUser")}
    return(
        auth.user!== null ? <ApplicationContainer/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes