import datetime
import random


def generate_receipt():
    store_name = "SuperMart"
    store_address = "123 Main Street, Cityville"
    store_phone = "(555) 123-4567"
    receipt_number = random.randint(100000, 999999)
    date_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    items = [
        ("Kifla", 5.99),
        ("Bread", 1.99),
        ("Eggs", 3.49),
        ("Bananas", 0.69),
        ("Chicken Breast", 7.99),
        ("Rice", 4.49),
        ("Apple Juice", 2.99),
        ("Cheese", 5.49),
        ("Cereal", 3.99),
        ("Chocolate Bar", 1.49),
    ]

    selected_items = random.sample(items, random.randint(3, 7))
    subtotal = sum(price for _, price in selected_items)
    tax = subtotal * 0.08  # 8% tax
    total = subtotal + tax

    receipt = f"""
{store_name}\n{store_address}\nPhone: {store_phone}\n
Receipt #: {receipt_number}\nDate: {date_time}\n
Items Purchased:
"""

    for item, price in selected_items:
        receipt += f"{item:<15} ${price:.2f}\n"

    receipt += f"""
----------------------
Subtotal:       ${subtotal:.2f}
Tax (8%):       ${tax:.2f}
Total:          ${total:.2f}
----------------------
Thank you for shopping with us!
"""

    return receipt


if __name__ == "__main__":
    receipt_text = generate_receipt()
    print(receipt_text)
    with open("receipt.txt", "w") as file:
        file.write(receipt_text)
