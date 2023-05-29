import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {toast, ToastContainer, ToastOptions} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { mainRoute } from '../../utils/roots';

export function Register() {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		email: '',
		password: '',
		confirmPassword: ''
	});

	const toastOptions: ToastOptions = {
		position: 'bottom-right',
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: 'dark'
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if(handleValidation()){
			const {password, email} = values;
			const {data} = await axios.post(mainRoute, JSON.stringify({
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
		const {password, confirmPassword, email} = values;
		if (password !== confirmPassword) {
			toast.error('Password and confirm password must be the same', toastOptions);
			return false;
		} else if (password.length < 8) {
			toast.error('Password must be at least 8 characters',  toastOptions);
			return false;
		} else if (email === "") {
			toast.error('Email is required', toastOptions);
			return false;
		} else {
			return true;
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({...values, [event.target.name]: event.target.value});
	};
	return (
		<>
			<div className='FormContainer'>
				<form onSubmit={handleSubmit}>
					<div className="form-brand">
						<h1>Register</h1>
					</div>
					<input
						type="email"
						placeholder="Email"
						name="email"
						onChange={(event) => handleChange(event)}
					/>
					<input
						type="password"
						placeholder="Password"
						name="password"
						onChange={(event) => handleChange(event)}
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						name="confirmPassword"
						onChange={(event) => handleChange(event)}
					/>
					<button type="submit">Create User</button>
					<span>
					Already have an account? <Link to={'/login'}>Login</Link>
				</span>
				</form>
			</div>
			<ToastContainer/>
		</>
	)
}