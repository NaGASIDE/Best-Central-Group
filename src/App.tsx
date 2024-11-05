import { useState } from 'react'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { MapWithSearch } from './pages/MapWithSearch'
import { TableWithSort } from './pages/TableWithSort'

function App() {
	const [page, setPage] = useState(false)
	return (
		<div>
			<button onClick={() => setPage(!page)}>другая страница</button>
			{page ? <TableWithSort /> : <MapWithSearch />}
		</div>
	)
}

export default App
