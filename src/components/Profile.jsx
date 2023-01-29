import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLocalUser, deleteHistory } from "../reducers/userSlice";
import { useEffect, useState } from "react";
import { DELETE_HISTORY_FAILED } from "../const/index";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const [history, setHistory] = useState([]);

  const handleDelete = () => {
    dispatch(deleteHistory());
  };

  useEffect(() => {
    dispatch(checkLocalUser());
    if (user.storedLocal === false) {
      navigate("/");
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (user.translations.length > 9) {
      setHistory(user.translations.slice(-10));
    } else {
      setHistory(user.translations);
    }
  }, [user, setHistory]);

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
