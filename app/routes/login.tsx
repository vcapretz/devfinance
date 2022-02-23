import classNames from "classnames";
import { ActionFunction, useActionData } from "remix";
import { json, useSearchParams } from "remix";
import { db } from "~/utils/db.server";
import { createUserSession, login, register } from "~/utils/session.server";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Nome de usuário precisa conter pelo menos 3 caracteres`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Senha precisa conter pelo menos 6 caracteres`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";

  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });

      if (!user) {
        return badRequest({
          fields,
          formError: `Usário e/ou senha estão incorretos.`,
        });
      }

      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });

      if (userExists) {
        return badRequest({
          fields,
          formError: `Usuário ${username} já existe`,
        });
      }

      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Erro ao criar usuário.`,
        });
      }

      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();

  return (
    <div className="flex items-center  mx-auto justify-center min-h-screen">
      <div className="flex flex-col max-w-lg w-full bg-white rounded p-6">
        <h1 className="text-cyan-900 text-xl font-medium mb-6 text-center">
          Login
        </h1>

        <form
          method="post"
          aria-describedby={
            actionData?.formError ? "form-error-message" : undefined
          }
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />

          <fieldset className="flex justify-center gap-2 items-center mb-8">
            <legend className="sr-only">Login or Register?</legend>

            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>

            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Registrar
            </label>
          </fieldset>

          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              id="username-input"
              placeholder="Nome de usuário"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-describedby={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
              className={classNames("rounded border p-2 w-full", {
                "border-red-600": actionData?.fieldErrors?.username,
              })}
            />

            {actionData?.fieldErrors?.username ? (
              <p
                className="text-xs text-red-600"
                role="alert"
                id="username-error"
              >
                {actionData?.fieldErrors.username}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <input
              id="password-input"
              name="password"
              type="password"
              className={classNames("rounded border p-2 w-full", {
                "border-red-600": actionData?.fieldErrors?.password,
              })}
              placeholder="Senha"
              defaultValue={actionData?.fields?.password}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.password) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />

            {actionData?.fieldErrors?.password ? (
              <p
                className="text-xs text-red-600"
                role="alert"
                id="password-error"
              >
                {actionData?.fieldErrors.password}
              </p>
            ) : null}
          </div>

          <div id="form-error-message" className="mb-4">
            {actionData?.formError ? (
              <p className="font-xs text-red-600" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded text-white bg-green-800 hover:bg-green-700 w-full"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
