import { Minus } from "../icons";

export const ExpensesTable = () => {
  return (
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
        {/* <tr className={personIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}> */}
        <tr className="bg-white">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-900">
            Luz
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
            - R$500,00
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            18/01/2022
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <Minus />
          </td>
        </tr>

        <tr className="bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-900">
            Criação de website
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
            R$5.000,00
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            18/01/2022
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <Minus />
          </td>
        </tr>

        <tr className="bg-white">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-900">
            Internet
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
            - R$200,00
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            18/01/2022
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <Minus />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
