import { useGetCurrentUserQuery } from '../redux/api/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/authSlice';
import { useEffect } from 'react';

const useAuth = () => {
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Skip the query if there's no token to avoid unnecessary API calls
  const { data, isLoading, isError, error, refetch } = useGetCurrentUserQuery(undefined, {
    skip: !userToken,
    refetchOnMountOrArgChange: true,
  });

  // Handle 401 Unauthorized errors
  useEffect(() => {
    if (error?.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  // Ensure we access the correct data structure
  const user = data?.data; 
  const role = user?.role?.toLowerCase();

  // Authentication status helpers
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const hasRole = (...roles) => roles.map(r => r.toLowerCase()).includes(role);

  return { 
    user, 
    role, 
    isLoading, 
    isError, 
    error, 
    isAdmin, 
    isStaff, 
    hasRole, 
    refetch, 
    token: userToken 
  };
};

export default useAuth;