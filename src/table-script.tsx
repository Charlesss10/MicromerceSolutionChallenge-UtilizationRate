import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).filter((dataRow) => dataRow?.employees || dataRow?.externals) // Filter out rows with no employee or external data
  .map((dataRow) => {
    const person = dataRow?.employees?.name || dataRow?.externals?.name;

    // Gets the past 12 months utilization rate * 100 for both employees and externals
    const past12Months = dataRow?.employees?.workforceUtilisation?.utilisationRateLastTwelveMonths != null
      ? parseFloat(dataRow.employees.workforceUtilisation.utilisationRateLastTwelveMonths) * 100
      : parseFloat(dataRow?.externals?.workforceUtilisation?.utilisationRateLastTwelveMonths ?? "0") * 100; // Assigns "0" to undefined values

    // Gets the year to date utilization rate * 100 for both employees and externals
    const y2d = dataRow?.employees?.workforceUtilisation?.utilisationRateYearToDate != null
      ? parseFloat(dataRow.employees.workforceUtilisation.utilisationRateYearToDate) * 100
      : parseFloat(dataRow?.externals?.workforceUtilisation?.utilisationRateYearToDate ?? "0") * 100;

    const june = dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(-1) != null
      ? parseFloat(dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(-1)?.utilisationRate ?? "0") * 100
      : dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(-1)?.utilisationRate ?? 0;
    console.log('Utilization rate for the month of "June" extepected: ' + dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(-1)?.month);

    const july = dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(1) != null
      ? parseFloat(dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(1)?.utilisationRate ?? "0") * 100
      : dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(1)?.utilisationRate ?? 0;
    console.log('Utilization rate for the month of "July" extepected: ' + dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(1)?.month);

    const august = dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(0) != null
      ? parseFloat(dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(0)?.utilisationRate ?? "0") * 100
      : dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(0)?.utilisationRate ?? 0;
    console.log('Utilization rate for the month of "August" extepected: ' + dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.at(0)?.month);

    // Gets the net earnings from the potentialEarningsByMonth for employees and costsByMonth for externals for the last month in the array (-1)
    const netEarningsPrevMonth = dataRow?.employees?.costsByMonth?.potentialEarningsByMonth?.at(-1) != null
      ? dataRow.employees.costsByMonth.potentialEarningsByMonth.at(-1)?.costs
      : dataRow?.externals?.costsByMonth?.costsByMonth?.at(-1)?.costs ?? 0;
    // Logs to console to confirm that we are pointing at the last month. August for this example
    console.log('\nNet earnings for thr previous month "August" extepected: ' + dataRow?.employees?.costsByMonth?.potentialEarningsByMonth?.at(-1)?.month);
    console.log('\n');

    const row: TableDataType = {
      person: `${person}`,
      past12Months: `${past12Months}%`,
      y2d: `${y2d}%`,
      june: `${june}%`,
      july: `${july}%`,
      august: `${august}%`,
      netEarningsPrevMonth: `${netEarningsPrevMonth} €`,
    };

    return row;
  });

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
      },
      {
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "august",
        header: "August",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
