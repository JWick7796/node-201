class FileReadingError extends Error {
	constructor(message) {
		super(message);
	}
}

class ProductDoesNotExistError extends Error {
	constructor(message) {
		super(message);
	}
}

class NoProductsExistError extends Error {
	constructor(message) {
		super(message);
	}
}

class ProductAlreadyExistsError extends Error {
	constructor(message) {
		super(message);
	}
}

class InvalidProductDataError extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = {
	FileReadingError,
	ProductDoesNotExistError,
	NoProductsExistError,
	ProductAlreadyExistsError,
	InvalidProductDataError
};
