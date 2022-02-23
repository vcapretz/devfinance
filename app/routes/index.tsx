import { LoaderFunction, Link } from "remix";
import type { Transaction, User } from "@prisma/client";
import { useLoaderData, useTransition } from "remix";
import { Card } from "~/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/dialog";
import { db } from "~/utils/db.server";
import { getUser, getUserId } from "~/utils/session.server";
import { Expense, Income, Logo, Minus, Total } from "~/components/icons";
import classNames from "classnames";

type LoaderData = { user: User | null; transactions: Array<Transaction> };

export let loader: LoaderFunction = async ({ request }) => {
  const userId = (await getUserId(request)) ?? undefined;

  const transactions = await db.transaction.findMany({
    where: { userId },
    orderBy: { transactionDate: "desc" },
  });

  const user = await getUser(request);

  const data: LoaderData = {
    transactions,
    user,
  };

  return data;
};

const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function Index() {
  const transition = useTransition();
  const data = useLoaderData<LoaderData>();

  const totals = data.transactions.reduce(
    (total, transaction) => {
      if (transaction.amount > 0) {
        total.income += transaction.amount;
      } else {
        total.expense += transaction.amount;
      }

      total.total = total.income + total.expense;

      return total;
    },
    {
      income: 0,
      expense: 0,
      total: 0,
    }
  );

  return (
    <>
      <header className="bg-green-800 pt-8 pb-44 flex justify-center">
        <div className="flex items-center justify-between max-w-7xl w-full px-8">
          <Logo />

          {data.user ? (
            <div className="text-white flex items-center gap-2">
              <span>{`Oi ${data.user.username}`}</span>

              <form action="/logout" method="post">
                <button type="submit" className="rounded px-4 py-1 border">
                  Sair
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login" className="text-white">
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-7xl px-8 mx-auto">
        <section
          role="contentinfo"
          aria-label="Balanço"
          className="-mt-28 grid md:grid-cols-3 gap-8"
        >
          <Card
            title="Entradas"
            value={formatCurrency(totals.income)}
            icon={<Income />}
          />

          <Card
            title="Saídas"
            value={formatCurrency(totals.expense)}
            icon={<Expense />}
          />

          <Card
            title="Total"
            value={formatCurrency(totals.total)}
            icon={<Total />}
            variant="total"
          />
        </section>

        <section className="block overflow-x-auto w-full mt-10">
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-green-800 mb-4 text-sm hover:text-green-600">
                + Nova transação
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Nova transação</DialogTitle>

              <form method="post" action="/">
                <fieldset
                  disabled={transition.state === "submitting"}
                  className="space-y-4"
                >
                  <div className="mt-6">
                    <input
                      className="rounded bg-white p-2 w-full"
                      name="description"
                      id="description"
                      placeholder="Descrição"
                      aria-label="Descrição"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <input
                      className="rounded bg-white p-2 w-full"
                      name="amount"
                      id="amount"
                      placeholder="0,00"
                      step="0.01"
                      aria-label="Valor da transação"
                      type="number"
                    />

                    <small className="text-xs text-gray-500">
                      Use o sinal <i>-</i> (negativo) para despesas; e <i>,</i>{" "}
                      (vírgula) para casas decimais
                    </small>
                  </div>

                  <div>
                    <input
                      className="rounded bg-white p-2 w-full"
                      name="date"
                      id="date"
                      aria-label="Data da transação"
                      type="date"
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      className="px-4 py-2 rounded text-white bg-green-800 hover:bg-green-700"
                      type="submit"
                      name="_action"
                      value="create"
                    >
                      {transition.state === "submitting"
                        ? "Adionando..."
                        : "Adicionar"}
                    </button>

                    <DialogClose asChild>
                      <button className="px-4 py-2 rounded text-white bg-red-800 hover:bg-red-700">
                        Cancelar
                      </button>
                    </DialogClose>
                  </div>
                </fieldset>
              </form>
            </DialogContent>
          </Dialog>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Descriçāo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {data.transactions?.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-900">
                    {transaction.description}
                  </td>

                  <td
                    className={classNames(
                      "px-6 py-4 whitespace-nowrap text-sm",
                      {
                        "text-red-500": transaction.amount < 0,
                        "text-green-500": transaction.amount >= 0,
                      }
                    )}
                  >
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form className="flex" method="post">
                      <input type="hidden" name="id" value={transaction.id} />

                      <button
                        type="submit"
                        aria-label="Apagar"
                        name="_action"
                        value="delete"
                      >
                        <Minus />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="max-w-5xl px-8 mx-auto text-center py-8 text-cyan-900">
        <p>all.finance$</p>
      </footer>
    </>
  );
}
