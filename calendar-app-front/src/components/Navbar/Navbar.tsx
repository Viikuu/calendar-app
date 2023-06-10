import React, { useState, useContext } from 'react';
import './Navbar.css';
import { Logout } from './Logout/Logout';
import { Modal } from '../Modal/Modal';
import axios from 'axios';
import { mainRoute } from '../../utils/roots';
import { UserContext, userContextType } from '../../pages/Main/Main';
import { useEffect } from 'react';
import { countriesType, userData } from '../../utils/types';
import {toast, ToastContainer, ToastOptions} from 'react-toastify';
import { AddEvent } from '../AddEvent/AddEvent';

const toastOptions: ToastOptions = {
		position: 'top-right',
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: 'dark'
	};

export const Navbar: React.FC = () => {
  const { user, setUser } = useContext(UserContext) as userContextType;
  const [showOpts, setShowOpts] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [countries, setCountries] = useState<Array<countriesType>>([]);
  const [city, setCity] = useState<string>('');

  useEffect(() => { 
    setCity(user.city);
  }, []);

  return (
    <div className='navbar'>
      <div></div>
      <div></div>
      <div className='navButtons'>
        <button className='opts' onClick={async e => {
          setShowMenu(true);
        }}
        > + Add Event Menu </button>

        <button className='opts' onClick={async e => {
          setShowOpts(true);
          const { data: { countries } } = await axios.get<{ countries: Array<countriesType> }>([mainRoute, 'countries'].join('/'), { withCredentials: true });

          setCountries(countries);
        }}
        > Options </button>

        <Logout />
      </div>
      <Modal show={showMenu} setShow={setShowMenu}>
          <AddEvent setShow={setShowMenu}/>
          <ToastContainer/>
      </Modal>

      <Modal show={showOpts} setShow={setShowOpts}>
        <div className='setOpts'>
          <div className='opt'>
            <label>Holidays Country</label>
            <select value={user.country} onChange={async (e) => {
              setUser({ ...user, country: e.target.value });
              await axios.put<userData>([mainRoute, 'user'].join('/'), { country: e.target.value }, { withCredentials: true });
            }} name="country">
              {countries.map((country: countriesType, index: number) => (
                <option key={index} value={country.name}>{country.name}</option>
              ))}
            </select>
          </div>
          <div className='opt'>
            <label>Weather City</label>
            <input type="text" id='city' value={city} onChange={async (e) => {
              setCity(e.target.value);
            }} onBlur={async (e) => {
              if (city) {
                try {
                  await axios.put<userData>([mainRoute, 'user'].join('/'), { city: e.target.value }, { withCredentials: true });
                  setUser({ ...user, city });
                } catch {
                  toast.error("Given city does not exist!", toastOptions);
                  setCity(user.city);
                }
              } else {
                setCity(user.city);
              }
            }} />
          </div>
          <div className='opt'>
            <label>Show weather</label>
            <input type="checkbox" id='weather' defaultChecked={user.showWeather} onChange={async () => {
              setUser({...user, showWeather: !user.showWeather})
              await axios.put<userData>([mainRoute, 'user'].join('/'), { showWeather: !user.showWeather }, { withCredentials: true });
            }} />
          </div>
          <div className='opt'>
            <label>Show holidays</label>
            <input type="checkbox" id='holidays' defaultChecked={user.showHolidays} onChange={async () => {
              setUser({ ...user, showHolidays: !user.showHolidays })
              await axios.put<userData>([mainRoute, 'user'].join('/'), { showHolidays: !user.showHolidays }, { withCredentials: true });
            }} />
          </div>
          <ToastContainer/>
        </div>
      </Modal>
    </div>
  )
}