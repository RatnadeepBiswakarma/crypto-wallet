import "./Table.css"
import { formatPrice } from "utils"

export default function Table({ items, head, body, handleUnitsInput }) {
  return (
    <table>
      <thead>
        {head ? (
          head
        ) : (
          <tr className='border-b border-gray-700'>
            <th className='px-2 pb-2'>Name</th>
            <th className='px-2 pb-2'>Symbol</th>
            <th className='px-2 pb-2'>Price</th>
            <th className='px-2 pb-2'>Purchase</th>
          </tr>
        )}
      </thead>

      <tbody>
        {body
          ? body
          : items.map(item => {
              return (
                <tr key={item.id}>
                  <td className='px-2'>{item.slug}</td>
                  <td className='px-2'>{item.symbol}</td>
                  <td className='px-2 text-green-500'>
                    $ {formatPrice(item.metrics.market_data.price_usd)}
                  </td>
                  <td className='px-2 units'>
                    <input
                      type='number'
                      step='0.01'
                      value={item.units}
                      onChange={evt => handleUnitsInput(item, evt.target.value)}
                      placeholder='Units'
                      className='bg-transparent w-full px-2 border-b border-gray-700'
                    />
                  </td>
                </tr>
              )
            })}
      </tbody>
    </table>
  )
}
