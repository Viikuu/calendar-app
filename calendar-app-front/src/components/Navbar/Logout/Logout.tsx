import React from 'react';
import './Logout.css';
import { mainRoute } from '../../../utils/roots';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Logout: React.FC = () => {
  const navigate = useNavigate();
  const logoutOnClick = async (event: React.MouseEvent<HTMLElement>) => {
    await axios.post([mainRoute, 'auth', 'logout'].join('/'),{}, { withCredentials: true });
    navigate('/login')
  }
  return (
      <button onClick={logoutOnClick} className='logoutButt'>Logout</button>
  )
}