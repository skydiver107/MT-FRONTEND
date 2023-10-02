import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderConfirm from "@/layouts/headerConfirm";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setStore, resetStore } from "@/redux/actions";

export default function ConfirmPurchase() {
  const title: any = "Fund Wallet";
  const router = useRouter();
  const userStore = useSelector((state: any) => state.userStore);

  const [mtcAmount, setMtcAmount] = useState<any>();
  const [paymentMethod, setPaymentMethod] = useState<any>("");
  const [account_id_plaid, setAccountIdPlaid] = useState<any>("");
  const [plaidAccounts, setPlaidAccounts] = useState<any[]>();

  enum paymentType {
    Stripe = "stripe",
    CakePayment = "cakepayment",
    Plaid = "plaid",
  }

  useEffect(() => {
    const amount: any = sessionStorage.getItem("amount");
    const paymentMethod: any = sessionStorage.getItem("paymentMethod");
    const account_id: any = sessionStorage.getItem("account_id_plaid");
    const method: any = sessionStorage.getItem("paymentMethod");

    setPaymentMethod(method);
    setAccountIdPlaid(account_id);

    setMtcAmount(amount);

    if (amount == null || paymentMethod == null) {
      router.push("/wallet");
    }
  }, []);

  const makeStripePaymentByCustomerId = async () => {
    const customerId = sessionStorage.getItem("customerId");
    const cardId = sessionStorage.getItem("cardId");
    const body = {
      product: {
        name: "MTC",
        price: parseInt(mtcAmount),
        productOwner: "Moneto",
        description: "1 MTC equals to 1 USD",
        quantity: 1,
      },
      user: {
        customerId: customerId,
        cardId: cardId,
        userId: userStore.id,
        paymentType: "stripe",
      },
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/v1/payment_intents`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );
    const responseData = await response.json();
    if (
      responseData.paymentIntent.status &&
      responseData.paymentIntent.status == "succeeded"
    ) {
      router.push(responseData.success_url);
    } else {
      router.push(responseData.cancel_url);
    }
  };

  // plaid payment
  const makePaymentByPlaid = async (tx_type: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/make_payment`,
      {
        account_id: account_id_plaid,
        amount: parseInt(mtcAmount),
        user_id: userStore.id,
        tx_type: tx_type,
        paymentType: "plaid",
      }
    );

    if (response.data.success == "Success") {
      router.push(`/${response.data.url}`);
    } else {
      window.alert("Failed Payment! Please check your network status.");
      console.log("Payment is not done");
    }
  };

  const getBankAccounts = async () => {
    const accessToken = sessionStorage.getItem("accessToken_plaid");

    // Fetch bank account information from the backend using the access_token
    await fetchAccounts(accessToken);
  };

  const fetchAccounts = async (accessToken: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/get_bank_accounts`,
        {
          method: "POST",
          body: JSON.stringify({ access_token: accessToken }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("data is", data);
      setPlaidAccounts(data.accounts);
    } catch (error) {
      console.error("Error fetching bank account information:", error);
    }
  };

  const createSession = async () => {
    const order_id: any = sessionStorage.getItem("cake_orderid");
    const user_id: any = sessionStorage.getItem("userId");
    const response: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/cakepayment/createSessionUrl`,
      {
        amount: parseInt(mtcAmount),
        order_id: order_id,
        user_id: user_id,
        tx_type: "mtc",
      }
    );
    console.log("response", response.data);
    if (response.data.success == false) {
      toast("Cakepayment service may not be running.", {
        hideProgressBar: false,
        autoClose: 3000,
        type: "error",
        theme: "dark",
      });
      return;
    }
    router.push(response.data.data);
    return response.data;
  };

  const paymentAction = async () => {
    switch (paymentMethod) {
      case paymentType.Stripe: {
        await makeStripePaymentByCustomerId();
        break;
      }
      case paymentType.CakePayment: {
        await createSession();
        break;
      }
      case paymentType.Plaid: {
        await makePaymentByPlaid("MTC");
        break;
      }
    }
  };

  return (
    <div>
      <HeaderConfirm title={title} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div className="select_method_title">Please Confirm Your Payment</div>
          <div className="mt-8">
            <div className="flex justify-between">
              <div className="confirm_balance">{mtcAmount} MTC</div>
              <div className="confirm_balance">${mtcAmount}</div>
            </div>
            <div className="flex justify-between mt-4 mb-2">
              <div className="confirm_fee">Credit Card Fee</div>
              <div className="confirm_fee">$0</div>
            </div>
          </div>

          <Divider />

          <div className="flex justify-between mt-2">
            <div className="confirm_balance">Total</div>
            <div className="confirm_balance">${mtcAmount}</div>
          </div>

          <div className="flex justify-between mt-4 mb-2">
            <div className="confirm_fee" style={{ fontSize: "12px" }}>
              {/* Charged to Platinum MC **56{" "} */}
            </div>
          </div>

          <div className="bottom_button_wrapper">
            <div className="block w-100">
              <div className="mt-4">
                <Button
                  className="w-100"
                  style={{
                    background: `#CBCFD3`,
                    borderRadius: "50px",
                    color: "#FFFF",
                    height: "50px",
                    textTransform: "none",
                    fontFamily: "Karla_Bold",
                  }}
                  onClick={() => router.push("/fundWallet")}
                >
                  Cancel
                </Button>
              </div>

              <div className="mt-4">
                <Button
                  className="w-100"
                  style={{
                    background: `#1380FF`,
                    borderRadius: "50px",
                    color: "#FFFF",
                    height: "50px",
                    textTransform: "none",
                    fontFamily: "Karla_Bold",
                  }}
                  onClick={paymentAction}
                >
                  Correct - PAY NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
