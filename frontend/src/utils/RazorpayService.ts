declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: never) => void) => void;
    };
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}



export const loadRazorpay = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const RazorpayPayment = async (
  amount: number,
  currency: string,
  onSuccess: (paymentId: string) => void,
  onError: (error: string) => void
) => {
  try {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    if (!window.Razorpay) {
      throw new Error("Razorpay not available");
    }

    const options: RazorpayOptions = {
      key: "rzp_test_OyFUhtYPPaavPN",
      amount: Math.round(amount * 100),
      currency: currency || "INR",
      name: "Cartify.com",
      description: "Purchase from Your Store",
      image: "https://www.svgrepo.com/show/343866/ecommerce-optimization-online-shopping.svg",
      handler: (response) => {
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9876543210",
      },
      notes: {
        address: "Customer Address",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: { error: { description: string } }) => {
      onError(`Payment failed: ${response.error.description}`);
    });
    rzp.open();
  } catch (error) {
    onError(
      error instanceof Error ? error.message : "Payment initialization failed"
    );
  }
};
