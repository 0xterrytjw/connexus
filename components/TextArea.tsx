import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type TextAreaProps = {
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorMessage?: string;
};
const TextArea = ({
  className,
  autoFocus,
  disabled,
  placeholder,
  value,
  onChange,
  errorMessage,
}: TextAreaProps) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Your bio</span>
      </label>
      <textarea
        className={classNames(
          "textarea-bordered textarea h-32",
          className ?? ""
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        disabled={disabled}
      ></textarea>
      <label className="label">
        <span className="label-text-alt text-red-500">{errorMessage}</span>
      </label>
    </div>
  );
};

export default TextArea;
