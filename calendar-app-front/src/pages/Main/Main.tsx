import axios from 'axios';
import { userData } from '../../utils/types';
import './Main.css'
import { mainRoute } from '../../utils/roots';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataPicker } from '../../components/DataPicker';
import { Logout } from '../../components/Logout/Logout';

export function Main() {
	const [loading, setLoading] = useState(true);
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
		chechAuth().then(value => {
			if (value) { 
				navigate('/login')
			} else {
				setLoading(false);
			}
		}); 
		
  }, []);

	return <>
		{loading ? <>
			<div className="loading">
			</div>
			</>
			: (<>
			<Logout />
				<DataPicker />
				</>
		)}
  </>

}