import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";

import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { toast } from "react-toastify";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setStore, resetStore } from "@/redux/actions";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// for loading spinner
import { Oval } from "react-loader-spinner";

export default function SelectStripeCard() {
  const router = useRouter();
  const title: any = "Checkout";
  const [value, setValue] = useState("");

  const [cards, setCards] = useState<any[]>([]);
  const { t } = useTranslation("common");

  const userStore = useSelector((state: any) => state.userStore);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const continuePayment = () => {
    sessionStorage.setItem("cardId", value);
    sessionStorage.setItem("paymentMethod", "stripe");
    router.push("/fundWallet");
  };

  useEffect(() => {
    const getCards = async () => {
      const email = sessionStorage.getItem("email");
      const customerId = sessionStorage.getItem("customerId");
      if (email === undefined) return;
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/getCardsByUser`, {
          params: {
            customerId,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setCards([...cards, response.data.data.data]);
          } else {
            toast("Please add a card to continue.", {
              hideProgressBar: false,
              autoClose: 3000,
              type: "error",
              theme: "dark",
            });
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };

    getCards();
  }, []);

  return (
    <div>
      <HeaderRoutes title={t("checkout")} />
      <div className="flex justify-center">
        <div
          className="select_method_wrapper flex"
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "calc(100vh - 127px)",
          }}
        >
          <div>
            <div className="select_method_title">
              {t("select_payment_method")}
            </div>
            <div className="mt-4 flex justify-end">
              <div
                className="add_card_button"
                onClick={() => router.push("/card/addcard")}
              >
                {t("add_new_card")}
              </div>
            </div>
            <div className="mt-4">
              <FormControl className="w-100">
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  onChange={handleChange}
                >
                  {cards && cards.length == 0 && (
                    <div className="flex justify-center items-center text-center mt-32 w-100">
                      <Oval
                        height={80}
                        width={80}
                        color="#1380FF"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="#1380FF"
                        strokeWidth={6}
                        strokeWidthSecondary={6}
                      />
                    </div>
                  )}
                  {cards &&
                    cards.length > 0 &&
                    cards[0].map((card: any) => (
                      <div key={card.id}>
                        <div
                          className={
                            value == card.id
                              ? "stripe_user_card_active mt-4 mb-2"
                              : "stripe_user_card mt-4 mb-2"
                          }
                        >
                          <FormControlLabel
                            value={card.id}
                            control={<Radio />}
                            label={
                              <div className="card_title">
                                {card.brand}Card ****{card.last4}
                              </div>
                            }
                          />
                          <div className="card_name">{card.name}</div>
                          <div className="card_expiry mt-2">{t("expires")}</div>
                          <div className="card_expiry">
                            {card.exp_month}/{card.exp_year}
                          </div>
                        </div>
                      </div>
                    ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>

          <div className="selectcard_button_wrapper mt-8 mb-8">
            {value && (
              <Button
                className="w-100"
                onClick={continuePayment}
                style={{
                  background: `#1380FF`,
                  borderRadius: "50px",
                  color: "#FFFF",
                  height: "50px",
                  textTransform: "none",
                  fontFamily: "Karla_Bold",
                }}
              >
                {t("continue")}
              </Button>
            )}
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
