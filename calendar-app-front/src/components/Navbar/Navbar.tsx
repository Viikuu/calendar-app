import React, { useState } from 'react';
import './Navbar.css';
import { Logout } from './Logout/Logout';
import { Modal } from '../Modal/Modal';

export const Navbar: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className='navbar'>
      <div></div>
      <div></div>
      <div className='navButtons'>
        <button  onClick={e => {
            setShow(true);
         }}
          > Options </button>
        <Logout />
      </div>
      <Modal show={show} setShow={setShow}>
        <div className='setOpts'>
          <div className='opt'>
            <label>Country</label>
            <select value={1} onChange={(e)=>{1}} id={"1231421241"}  name="minute">
            {[...Array(60).keys()].map((country,index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
          </div>
          <div className='opt'>
            <label>City</label>
            <select value={1} onChange={(e)=>{1}} id={"1231421241"}  name="minute">
            {[...Array(60).keys()].map((city,index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          </div>
          <div className='opt'>
            <label>Show weather</label>
            <input type="checkbox" id='weather' />
          </div>
          <div className='opt'>
            <label>Show holidays</label>
            <input type="checkbox" id='holidays' />
          </div>
          
        </div>
         

      </Modal>
    </div>
  )
}