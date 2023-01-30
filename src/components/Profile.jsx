import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLocalUser, deleteHistory } from "../reducers/userSlice";
import { useEffect, useState } from "react";
import { DELETE_HISTORY_FAILED } from "../const/index";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  // history is used to display the text of up to 10 of the users most recent translations
  const [history, setHistory] = useState([]);
  // Handles delete button onClick
  const handleDelete = () => {
    dispatch(deleteHistory());
  };
  // Guard route by redirecting user if not logged in
  useEffect(() => {
    dispatch(checkLocalUser());
    if (user.storedLocal === false) {
      navigate("/");
    }
  }, [user, dispatch, navigate]);
  // If the user has more than 10 translations the set local state setHistory to the 10 latest translations
  // otherwise show all available translations
  useEffect(() => {
    if (user.translations.length > 10) {
      setHistory(user.translations.slice(-10));
    } else {
      setHistory(user.translations);
    }
  }, [user, setHistory]);

  // Renders loading, error messages and the delete button
  // Displays translation history by mapping them to text
  return (
    <>
      <p>
        Welcome to the profile page, here you can see your last 10 translations
      </p>
      {history.map((element, index) => (
        <p key={index}>{element}</p>
      ))}
      <button onClick={handleDelete}>Delete</button>
      {user.error === DELETE_HISTORY_FAILED && (
        <p>Could not delete translations</p>
      )}
      {user.loading && <p>Deleting translations, please wait...</p>}
    </>
  );
};

export default Profile;
