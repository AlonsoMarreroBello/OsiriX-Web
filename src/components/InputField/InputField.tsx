import { InputFieldProps } from "../../interfaces/InputField.interface";
import styles from "./InputField.module.css";

const InputField = ({ label, id, ...props }: InputFieldProps) => {
  if (props.as === "textarea") {
    return (
      <div className={styles.inputGroup}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <textarea id={id} className={styles.input} {...props} />
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
