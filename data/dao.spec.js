const assert = require("assert");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);
const sinon = require("sinon");
const dao = require("./dao");
const fs = require("fs");

const errors = require("../errors/errors");
const ProductDoesNotExistError = errors.ProductDoesNotExistError;
const FileReadingError = errors.FileReadingError;
const NoProductsExistError = errors.NoProductsExistError;
const ProductAlreadyExistsError = errors.ProductAlreadyExistsError;
const InvalidProductDataError = errors.InvalidProductDataError;

var sandbox;
var sandbox1;

beforeEach(() => {
	sandbox = sinon.createSandbox();
	sandbox
		.stub(fs.promises, "readFile")
		.withArgs("data/products.json")
		.returns(
			JSON.stringify([
				{
					productId: 101,
					productName: "Sony XB450AP Wired Headset",
					productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
					description:
						"Wouldn't it be amazing if you could hear every minute detail in all of your favourite songs? Enjoy an immersive audio experience with this Sony wired headset. Its swivelling earcup design which also swivels flat ensures easy storage and convenient packing. You don't have to reach out to your phone to pick up calls even when you're listening to music, because there is an in-line remote and a built-in microphone on the headphone cord.",
					releaseDate: "2018-09-16",
					price: 2499,
					rating: 4.3,
					imageURL:
						"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
				},
				{
					productId: 102,
					productName: "Sony WH-XB700 Bluetooth Headset",
					productCode: "LSTACCFF9F58VZQYUSJT9E3DA",
					description:
						"As part of the EXTRA BASS range from Sony, the WH-XB700 headphones enhance all your low-end frequencies for exceptional bass, yet retaining vocal clarity, lifting every track with wave after wave of thundering rhythm.",
					releaseDate: "2019-07-16",
					price: 9499,
					rating: 4.4,
					imageURL:
						"https://rukminim1.flixcart.com/image/416/416/jz05rww0/headphone/c/r/z/sony-wh-xb700-original-imafg6sezz6uf492.jpeg"
				}
			])
		);

	sandbox
		.stub(fs.promises, "writeFile")
		.withArgs("data/products.json")
		.returns(true);
});

describe("getAllProducts", () => {
	it("should return all products", async () => {
		expect(await dao.getAllProducts()).to.deep.equal([
			{
				productId: 101,
				productName: "Sony XB450AP Wired Headset",
				productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
				description:
					"Wouldn't it be amazing if you could hear every minute detail in all of your favourite songs? Enjoy an immersive audio experience with this Sony wired headset. Its swivelling earcup design which also swivels flat ensures easy storage and convenient packing. You don't have to reach out to your phone to pick up calls even when you're listening to music, because there is an in-line remote and a built-in microphone on the headphone cord.",
				releaseDate: "2018-09-16",
				price: 2499,
				rating: 4.3,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
			},
			{
				productId: 102,
				productName: "Sony WH-XB700 Bluetooth Headset",
				productCode: "LSTACCFF9F58VZQYUSJT9E3DA",
				description:
					"As part of the EXTRA BASS range from Sony, the WH-XB700 headphones enhance all your low-end frequencies for exceptional bass, yet retaining vocal clarity, lifting every track with wave after wave of thundering rhythm.",
				releaseDate: "2019-07-16",
				price: 9499,
				rating: 4.4,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/jz05rww0/headphone/c/r/z/sony-wh-xb700-original-imafg6sezz6uf492.jpeg"
			}
		]);
	});

	it("should throw Error on Empty File", async () => {
		// Release the Original Stub
		sandbox.restore();
		// Override the Default Stub
		sandbox
			.stub(fs.promises, "readFile")
			.withArgs("data/products.json")
			.returns([]);

		// Below Code Will Not Work
		// https://stackoverflow.com/questions/43412458/chai-assertionerror-expected-function-to-be-a-function-when-testing-excepti/43412543
		// so we will have to use chai-as-promised
		// expect(async () => {
		// 	await dao.getAllProducts();
		// }).to.throw("The File is Empty");

		await expect(dao.getAllProducts()).to.be.rejectedWith(
			NoProductsExistError
		);

		// Another Way to Do this using the classic Assert
		// await assert.rejects(dao.getAllProducts(), {
		// 	message: "The File is Empty"
		// });
	});
});

describe("getProductwithId", () => {
	it("should return product with specific ID", async () => {
		expect(await dao.getProductwithId(101)).to.deep.equal({
			productId: 101,
			productName: "Sony XB450AP Wired Headset",
			productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
			description:
				"Wouldn't it be amazing if you could hear every minute detail in all of your favourite songs? Enjoy an immersive audio experience with this Sony wired headset. Its swivelling earcup design which also swivels flat ensures easy storage and convenient packing. You don't have to reach out to your phone to pick up calls even when you're listening to music, because there is an in-line remote and a built-in microphone on the headphone cord.",
			releaseDate: "2018-09-16",
			price: 2499,
			rating: 4.3,
			imageURL:
				"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
		});
	});

	it("should throw Error when product with ID does not exist", async () => {
		await expect(dao.getProductwithId(1011)).to.be.rejectedWith(
			ProductDoesNotExistError
		);
	});
});

describe("addProduct", () => {
	it("should add product to file without error", async () => {
		expect(
			await dao.addProduct({
				productId: 105,
				productName: "Sony WH-1000XM3 Bluetooth Headset",
				productCode: "LSTACCFABFBKW55PGXCBNKCIR",
				description:
					"Dive deeper into your favorite music and silence the noise of the world with the Sony WH-1000XM3 Bluetooth Headset that features a number of innovative technologies. This personal audio device comes with HD Noise Cancelling Processor QN1, Powerful 40-mm Drivers, and up to 30 Hours of Battery Life for an intense and immersive musical experience.",
				releaseDate: "2020-10-01",
				price: 27990.99,
				rating: 4.7,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/jnoxa4w0/headphone/g/x/c/sony-wh-1000xm3-original-imafabf9xnjm2xd6.jpeg"
			})
		).to.deep.equal({
			productId: 105,
			productName: "Sony WH-1000XM3 Bluetooth Headset",
			productCode: "LSTACCFABFBKW55PGXCBNKCIR",
			description:
				"Dive deeper into your favorite music and silence the noise of the world with the Sony WH-1000XM3 Bluetooth Headset that features a number of innovative technologies. This personal audio device comes with HD Noise Cancelling Processor QN1, Powerful 40-mm Drivers, and up to 30 Hours of Battery Life for an intense and immersive musical experience.",
			releaseDate: "2020-10-01",
			price: 27990.99,
			rating: 4.7,
			imageURL:
				"https://rukminim1.flixcart.com/image/416/416/jnoxa4w0/headphone/g/x/c/sony-wh-1000xm3-original-imafabf9xnjm2xd6.jpeg"
		});
	});

	it("should throw error on fields missing from new product data", async () => {
		await expect(
			dao.addProduct({
				productId: 110,
				productName: "Sony WH-1000XM3 Bluetooth Headset",
				productCode: "LSTACCFABFBKW55PGXCBNKCIR",
				price: 27990.99,
				rating: 4.7,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/jnoxa4w0/headphone/g/x/c/sony-wh-1000xm3-original-imafabf9xnjm2xd6.jpeg"
			})
		).to.be.rejectedWith(InvalidProductDataError);
	});

	it("should throw error on product already existing with same product id", async () => {
		await expect(
			dao.addProduct({
				productId: 101,
				productName: "Sony XB450AP Wired Headset",
				productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
				description:
					"Wouldn't it be amazing if you could hear every minute detail in all of your favourite songs? Enjoy an immersive audio experience with this Sony wired headset. Its swivelling earcup design which also swivels flat ensures easy storage and convenient packing. You don't have to reach out to your phone to pick up calls even when you're listening to music, because there is an in-line remote and a built-in microphone on the headphone cord.",
				releaseDate: "2018-09-16",
				price: 2499,
				rating: 4.3,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
			})
		).to.be.rejectedWith(ProductAlreadyExistsError);
	});
});

describe("updateProductWithId", () => {
	it("should update the product with ID", async () => {
		expect(
			await dao.updateProductWithId({
				productId: 101,
				productName: "Sony WH-1000XM2",
				productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
				description: "Awesome Headphone",
				releaseDate: "2020-09-16",
				price: 22499,
				rating: 4.2,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
			})
		).to.deep.equal({
			productId: 101,
			productName: "Sony WH-1000XM2",
			productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
			description: "Awesome Headphone",
			releaseDate: "2020-09-16",
			price: 22499,
			rating: 4.2,
			imageURL:
				"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
		});
	});

	it("should throw error on fields missing from new product data", async () => {
		await expect(
			dao.updateProductWithId({
				productId: 110,
				productName: "Sony WH-1000XM3 Bluetooth Headset",
				productCode: "LSTACCFABFBKW55PGXCBNKCIR",
				price: 27990.99,
				rating: 4.7,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/jnoxa4w0/headphone/g/x/c/sony-wh-1000xm3-original-imafabf9xnjm2xd6.jpeg"
			})
		).to.be.rejectedWith(InvalidProductDataError);
	});

	it("should throw Error when product with ID does not exist", async () => {
		await expect(
			dao.updateProductWithId({
				productId: 110,
				productName: "Sony WH-1000XM2",
				productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
				description: "Awesome Headphone",
				releaseDate: "2020-09-16",
				price: 22499,
				rating: 4.2,
				imageURL:
					"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
			})
		).to.be.rejectedWith(ProductDoesNotExistError);
	});
});

describe("deleteProductwithId", () => {
	it("should delete product with given ID", async () => {
		expect(await dao.deleteProductwithId(101)).to.deep.equal({
			productId: 101,
			productName: "Sony XB450AP Wired Headset",
			productCode: "LSTACCE4BFW7RYHHKXRB5NZOP",
			description:
				"Wouldn't it be amazing if you could hear every minute detail in all of your favourite songs? Enjoy an immersive audio experience with this Sony wired headset. Its swivelling earcup design which also swivels flat ensures easy storage and convenient packing. You don't have to reach out to your phone to pick up calls even when you're listening to music, because there is an in-line remote and a built-in microphone on the headphone cord.",
			releaseDate: "2018-09-16",
			price: 2499,
			rating: 4.3,
			imageURL:
				"https://rukminim1.flixcart.com/image/416/416/j58hj0w0/headset/extra-bass/k/x/r/sony-mdr-xb450ap-original-imaevftngr8hbrkb.jpeg"
		});
	});

	it("should throw Error when product with ID does not exist", async () => {
		await expect(dao.deleteProductwithId(110)).to.be.rejectedWith(
			ProductDoesNotExistError
		);
	});
});

afterEach(() => {
	sandbox.restore();
});
