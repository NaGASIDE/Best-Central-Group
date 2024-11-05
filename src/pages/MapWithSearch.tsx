import axios from 'axios'
import 'leaflet-control-geocoder'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvents,
} from 'react-leaflet'

type Location = {
	lat: number
	lng: number
}


export const MapWithSearch: React.FC = () => {
	const defaultPosition: Location = { lat: 51.505, lng: -0.09 }
	const [position, setPosition] = useState<Location | number[]>(defaultPosition)
	const [address, setAddress] = useState<string>('')
	const [searchResults, setSearchResults] = useState([])
	useEffect(() => {
		if (position) {
			fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${position?.[0]}&lon=${position?.[1]}&format=json`
			)
				.then(response => response.json())
				.then(data => {
					setAddress(data.display_name || 'Адрес не найден')
				})
				.catch(error => console.error(error))
		}
	}, [position])

	const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setAddress(value)

		if (value.length > 2) {
			const response = await axios.get(
				'https://nominatim.openstreetmap.org/search',
				{
					params: {
						q: value,
						format: 'json',
						addressdetails: 1,
						limit: 5,
					},
				}
			)

			setSearchResults(response.data) 
		} else {
			setSearchResults([]) 
		}
	}

	const handleSelectResult = (result: {
		lat: string
		lon: string
		display_name: string
	}) => {
		const { lat, lon } = result
		setPosition([parseFloat(lat), parseFloat(lon)])
		setAddress(result.display_name)
		setSearchResults([]) 
	}

	const LocationMarker = () => {
		useMapEvents({
			click(e) {
				const result = e.latlng
				const { lat, lng } = result

				setPosition([lat, lng])
			},
		})

		return position ? <Marker position={position}></Marker> : null
	}

	return (
		<div style={{ height: '100vh', width: '100%' }}>
			<h1>Поиск адреса с картой</h1>
			<div className='search-container'>
				<input
					type='text'
					value={address}
					onChange={handleSearch}
					placeholder='Введите адрес или город'
				/>
				{searchResults.length > 0 && (
					<ul className='search-results'>
						{searchResults.map(
							(
								result: {
									lat: string
									lon: string
									display_name: string
								},
								index: number
							) => (
								<li key={index} onClick={() => handleSelectResult(result)}>
									{result.display_name}
								</li>
							)
						)}
					</ul>
				)}
			</div>
			<MapContainer
				center={position}
				zoom={13}
				scrollWheelZoom={false}
				attributionControl={true}
				id='map'
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<LocationMarker />
				<Marker position={position}>
					<Popup>Вы выбрали это место!</Popup>
				</Marker>
			</MapContainer>
		</div>
	)
}
