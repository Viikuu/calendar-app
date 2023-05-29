import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {toast, ToastContainer, ToastOptions} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './auth.css';
import { mainRoute } from '../../utils/roots';

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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if(handleValidation()){
			const {password, email} = values;
			const {data} = await axios.post([mainRoute, 'auth'].join(''), JSON.stringify({
				email,
				password,
			}), {
				headers: {
					"Content-Type": "application/json",
				}
			});
			if(data.status === false) {
				toast.error(data.message,toastOptions);
			}
			if(data.status === true) {
				navigate('/');
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
					type="text"
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