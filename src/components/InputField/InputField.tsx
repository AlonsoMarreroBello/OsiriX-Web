import styles from "./InputField.module.css";

interface CommonFieldProps {
  label: string;
  id: string;
}

interface InputAsProps
  extends CommonFieldProps,
    Omit<React.ComponentPropsWithoutRef<"input">, "id"> {
  as?: "input"; // Discriminador: si 'as' es 'input' o no se provee
}

interface TextareaAsProps
  extends CommonFieldProps,
    Omit<React.ComponentPropsWithoutRef<"textarea">, "id"> {
  as: "textarea";
}

// El tipo final de props es una unión de las dos anteriores
export type InputFieldProps = InputAsProps | TextareaAsProps;

const InputField = ({ label, id, ...props }: InputFieldProps) => {
  // Renderizado condicional basado en la prop 'as'
  if (props.as === "textarea") {
    return (
      <div className={styles.inputGroup}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <textarea
          id={id}
          className={styles.input} // Podrías querer un estilo diferente para textarea
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input id={id} className={styles.input} {...props} />
    </div>
  );
};

export default InputField;
