import { useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService.js'

let _cache = null

export default function useCategoryTree() {
	const [categories, setCategories] = useState(_cache ?? [])
	const [loading, setLoading] = useState(_cache === null)
	const [error, setError] = useState('')

	useEffect(() => {
		if (_cache !== null) return
		let active = true

		const loadCategories = async () => {
			setLoading(true)
			setError('')
			try {
				const tree = await categoryService.getTree()
				_cache = Array.isArray(tree) ? tree : []
				if (active) setCategories(_cache)
			} catch (err) {
				if (active) {
					setCategories([])
					setError(err?.message || 'Không thể tải danh mục.')
				}
			} finally {
				if (active) setLoading(false)
			}
		}

		loadCategories()
		return () => { active = false }
	}, [])

	return { categories, loading, error }
}