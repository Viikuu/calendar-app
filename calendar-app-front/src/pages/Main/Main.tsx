import axios from 'axios';
import { DayEventI, userData, userType } from '../../utils/types';
import './Main.css'
import { mainRoute } from '../../utils/roots';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataPicker } from '../../components/DataPicker';
import { Navbar } from '../../components/Navbar/Navbar';
import { EventContextType } from '../../components/Calendar';

export const UserContext = createContext<userContextType|null>(null);
export const EventsContext = createContext<EventContextType | null>(null);

export type userContextType = {
	user: userType, 
	setUser: React.Dispatch<React.SetStateAction<userType>>,
}

export function Main() {
	const [user, setUser] = useState<userType | null>(null);
	const [events, setEvents] = useState<Array<DayEventI>>([]);
	const navigate = useNavigate();

  useEffect(() => {
		async function chechAuth(): Promise<void> {
			try {
				const { data } = await axios.get<userData>([mainRoute, 'auth'].join('/'), { withCredentials: true });
				setUser(data.user);
			} catch (error) {
				navigate('/login')
			}
		}

		(async () => {
			await chechAuth()
		})(); 
	}, []);
	

	return <>
		{!user ? <>
			<div className="loading">
			</div>
			</>
			: (<>
					<EventsContext.Provider value={{ events, setEvents }}>
						<UserContext.Provider value={{user,setUser} as userContextType}>
							<Navbar />
							<DataPicker />
						</UserContext.Provider>
					</EventsContext.Provider>
				</>
		)}
  </>

}