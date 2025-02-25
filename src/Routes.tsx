import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';
import { Header } from './Header';
import { CartProvider } from './context/CartContext';
import { useUser } from './context/UserContext';
import { DesktopMenu } from './menu/DesktopMenu';
import { MobileMenu } from './menu/MobileMenu';
import { RecipeDetail } from './recipes/RecipeDetail';
import { RecipeGrid } from './recipes/RecipeGrid';
import { Calendar } from './calendar/Calendar';
import { NewRecipe } from './editRecipe/NewRecipe';
import { Profile } from './profile/Profile';
import { Login } from './Login';
import { SnackbarProvider } from './context/SnackbarContext';
import { EditRecipe } from './editRecipe/EditRecipe';
import { Cart } from './cart/Cart';

export const AppRoutes = () => {
  const { token } = useUser();

  return (
    <SnackbarProvider>
      <CartProvider>
        <Router>
          <Header />
          {!!token ? isMobileOnly ? <MobileMenu /> : <DesktopMenu /> : <></>}
          <Routes>
            {!!token ? <>
              <Route path="/" element={<RecipeGrid />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/newRecipe" element={<NewRecipe />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/editRecipe/:id" element={<EditRecipe />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="*" element={<Navigate to="/" />} /></> 
            : 
              <>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            }

          </Routes>
        </Router>
      </CartProvider>
    </SnackbarProvider>
  );
};