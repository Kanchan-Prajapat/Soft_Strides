import axios from "axios";

let token = null;

export const getShiprocketToken = async () => {
  if (token) return token;

  const res = await axios.post(
    `${process.env.SHIPROCKET_BASE_URL}/auth/login`,
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  token = res.data.token;

  console.log("SHIPROCKET TOKEN GENERATED");

  return token;
};

export const createShipment = async (order) => {
  try {
    const token = await getShiprocketToken();

    const payload = {
      order_id: order._id.toString(),

      order_date: new Date().toISOString().split("T")[0],

      pickup_location: "Primary",

      billing_customer_name: order.customerName || "Customer",

      billing_last_name: "",

      billing_address: order.address,

      billing_city: order.city || "Jaipur",

      billing_pincode: order.pincode || "302001",

      billing_state: order.state || "Rajasthan",

      billing_country: "India",

      billing_email: order.customerEmail || "test@gmail.com",

      billing_phone: order.phone,

      shipping_is_billing: true,

      order_items: order.products.map((item) => ({
        name: item.name,
        sku: item.product?.toString() || "SKU",
        units: item.qty,
        selling_price: item.discountPrice,
      })),

      payment_method: "Prepaid",

      sub_total: order.totalAmount,

      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    };

    console.log("SHIPROCKET PAYLOAD:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("SHIPROCKET TOKEN:", token);

    const res = await axios.post(
      `${process.env.SHIPROCKET_BASE_URL}/orders/create/adhoc`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SHIPROCKET SUCCESS:");
    console.log(res.data);
    console.log("SHIPROCKET RESPONSE:", res.data);

    return res.data;

  } catch (err) {

    console.log("========== SHIPROCKET ERROR ==========");

    console.log(
      JSON.stringify(err.response?.data, null, 2)
    );

    console.log("=====================================");

    throw err;
  }
};

export const trackShipment = async (awb) => {
  const token = await getShiprocketToken();

  const res = await axios.get(
    `${process.env.SHIPROCKET_BASE_URL}/courier/track/awb/${awb}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};