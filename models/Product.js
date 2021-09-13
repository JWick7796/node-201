class Product {
	constructor(
		productId,
		productName,
		productCode,
		description,
		releaseDate,
		price,
		rating,
		imageURL
	) {
		this.productId = productId;
		this.productName = productName;
		this.productCode = productCode;
		this.description = description;
		this.releaseDate = releaseDate;
		this.price = price;
		this.rating = rating;
		this.imageURL = imageURL;
	}
}

module.exports = Product;
