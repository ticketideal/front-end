import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FieldError } from "react-hook-form";

interface AppInputProps {
  id: string;
  name: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  className?: string;

  // React Hook Form support
  register?: any;
  error?: FieldError;

  // Controlled usage (optional)
  value?: string | number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AppInput: React.FC<AppInputProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  className = "",
  register,
  error,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...(register ? register(name) : { name, value, onChange })}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
