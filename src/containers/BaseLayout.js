export default function BaseLayout({ navbar, main }) {
  return (
    <>
      <div>{navbar}</div>
      <main>{main}</main>
    </>
  )
}
