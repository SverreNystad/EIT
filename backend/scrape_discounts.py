from src.sales_service import _extract_sales_from_images, get_all_sales_from_vendor
from src.sales_dao import load_product_sales, save_product_sales

if __name__ == "__main__":
    pages = [
        "bunnpris-no",
        "coop-extra-no",
        "coop-mega-no",
        "coop-prix-no",
        "eurocash-se",
        "europris-no",
        "joker-no",
        "kiwi-no",
        "meny-no",
        "gigaboks-no",
        "holdbart-no",
        "jacobs-no",
        "matkroken-no",
    ]
    sales = []
    for page in pages:
        # Extract sales from images
        sales_data = get_all_sales_from_vendor(page)
        # Save the sales data to a file
        sales.extend(sales_data)

    # Save the sales data to a file
    save_product_sales(sales)
    # Load the sales data from the file
    loaded_sales_data = load_product_sales()

    print(loaded_sales_data)
