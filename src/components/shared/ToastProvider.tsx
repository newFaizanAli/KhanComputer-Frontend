import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const ToastProvider = () => {
    return (
        <ToastContainer position="bottom-right" autoClose={3000} />
    )
}

export default ToastProvider
