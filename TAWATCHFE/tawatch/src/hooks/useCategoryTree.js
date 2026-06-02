import { useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService.js'

export default function useCategoryTree() {
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const loadCategories = async () => {
			setLoading(true)
			setError('')

			try {
				const tree = await categoryService.getTree()
				if (active) {
					setCategories(Array.isArray(tree) ? tree : [])
				}
			} catch (err) {
				if (active) {
					setCategories([])
					setError(err?.message || 'Không thể tải danh mục.')
				}
			} finally {
				if (active) {
					setLoading(false)
				}
			}
		}

		loadCategories()

		return () => {
			active = false
		}
	}, [])

	return { categories, loading, error }
}