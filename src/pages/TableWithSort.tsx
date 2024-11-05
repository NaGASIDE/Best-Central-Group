import { addDays, subDays } from 'date-fns'
import moment from 'moment'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
interface User {
	id: number
	name: string
	image: number
	type: string
	createdDate: string
}
type DateRangeSelection = {
	startDate: Date
	endDate: Date
	key: string
}
export const TableWithSort = () => {
	const [users, setUsers] = useState([])
	const [sortedUsers, setSortedUsers] = useState([])
	const [state, setState] = useState([
		{
			startDate: subDays(new Date(), 5),
			endDate: addDays(new Date(), 0),
			key: 'selection',
		},
	])
	const [searchTerm, setSearchTerm] = useState('')
	const [typeTerm, setTypeTerm] = useState('image')
	const deferredSearchTerm = useDeferredValue(searchTerm)

	useEffect(() => {
		fetch('http://localhost:5001/users')
			.then(response => response.json())
			.then(data => setUsers(data))
	}, [])

	useEffect(() => {
		const startDate = state[0].startDate.valueOf()
		const endDate = state[0].endDate.valueOf()
		setSortedUsers(
			users.filter((user: User) => {
				const userDate = moment(user.createdDate).valueOf()
				if (
					userDate > startDate &&
					userDate < endDate &&
					user.type == typeTerm
				) {
					return true
				} else {
					return false
				}
			})
		)
	}, [users, state, searchTerm, typeTerm])

	const filteredUsers = useMemo(() => {
		if (!deferredSearchTerm) return sortedUsers
		return sortedUsers.filter((user: User) =>
			user.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
		)
	}, [deferredSearchTerm])

	useEffect(() => {
		setSortedUsers(filteredUsers)
	}, [filteredUsers])
	return (
		<div style={{ display: 'flex', justifyContent: 'space-around' }}>
			<div>
				<DateRange
					editableDateInputs={true}
					onChange={(ranges: { selection: DateRangeSelection }) =>
						setState([ranges.selection])
					}
					moveRangeOnFirstSelection={false}
					ranges={state}
				/>
				<input
					type='text'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					placeholder='Поиск по имени...'
				/>
				<select onChange={e => setTypeTerm(e.target.value)}>
					<option value={'image'}>Image</option>
					<option value={'video'}>Video</option>
				</select>
			</div>
			<div>
				<h1>Users</h1>
				<div>
					{sortedUsers.map((user: User) => (
						<div key={user.id}>
							<img
								style={{ height: `100px`, width: '100px' }}
								src={user.image}
							/>{' '}
							ID:{user.id} Имя:{user.name} TYPE: {user.type} TIME:{' '}
							{user.createdDate}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
