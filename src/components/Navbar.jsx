import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../reducers/userSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  // Handles onClick for the logout button
  const handleLogout = () => {
    dispatch(logOut());
  };
  // Displays navigation options
  // Conditionally displays Translate, Profile and Logout if user is logged in
  return (
    <>
      <nav>
        <ul>
          <li>Lost in Translation</li>
        </ul>

        {user.storedLocal && (
          <ul>
            <li>
              <NavLink to="/Translate">Translate</NavLink>
            </li>
            <li>
              <NavLink to="/Profile">Profile</NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default Navbar;
