import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {toast, ToastContainer, ToastOptions} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './auth.css';
import { mainRoute } from '../../utils/roots';
import { userData } from '../../utils/types';

export function Login() {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		email: '',
		password: '',
	});

	const toastOptions: ToastOptions = {
		position: 'top-right',
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: 'dark'
	};

	useEffect(() => {
		async function chechAuth():Promise<boolean> {
			try {
				const { data } = await axios.get<userData>([mainRoute, 'auth'].join('/') , { withCredentials: true });
				return true;
			} catch (error) {
				return false;
			}
		}
		chechAuth().then(value => value && navigate('/') ) 
		
  }, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if(handleValidation()){
			const { password, email } = values;
			try {
				const {data} = await axios.post<userData>([mainRoute, 'auth','login'].join('/'), JSON.stringify({
					email,
					password,
				}), {
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				});
				if (data.user) {
					navigate('/');
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					if (error.response) {
						toast.error(error.response.data.message, toastOptions);
					} else {
						toast.error(error.message, toastOptions);
					}
				} else {
					toast.error(['unexpected error: ', error].join(' '), toastOptions);
				}
			}
		}

	};

	const handleValidation = () => {
		const {password, email} = values;
		if (password === "") {
			toast.error('Password and Email is required', toastOptions);
			return false;
		} else if (email.length < 3) {
			toast.error('Password and Email is required', toastOptions);
			return false;
		}
		else {
			return true;
		}
	};

	const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setValues({...values, [event.target.name]: event.target.value});
	};
	return (
		<div className='FormContainer'>
			<form onSubmit={handleSubmit}>
				<div className="form-brand">
					<h1>Login</h1>
				</div>
				<input
					type="email"
					placeholder="Email"
					name="email"
					onChange={(event) => handleChange(event)}
					min="3"
				/>
				<input
					type="password"
					placeholder="Password"
					name="password"
					onChange={(event) => handleChange(event)}
				/>
				<button type="submit">Login</button>
				<span>
				Don't have an account? <Link to={'/register'}>Register</Link>
				</span>
			</form>
			<ToastContainer/>
		</div>
	)
}