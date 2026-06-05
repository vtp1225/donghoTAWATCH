import { variantImageService, watchService, variantService } from './watchService.js'

function unwrapPrice(variants) {
	if (!Array.isArray(variants) || variants.length === 0) return null

	const prices = variants
		.map((variant) => Number(variant.price))
		.filter((price) => Number.isFinite(price) && price > 0)

	if (prices.length === 0) return null
	return Math.min(...prices)
}

function formatVnd(value) {
	if (value == null) return 'Liên hệ'

	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(value)
}

function unwrapVariantId(variants) {
	if (!Array.isArray(variants) || variants.length === 0) return null
	const sorted = variants
		.filter((v) => Number.isFinite(Number(v.price)) && Number(v.price) > 0)
		.sort((a, b) => Number(a.price) - Number(b.price))
	return sorted[0]?.id ?? variants[0]?.id ?? null
}

async function loadProduct(watch, index) {
	const [variants, mainImage] = await Promise.all([
		variantService.getByWatch(watch.id).catch((err) => {
			console.error(`[productService] Không lấy được variants cho watch ${watch.id}:`, err?.status, err?.message)
			return []
		}),
		variantImageService.getMainImage(watch.id).catch(() => null),
	])

	const price = unwrapPrice(variants)
	const image = mainImage?.url ?? '/images/product-heritage.jpg'

	return {
		id: watch.id,
		title: watch.name,
		description: watch.description,
		price: formatVnd(price),
		priceRaw: price,
		image,
		variantId: unwrapVariantId(variants),
		brandId: watch.brandId ?? null,
		brandName: watch.brandName ?? '',
		movementType: watch.movementType ?? null,
		categoryId: watch.categoryId ?? null,
		categoryName: watch.categoryName ?? '',
		offsetClassName: index % 2 === 1 ? 'pt-12 md:pt-24' : '',
	}
}

export const productService = {
	async getAll() {
		const watches = await watchService.getAll()
		return Promise.all(watches.map((watch, index) => loadProduct(watch, index)))
	},
}
