import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const AuthGuard = () => {
  const { userToken } = useSelector((state) => state.auth);

  return userToken ? <Outlet /> : <Navigate to='/' replace />;
};

export default AuthGuard;
