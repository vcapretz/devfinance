import {
  ActionFunction,
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";

import styles from "./styles/app.css";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return { title: "all.finance" };
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type ActionData = {
  formError?: string;
  fieldErrors?: {
    description: string | undefined;
    amount: string | undefined;
    date: string | undefined;
  };
  fields?: {
    description: string;
    amount: string;
    date: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const form = await request.formData();

  const action = form.get("_action");

  if (action === "create") {
    const description = form.get("description");
    const amount = form.get("amount");
    const date = form.get("date");

    if (
      typeof description !== "string" ||
      typeof date !== "string" ||
      typeof amount !== "string"
    ) {
      return badRequest({
        formError: `Form not submitted correctly.`,
      });
    }

    const fields = {
      description,
      amount: Math.round(parseFloat(amount) * 100),
      transactionDate: new Date(date),
    };

    await db.transaction.create({ data: { ...fields, userId } });

    return redirect("/");
  }

  if (action === "delete") {
    const id = form.get("id");

    if (typeof id !== "string") {
      return badRequest({
        formError: `Form not submitted correctly.`,
      });
    }

    await db.transaction.delete({ where: { id } });

    return redirect("/");
  }
};

export default function App() {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 min-h-screen">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
