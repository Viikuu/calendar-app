import axios from 'axios';
import { DataPicker } from '../../components/DataPicker'
import { userData } from '../../utils/types';
import './Main.css'
import { mainRoute } from '../../utils/roots';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Main() {
  const navigate = useNavigate();
  useEffect(() => {
		async function chechAuth():Promise<boolean> {
			try {
        const { data } = await axios.get<userData>([mainRoute, 'auth'].join('/'), { withCredentials: true });
				return false;
			} catch (error) {
				return true;
			}
		}
		chechAuth().then(value => value && navigate('/login') ) 
		
  }, []);

  return <>
    <DataPicker />
  </>

}