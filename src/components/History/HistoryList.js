import { formatPrice, formatTime } from "utils"
import Table from "components/Table"

function profitAmt(item) {
  return (item.current_price - item.metrics.market_data.price_usd).toFixed(3)
}

function TableHeader() {
  return (
    <tr className='border-b border-gray-700'>
      {["Name", "Units", "Time", "Profit", "Total"].map(item => {
        return (
          <th key={item} className='px-2 pb-2'>
            {item}
          </th>
        )
      })}
    </tr>
  )
}

function TableBody({ items }) {
  return (
    <>
      {items.map((item, idx) => {
        return (
          <tr key={item.id + idx}>
            <td className='px-2'>{item.slug}</td>
            <td className='px-2'>{item.units}</td>
            <td className='px-2'>{formatTime(item.date_time)}</td>
            <td
              className={`px-2 ${
                profitAmt(item) > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              $ {profitAmt(item)}
            </td>
            <td className='px-2 text-green-500'>$ {formatPrice(item.total)}</td>
          </tr>
        )
      })}
    </>
  )
}

export default function HistoryList({ items }) {
  return (
    <Table
      items={items}
      head={<TableHeader />}
      body={<TableBody items={items} />}
    />
  )
}
