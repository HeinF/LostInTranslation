import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addTranslation, checkLocalUser } from "../reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignDisplay from "./SignDisplay";
import { ADD_TRANSLATION_FAILED } from "../const/index";

// React form hook validation. Pattern only allows letters, one space between letters and no trailing or leading spaces
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
  // newestTranslation is used to store the newest user input and passed along as a prop to
  // SignDisplay component which then display the actual translation
  const [newestTranslation, setNewestTranslation] = useState(null);

  // Guard route by redirecting user if not logged in
  useEffect(() => {
    dispatch(checkLocalUser());
    if (user.storedLocal === false) {
      navigate("/");
    }
  }, [user, dispatch, navigate]);

  // Add translation to API and update newestTranslation in state
  const onSubmit = ({ translation }) => {
    dispatch(addTranslation(translation));
    setNewestTranslation(translation);
  };

  // Error rendering for react hook form. Note pattern error left out and replaced with instructions
  // as it was too distracting (appears when a space is typed after a word)
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

  // Render form, loading and error messages. Passes translation text to SignDisplay
  // component and renders it when the translation has been successfully stored in the API
  return (
    <>
      <p>
        You can type words that you would like to translate into sign language
        here
      </p>
      <p>
        Note that you can only type letters and use one space to separate
        characters or words. Please avoid leading and trailing spaces
      </p>
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
