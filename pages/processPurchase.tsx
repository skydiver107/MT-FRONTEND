import { useRouter } from "next/router";
import Button from "@/components/button";
import HeaderConfirm from "@/layouts/headerConfirm";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProcessPurchase() {
  const title: any = "Fund Wallet";
  const router = useRouter();
  const query = router.query;
  const [redirectSeconds, setRedirectSeconds] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      const interval = setInterval(() => {
        if (redirectSeconds > 0) {
          setRedirectSeconds(redirectSeconds - 1);
        } else {
          clearInterval(interval);
          const successPayment = async () => {
            const { userId, amount, name } = router.query;
            const itemId = sessionStorage.getItem("itemId");
            const paymentMethod = sessionStorage.getItem("paymentMethod");
            const customerId = sessionStorage.getItem("customerId");
            const cardId = sessionStorage.getItem("cardId");

            axios
              .post(
                `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/balanceTransfer`,
                {
                  userId: Number(userId),
                  actionType: 1,
                  amount: Number(amount),
                  name: name,
                  itemId: itemId,
                  paymentMethod: paymentMethod,
                  customerId: customerId,
                  cardId: cardId,
                }
              )
              .then((r) => {
                const { success, message } = r.data;

                toast(`${message}`, {
                  hideProgressBar: false,
                  autoClose: 3000,
                  type: success ? "success" : "error",
                  theme: "dark",
                });
              })
              .catch((e) => {
                console.error(e.response.data);
              });
          };

          successPayment();

          router.push("/successPurchase");
        }
      }, 1000);
    }, 1000);
  }, [redirectSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <HeaderConfirm title={title} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div className="flex justify-center">
            <Image
              src="/assets/confirm.gif"
              width={500}
              height={500}
              alt="GIF"
            />
          </div>
          <div>
            <div
              style={{
                color: `#070707`,
                textAlign: `center`,
                fontSize: `20px`,
                fontFamily: `Karla_Bold`,
                fontWeight: `500`,
                lineHeight: `32px`,
              }}
            >
              Processing Payment
            </div>
            <div
              className="mt-2"
              style={{
                color: `#6A707C`,
                textAlign: `center`,
                fontSize: `15px`,
                fontFamily: `Karla_Bold`,
                fontWeight: `500`,
                lineHeight: `20px`,
              }}
            >
              This may take a moment...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
