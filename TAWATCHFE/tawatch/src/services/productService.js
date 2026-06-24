import { watchService } from './watchService.js'

function formatVnd(value) {
	if (value == null) return 'Liên hệ'
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(value)
}

function mapWatch(watch, index) {
	return {
		id: watch.id,
		title: watch.name,
		description: watch.description,
		price: formatVnd(watch.minPrice),
		priceRaw: watch.minPrice != null ? Number(watch.minPrice) : null,
		salePrice: watch.salePrice != null ? formatVnd(watch.salePrice) : null,
		salePriceRaw: watch.salePrice != null ? Number(watch.salePrice) : null,
		discountPercent: watch.discountPercent ?? null,
		image: watch.mainImageUrl ?? '/images/product-heritage.jpg',
		variantId: watch.defaultVariantId ?? null,
		brandId: watch.brandId ?? null,
		brandName: watch.brandName ?? '',
		movementType: watch.movementType ?? null,
		categoryId: watch.categoryId ?? null,
		categoryName: watch.categoryName ?? '',
		isFeatured: watch.isFeatured ?? false,
		offsetClassName: index % 2 === 1 ? 'pt-12 md:pt-24' : '',
	}
}

export const productService = {
	async getAll() {
		const watches = await watchService.getAll()
		return watches.map(mapWatch)
	},
	async getFeatured() {
		const watches = await watchService.getFeatured()
		return watches.map(mapWatch)
	},
	async getNewest(limit = 8) {
		const watches = await watchService.getNewest(limit)
		return watches.map(mapWatch)
	},
	async getPaged(page = 0, size = 10) {
		const paged = await watchService.getPaged(page, size)
		return {
			content: paged.content.map(mapWatch),
			currentPage: paged.currentPage,
			totalPages: paged.totalPages,
			totalElements: paged.totalElements,
			pageSize: paged.pageSize,
		}
	},
	async getByIds(ids = []) {
		const watches = await watchService.getByIds(ids)
		return watches.map(mapWatch)
	},
	async search(filters = {}) {
		const paged = await watchService.search({
			name: filters.name ?? undefined,
			brandIds: filters.brandIds,
			categoryIds: filters.categoryIds,
			segmentIds: filters.segmentIds,
			movementTypes: filters.movementTypes,
			minPrice: filters.minPrice,
			maxPrice: filters.maxPrice,
			page: filters.page ?? 0,
			size: filters.size ?? 12,
			sort: filters.sort,
		})
		return {
			content: paged.content.map((w, i) => mapWatch(w, i)),
			currentPage: paged.currentPage,
			totalPages: paged.totalPages,
			totalElements: paged.totalElements,
			pageSize: paged.pageSize,
		}
	},
}
