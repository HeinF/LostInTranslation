import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, createUser } from "../reducers/userSlice";
import { storageSave } from "../utils/storage";

const usernameConfig = {
  required: true,
  minLength: 3,
};

const Login = () => {
  // Hooks
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Local State
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [userInput, setUserInput] = useState("");
  const { user, loadingUser, error } = useSelector((state) => state);
  const dispatch = useDispatch();
  // Side Effects
  useEffect(() => {
    console.log("From useEffect");
    if (user.error === "User not found") {
      dispatch(createUser(user.username));
    }
    if (user.username !== null) {
      storageSave("translation-user", user);
    }
  }, [user, dispatch, user.username]);

  const onSubmit = ({ username }) => {
    setUserInput(username);
    dispatch(fetchUser(username));
  };

  // Render Functions
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

  return (
    <>
      <h1>Please type your username</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <label htmlFor="username">Username:</label>
          <input type="text" {...register("username", usernameConfig)} />
          {errorMessage}
        </fieldset>
        <button type="submit" disabled={user.loadingUser}>
          Login
        </button>
        {user.loadingUser && <p>Please wait...</p>}
      </form>
    </>
  );
};

export default Login;
