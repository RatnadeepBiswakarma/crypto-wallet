import { useEffect, useState, useMemo } from "react"
import { fetchData } from "apis"
import Toolbar from "components/Toolbar"
import Table from "./Table"
import CardWrapper from "containers/CardWrapper"
import HistoryList from "./History/HistoryList"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [balance, setBalance] = useState(5000)
  const [btnText, setBtnText] = useState("Purchase")
  const [selectedUnits, setSelectedUnits] = useState({})
  const [shouldAutoUpdate, setShouldAutoUpdate] = useState(false)
  const [timerId, setTimerId] = useState(null)
  const [purchaseHistory, setPurchaseHistory] = useState([])

  useEffect(() => {
    populateData()
  }, [])

  useEffect(() => {
    if (shouldAutoUpdate) {
      autoUpdateData()
    } else {
      clearTimeout(timerId)
    }
  }, [shouldAutoUpdate])

  const cartValue = useMemo(() => {
    let val = 0
    Object.keys(selectedUnits).forEach(id => {
      const item = items.find(item => item.id === id)
      if (item) {
        val += selectedUnits[id] * item.metrics.market_data.price_usd
      }
    })
    return val.toFixed(2)
  }, [items, selectedUnits])

  const purchaseAllowed = useMemo(() => {
    return parseFloat(cartValue) > 0 && parseFloat(cartValue) <= parseFloat(balance)
  }, [cartValue, balance])

  const getItems = useMemo(() => {
    return items.map(item => {
      return { ...item, units: selectedUnits[item.id] || "" }
    })
  }, [selectedUnits, items])

  const getHistory = useMemo(() => {
    return purchaseHistory.map(item => {
      const dataSource = items.find(i => i.id === item.id) || item
      return {
        ...item,
        current_price: dataSource.metrics.market_data.price_usd
      }
    })
  })

  function populateData() {
    setIsLoading(true)
    fetchData()
      .then(res => res.json())
      .then(response => {
        setItems(response.data)
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleUnitsInput(item, units) {
    let obj = { ...selectedUnits }
    obj[item.id] = units
    setSelectedUnits(obj)
  }

  function purchase() {
    if (!purchaseAllowed) return

    setBtnText("Processing...")
    setBalance((balance - cartValue).toFixed(3))
    createPurchaseHistory()
    resetUnits()
    setTimeout(() => {
      setBtnText("Purchase Successful")
      setTimeout(() => {
        setBtnText("Purchase")
      }, 2000)
    }, 1000)
  }

  function createPurchaseHistory() {
    let arr = []
    items.forEach(item => {
      if (selectedUnits[item.id] && selectedUnits[item.id] > 0) {
        arr.push({
          ...item,
          date_time: new Date(),
          units: selectedUnits[item.id],
          total: selectedUnits[item.id] * item.metrics.market_data.price_usd,
        })
      }
    })
    setPurchaseHistory([...purchaseHistory, ...arr])
  }

  function resetUnits() {
    setSelectedUnits({})
  }

  function handleAutoUpdateChange(evt) {
    setShouldAutoUpdate(evt.target.checked)
  }

  function autoUpdateData() {
    clearTimeout(timerId)

    if (shouldAutoUpdate) {
      populateData()
      const id = setTimeout(() => {
        autoUpdateData()
      }, 3000)
      setTimerId(id)
    }
  }

  return (
    <div>
      <div className='p-2 sm:p-4 md:p-8'>
        <Toolbar className='flex justify-end'>
          <div className='font-medium text-lg mr-4'>
            Balance: <span className='text-green-500'>${balance}</span>
          </div>
          <div className='font-medium text-lg'>
            Cart: <span className='text-green-500'>${cartValue}</span>
          </div>
          <button
            onClick={purchase}
            disabled={!purchaseAllowed}
            className={`px-4 py-1 rounded-sm ml-4 border ${
              purchaseAllowed
                ? "text-blue-400 border-blue-400"
                : "text-gray-500 border-gray-600"
            }`}
          >
            {btnText}
          </button>
        </Toolbar>
        <div className='flex justify-between items-start border-t mt-4 pt-4 border-gray-700'>
          <div className='w-2/3'>
            <h2 className="text-center font-bold">Stocks</h2>
            <CardWrapper className='mt-4 mr-2 text-right flex items-end flex-col'>
              <div className='flex justify-center items-center mb-2'>
                <label
                  htmlFor='auto-update'
                  className='flex justify-center items-center mr-4'
                >
                  <input
                    type='checkbox'
                    id='auto-update'
                    value={shouldAutoUpdate}
                    onChange={handleAutoUpdateChange}
                    className='mr-2'
                  />
                  Auto Update
                </label>
                <button
                  onClick={populateData}
                  className='bg-slate-700 flex justify-center items-center px-2 rounded'
                >
                  <img
                    src='https://icongr.am/fontawesome/refresh.svg?size=20&color=cfcfcf'
                    className={`${isLoading && "rotate-icon"} py-1`}
                  />
                </button>
              </div>
              <Table items={getItems} handleUnitsInput={handleUnitsInput} />
            </CardWrapper>
          </div>
          <div className='w-1/3'>
            <h2 className="text-center font-bold">Purchase History</h2>
            <CardWrapper className='mt-4'>
              {
                getHistory.length > 0 ?
                <HistoryList items={getHistory} /> :
                <div className="text-sm text-center py-4">Purchase history will be displayed here</div>
              }
            </CardWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
