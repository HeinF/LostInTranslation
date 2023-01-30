import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser, createUser, loadLocalUser } from "../reducers/userSlice";
import { USER_NOT_FOUND } from "../const/index";

// Configuration for react hook form to validate input
const usernameConfig = {
  required: true,
  minLength: 3,
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check for user in localstorage, but only on initial load (hence no dependency)
  useEffect(() => {
    dispatch(loadLocalUser());
  }, []);

  // If user is not found in the API, Redux will set a not found error. In that case we create a new user
  useEffect(() => {
    if (user.error === USER_NOT_FOUND) {
      dispatch(createUser(user.username));
    }
    //Redirect if a user is loaded from or has been stored in localstorage
    if (user.storedLocal === true) {
      navigate("Translate");
    }
  }, [user, dispatch, navigate]);
  // Gets Redux to try and fetch user from the API
  const onSubmit = ({ username }) => {
    dispatch(fetchUser(username));
  };

  // Error messages for display if react hook form validation is not met
  const errorMessage = (() => {
    if (!errors.username) {
      return null;
    }
    if (errors.username.type === "required") {
      return <span>Username is required</span>;
    }
    if (errors.username.type === "minLength") {
      return <span>Username must be at least 3 characters</span>;
    }
  })();

  // Render form and any error and loading messages
  return (
    <>
      <h1>Please type your username</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <label htmlFor="username">Username:</label>
          <input type="text" {...register("username", usernameConfig)} />
          {errorMessage}
        </fieldset>
        <button type="submit" disabled={user.loading}>
          Login
        </button>
        {user.loading && <p>Please wait...</p>}
      </form>
    </>
  );
};

export default Login;
