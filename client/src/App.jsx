import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './components/IndexPage'
import LoginPage from './components/LoginPage'
import Layout from './Layout'
import RegisterPage from './components/RegisterPage'
import ProfilePage from './components/ProfilePage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import LocationPage from './components/LocationPage'
import LocationsFormPage from './components/LocationsFormPage'
import SingleLocationPage from './components/SingleLocationPage'
import SingleBookingPage from './components/SingleBookingPage'
import BookingsPage from './components/BookingsPage'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />}/>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/account/" element={<ProfilePage />}></Route>
          <Route path="/account/locations" element={<LocationPage />}></Route>
          <Route path="/account/locations/:id" element={<LocationsFormPage />}></Route>
          <Route path="/account/locations/new" element={<LocationsFormPage />}></Route>
          <Route path="/locations/:id" element={<SingleLocationPage />}></Route>
          <Route path="/account/bookings/:id" element={<SingleBookingPage />}></Route>
          <Route path="/account/bookings" element={<BookingsPage />}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
