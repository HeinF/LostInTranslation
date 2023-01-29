import { useState } from "react";
import { useForm } from "react-hook-form";

const Translate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const inputConfig = {
    required: true,
    maxLength: 40,
    pattern: /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
  };
  const [tranIn, setTranIn] = useState(null);
  const onSubmit = ({ translation }) => {
    console.log(translation);
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
        <button type="submit">Translate</button>
      </form>
    </>
  );
};

export default Translate;
