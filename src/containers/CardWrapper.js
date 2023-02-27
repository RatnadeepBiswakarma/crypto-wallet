export default function CardWrapper({ className, children }) {
  return (
    <div className={`border border-gray-700 rounded p-2 ${className}`}>
      {children}
    </div>
  )
}
