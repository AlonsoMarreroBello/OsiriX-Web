export interface CommonFieldProps {
  label: string;
  id: string;
}

export interface InputAsProps
  extends CommonFieldProps,
    Omit<React.ComponentPropsWithoutRef<"input">, "id"> {
  as?: "input"; // Discriminador: si 'as' es 'input' o no se provee
}

export interface TextareaAsProps
  extends CommonFieldProps,
    Omit<React.ComponentPropsWithoutRef<"textarea">, "id"> {
  as: "textarea";
}

export type InputFieldProps = InputAsProps | TextareaAsProps;
