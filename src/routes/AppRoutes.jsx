import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PartnerLogin from '../pages/PartnerLogin'
import PartnerRegister from '../pages/PartnerRegister'
import UserLogin from '../pages/UserLogin'
import UserRegister from '../pages/UserRegister'
import Home from '../pages/general/Home'
import Dashboard from '../pages/general/Dashboard'
import Profile from '../pages/general/Profile'
import CreateFood from '../pages/general/CreateFood'
import Navbar from '../components/Navbar'

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/dashboard/create' element={<CreateFood/>}/>
        <Route path='/partner/:profile' element={<Profile/>}/>
      </Routes>
    </Router>
  )
}

export default AppRoutes
