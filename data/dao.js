const errors = require("../errors/errors");
const ProductDoesNotExistError = errors.ProductDoesNotExistError;
const FileReadingError = errors.FileReadingError;
const NoProductsExistError = errors.NoProductsExistError;
const ProductAlreadyExistsError = errors.ProductAlreadyExistsError;
const InvalidProductDataError = errors.InvalidProductDataError;
const fs = require("fs");

class DAO {
	async getAllProducts() {
		try {
			// let rawData = fs.readFileSync("data/products.json");
			// let data = JSON.parse(rawData);
			// return data;
			return JSON.parse(await fs.promises.readFile("data/products.json"));
		} catch (error) {
			if (error.message === "Unexpected end of JSON input") {
				throw new NoProductsExistError("The File is Empty");
			}
			throw new FileReadingError("Error Reading File");
		}
	}

	async getProductwithId(id) {
		try {
			// let rawData = fs.readFileSync("data/products.json");
			// let data = JSON.parse(rawData);
			let data = JSON.parse(
				await fs.promises.readFile("data/products.json")
			);
			for (const element of data) {
				if (id == element.productId) {
					return element;
				}
			}
			throw new ProductDoesNotExistError("No Such Product Exists");
		} catch (error) {
			if (error instanceof ProductDoesNotExistError) {
				throw error;
			}
			throw new FileReadingError("Error Reading File");
		}
	}

	async addProduct(product) {
		try {
			if (
				!product.productId ||
				!product.productName ||
				!product.productCode ||
				!product.description ||
				!product.releaseDate ||
				!product.price ||
				!product.rating ||
				!product.imageURL
			) {
				throw new InvalidProductDataError("Invalid Product Data");
			}

			// let rawData = fs.readFileSync("data/products.json");
			// let data = JSON.parse(rawData);
			let data = JSON.parse(
				await fs.promises.readFile("data/products.json")
			);
			for (const element of data) {
				if (product.productId === element.productId) {
					throw new ProductAlreadyExistsError(
						"Product With ID: " +
							product.productId +
							" Already Exists"
					);
				}
			}
			data.push(product);
			let dataToWrite = JSON.stringify(data, null, 2);
			await fs.promises.writeFile("data/products.json", dataToWrite);
			return product;
		} catch (error) {
			if (
				error instanceof ProductAlreadyExistsError ||
				error instanceof InvalidProductDataError
			) {
				throw error;
			}
			throw new FileReadingError("Error Reading File");
		}
	}

	async updateProductWithId(product) {
		try {
			if (
				!product.productId ||
				!product.productName ||
				!product.productCode ||
				!product.description ||
				!product.releaseDate ||
				!product.price ||
				!product.rating ||
				!product.imageURL
			) {
				throw new InvalidProductDataError("Invalid Product Data");
			}

			// let rawData = fs.readFileSync("data/products.json");
			// let data = JSON.parse(rawData);
			let data = JSON.parse(
				await fs.promises.readFile("data/products.json")
			);
			for (const element of data) {
				if (product.productId === element.productId) {
					let index = data.indexOf(element);
					data[index] = product;
					let rawWriteData = JSON.stringify(data, null, 2);
					await fs.promises.writeFile(
						"data/products.json",
						rawWriteData
					);
					return product;
				}
			}
			throw new ProductDoesNotExistError("No Such Product Exists");
		} catch (error) {
			if (
				error instanceof ProductDoesNotExistError ||
				error instanceof InvalidProductDataError
			) {
				throw error;
			}
			throw new FileReadingError("Error Reading File");
		}
	}

	async deleteProductwithId(id) {
		try {
			// let rawData = fs.readFileSync("data/products.json");
			// let data = JSON.parse(rawData);
			let data = JSON.parse(
				await fs.promises.readFile("data/products.json")
			);
			for (const element of data) {
				if (id == element.productId) {
					data.splice(data.indexOf(element), 1);
					let rawWriteData = JSON.stringify(data, null, 2);
					await fs.promises.writeFile(
						"data/products.json",
						rawWriteData
					);
					return element;
				}
			}
			throw new ProductDoesNotExistError("No Such Product Exists");
		} catch (error) {
			if (error instanceof ProductDoesNotExistError) {
				throw error;
			}
			throw new FileReadingError("Error Reading File");
		}
	}
}

module.exports = new DAO();
