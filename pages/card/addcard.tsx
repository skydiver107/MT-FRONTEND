import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";
import TextField from "@mui/material/TextField";
import Cards from "react-credit-cards-2";
import { useState } from "react";
import { formatExpirationDate } from "@/utils/cardformatter";
import axios from "axios";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setStore, resetStore } from "@/redux/actions";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// for stripe
import {
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import "react-credit-cards-2/dist/lib/styles.scss";

import { toast } from "react-toastify";

export default function AddStripeCard() {
  const router = useRouter();
  const title: any = "New Card";

  const stripe = useStripe();
  const elements = useElements();

  const userStore = useSelector((state: any) => state.userStore);

  const { t } = useTranslation("common");

  const textFieldStyle = {
    "& label": {
      left: "20px",
    },
    "& legend": {
      textAlign: "left",
      marginLeft: "20px",
    },
    "& input": {
      marginLeft: "25px",
    },
  };

  const [cardState, setCardState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focused: "name",
  });

  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [dateCheck, setDateCheck] = useState(false);

  const validateDate = (dateString: any) => {
    const month = parseInt(dateString.split("/")[0], 10);
    const year = parseInt(dateString.split("/")[1], 10);
    const currentYear = new Date().getFullYear() - 2000;
    if (month > 12) {
      return false;
    }
    if (year < currentYear) {
      return false;
    }
    return true;
  };

  const handleInputChange = (evt: any) => {
    if (evt.target.name === "expiry") {
      evt.target.value = formatExpirationDate(evt?.target.value);
      const inputDate: any = evt.target.value;
      if (validateDate(inputDate)) {
        setDateCheck(true);
      } else {
        setDateCheck(false);
      }
    }

    if (evt.target.name === "number") {
      evt.target.value =
        evt.target.value
          .replace(/\s|[^0-9]+/g, "")
          .match(/.{1,4}/g)
          ?.join(" ") ?? "";
    }

    if (evt.target.name === "cvc") {
      let input = evt.target.value;
      input = input.replace(/[^0-9]/g, "");
      let formattedInput = "";
      formattedInput = input.substr(0, 4);
      evt.target.value = formattedInput;
    }

    const { name, value } = evt.target;

    setCardState((prev) => ({ ...prev, [name]: value }));
  };

  const addCard = async () => {
    const email = sessionStorage.getItem("email");
    const customerId = sessionStorage.getItem("customerId");

    const splittedExpiry = cardState?.expiry.split("/", 2);

    if (cardState.number == "") {
      toast("Please Input Your Card Number", {
        hideProgressBar: false,
        autoClose: 3000,
        type: "error",
        theme: "dark",
      });
      return;
    }

    if (cardState.name == "") {
      toast("Please Input Your Name on Card", {
        hideProgressBar: false,
        autoClose: 3000,
        type: "error",
        theme: "dark",
      });
      return;
    }

    if (dateCheck == false) {
      toast("Your Card is Expired.", {
        hideProgressBar: false,
        autoClose: 3000,
        type: "error",
        theme: "dark",
      });
      return;
    }

    if (cardState.cvc == "") {
      toast("Please Input Your CVC", {
        hideProgressBar: false,
        autoClose: 3000,
        type: "error",
        theme: "dark",
      });
      return;
    }

    setExpiryMonth(splittedExpiry[0]);
    setExpiryYear(splittedExpiry[1]);

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/addStripeCard`, {
        id: userStore.id,
        customerId: customerId,
        cardNumber: cardState.number,
        cardName: cardState.name,
        expiryMonth: splittedExpiry[0],
        expiryYear: splittedExpiry[1],
        cvv: cardState.cvc,
      })
      .then((response) => {
        // console.log("response is", response);
        if (response.data.success) {
          toast(`${response.data.message}`, {
            hideProgressBar: false,
            autoClose: 3000,
            type: "success",
            theme: "dark",
          });
          router.replace("/card/selectcard");
        } else if (response.data.success == false) {
          toast(`${response.data.message}`, {
            hideProgressBar: false,
            autoClose: 3000,
            type: "error",
            theme: "dark",
          });
        }
      })
      .catch((e) => {
        const { errors: formErrors } = e.response.data;
        e.value = formErrors;
      });
  };

  const handleInputFocus = (evt: any) => {
    setCardState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <div>
      <HeaderRoutes title={t("new_card")} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div className="select_method_title">{t("enter_your_card")}</div>
          <div className="mt-4">
            <Cards
              number={cardState.number}
              expiry={cardState.expiry}
              cvc={cardState.cvc}
              name={cardState.name}
            />
          </div>

          <TextField
            name="number"
            value={cardState.number}
            label={t("card_number")}
            style={{
              color: "#393CDC",
              borderRadius: "30px",
              marginTop: "30px",
            }}
            onChange={handleInputChange}
            sx={textFieldStyle}
            placeholder="2453 3441 9055 2251"
            fullWidth
            variant="outlined"
            inputProps={{ maxLength: 19 }}
          />

          <TextField
            label={t("name_on_card")}
            name="name"
            value={cardState.name}
            onChange={handleInputChange}
            style={{
              color: "#393CDC",
              borderRadius: "30px",
              marginTop: "30px",
            }}
            sx={textFieldStyle}
            placeholder="Eli Zhang"
            fullWidth
          />
          <div className="flex">
            <TextField
              label={t("expiry_date")}
              name="expiry"
              value={cardState.expiry}
              onChange={handleInputChange}
              style={{
                color: "#393CDC",
                borderRadius: "30px",
                marginTop: "30px",
              }}
              sx={textFieldStyle}
              placeholder="MM/YY"
              fullWidth
            />
            <TextField
              label="CVC"
              name="cvc"
              value={cardState.cvc}
              onChange={handleInputChange}
              style={{
                color: "#393CDC",
                borderRadius: "30px",
                marginTop: "30px",
                marginLeft: "20px",
              }}
              sx={textFieldStyle}
              placeholder="466"
              fullWidth
              inputProps={{ pattern: "/^[0-9]{3,4}$/" }}
            />
          </div>
          <div className="flex justify-end mt-8">
            <Button
              className="w-100"
              onClick={() => addCard()}
              style={{
                background: `#1380FF`,
                borderRadius: "50px",
                color: "#FFFF",
                height: "50px",
                textTransform: "none",
                fontFamily: "Karla_Bold",
              }}
            >
              {t("add_your_card")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
