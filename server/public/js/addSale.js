function isArrowKey(event) {
	// Allow arrow keys (37-40) and backspace (8)
	if ((event.keyCode >= 37 && event.keyCode <= 40) || event.keyCode === 8) {
		return true;
	} else {
		event.preventDefault();
		return false;
	}
}

$(document).ready(function () {
	let saleItemCount = 0;

	// Function to update amount and max quantity
	function updateAmountAndMaxQuantity() {
		const quantityField = $(this).closest(".row").find("#quantity");
		const price = $(this)
			.closest(".row")
			.find("#select-product option:selected")
			.data("price");
		const availableQuantity = $(this)
			.closest(".row")
			.find("#select-product option:selected")
			.data("quantity");
		const amount = quantityField.val() * price;
		$(this).closest(".row").find("#amount").val(amount.toFixed(2));
		quantityField.attr("max", availableQuantity);
		updateTotal();
	}

	// Function to update total number of items and total cost
	function updateTotal() {
		let totalItems = saleItemCount + 1;
		let totalAmount = 0;

		// $('[id^=sale-item-] #quantity').each(function () {
		//     totalItems += Number($(this).val());
		//     console.log(`totalItems = ${totalItems}`)
		// });

		$("[id^=sale-item] #amount").each(function () {
			totalAmount += Number($(this).val());
		});

		$('#total-items').text(totalItems);
		$("#total-amount").text(
			parseFloat(totalAmount).toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
		);
	}

	// Add onchange event listener to the quantity and product select fields of the existing div
	$("#sale-item #quantity, #sale-item #select-product")
		.change(updateAmountAndMaxQuantity)
		.trigger("change");

	$("#add-sale-item").click(function () {
		// Clone the sale item div and update its id
		const newSaleItem = $("#sale-item")
			.clone()
			.attr("id", "sale-item-" + saleItemCount);

		// Find the button in the new sale item div, enable it, unhide it, update its id and text
		newSaleItem
			.find("button")
			.prop("disabled", false)
			.prop("hidden", false)
			.attr("id", "delete-sale-item-" + saleItemCount)
			.text("Remove");

		// Clear the amount and quantity fields in the new sale item div
		newSaleItem.find("#amount").val("");
		newSaleItem.find("#quantity").val("1");

		// Add onchange event listener to the quantity and product select fields of the new div
		newSaleItem
			.find("#quantity, #select-product")
			.change(updateAmountAndMaxQuantity)
			.trigger("change");

		// Append the new sale item div to the sales-items div
		$("#all-sale-items").append(newSaleItem);

		saleItemCount++;
		updateTotal();
	});

	$(document).on("click", "[id^=delete-sale-item-]", function () {
		// Get the id of the sale item to delete
		const saleItemId = $(this)
			.attr("id")
			.replace("delete-sale-item-", "sale-item-");

		// Remove the corresponding sale item div
		$("#" + saleItemId).remove();
        saleItemCount--;
		updateTotal();
	});
});
