import { Route, Navigate } from 'react-router-dom';

const PrivateRouter = ({ element: Component, ...rest }) => {
  const firstLogin = localStorage.getItem('firstLogin');
  return firstLogin ? <Route {...rest} element={<Component />} /> : <Navigate to="/" />;
};

export default PrivateRouter;