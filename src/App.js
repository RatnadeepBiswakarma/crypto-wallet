import BaseLayout from "containers/BaseLayout"
// import Navbar from "components/Navbar"
import Dashboard from "components/Dashboard"
import "./App.css"

function App() {
  return <BaseLayout main={<Dashboard />} />
}

export default App
