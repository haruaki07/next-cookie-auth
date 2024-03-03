"use client";

import { useFormState } from "react-dom";
import { login } from "./actions";

type FormState =
  | {
      message?: string;
    }
  | undefined;

export default function LoginPage() {
  const [state, formAction] = useFormState<FormState, FormData>(login, {});

  return (
    <form action={formAction} autoSave="off">
      {state?.message && <p>{state.message}</p>}

      <input type="text" name="username" autoSave="off" />
      <input type="password" name="password" autoSave="off" />
      <button type="submit">login</button>
    </form>
  );
}
