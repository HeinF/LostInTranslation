import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLocalUser } from "../reducers/userSlice";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);

  useEffect(() => {
    dispatch(checkLocalUser());
    if (user.storedLocal === false) {
      navigate("/");
    }
  }, [user, dispatch, navigate]);

  return (
    <>
      <p>Profile</p>
    </>
  );
};

export default Profile;
