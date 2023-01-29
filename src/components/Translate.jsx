import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addTranslation, checkLocalUser } from "../reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignDisplay from "./SignDisplay";
import { ADD_TRANSLATION_FAILED } from "../const/index";

const inputConfig = {
  required: true,
  maxLength: 40,
  pattern: /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
};

const Translate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const [newestTranslation, setNewestTranslation] = useState(null);
  useEffect(() => {
    dispatch(checkLocalUser());
    if (user.storedLocal === false) {
      navigate("/");
    }
  }, [user, dispatch, navigate]);

  const onSubmit = ({ translation }) => {
    dispatch(addTranslation(translation));
    setNewestTranslation(translation);
  };

  const errorMessage = (() => {
    if (!errors.translation) {
      return null;
    }
    if (errors.translation.type === "required") {
      return <span>input some text to translate</span>;
    }
    if (errors.translation.type === "MaxLength") {
      return <span>Max 40 characters</span>;
    }
  })();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <label htmlFor="translation">Translation input:</label>
          <input type="text" {...register("translation", inputConfig)} />
          {errorMessage}
        </fieldset>
        <button type="submit" disabled={user.loading}>
          Translate
        </button>
      </form>
      {!user.loading && user.error === null && (
        <SignDisplay text={newestTranslation} />
      )}
      {user.error === ADD_TRANSLATION_FAILED && (
        <p>Error: Could not save translation</p>
      )}
      {user.loading && <p>Translating, please wait....</p>}
    </>
  );
};

export default Translate;
