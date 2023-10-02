import Image from "next/image";
import { useRouter } from "next/router";
// import Button from "@/components/button";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";
import Footer from "@/layouts/footer";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";

export default function SelectFundType() {
  const router = useRouter();
  const title = "Fund Wallet";

  const { t } = useTranslation("common");

  const createSession = async () => {
    const response: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/cakepayment/createSessionUrl`,
      {
        amount: 50,
      }
    );
    router.push(response.data.data);
    return response.data;
  };

  const cakePaymentProcess = async () => {
    const email: any = sessionStorage.getItem("email");
    const orderIdResponse: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/cakepayment/createOrderId`,
      {
        email: email,
      }
    );
    if (orderIdResponse.data.success) {
      sessionStorage.setItem("cake_orderid", orderIdResponse.data.data.orderId);
    }
    sessionStorage.setItem("paymentMethod", "cakepayment");
    router.push("/fundWallet");
  };

  return (
    <div>
      <HeaderRoutes title={t("fund_wallet")} />
      <div className="pl-6 pr-6 mt-4 flex justify-center">
        <div className="general_wrapper">
          <div className="profile_general mt-4">{t("how_to_fund")}</div>

          <div className="flex justify-center mt-6 w-100">
            <Button
              className="w-100"
              onClick={() => router.push("/bank")}
              style={{
                borderRadius: "50px",
                height: "50px",
                textTransform: "none",
                fontFamily: "Karla_Bold",
                boxShadow: `0px 1px 4px 0px rgba(0, 0, 0, 0.25)`,
                justifyContent: "flex-start",
                paddingLeft: "30px",
              }}
            >
              <div className="flex justify-start items-center text-center">
                <div style={{ color: "black", fontSize: "16px" }}>
                  {t("bank_account")}
                </div>
              </div>
            </Button>
          </div>
          <div className="flex justify-center mt-4 w-100 mb-4">
            <Button
              className="w-100"
              style={{
                borderRadius: "50px",
                height: "50px",
                textTransform: "none",
                fontFamily: "Karla_Bold",
                boxShadow: `0px 1px 4px 0px rgba(0, 0, 0, 0.25)`,
                justifyContent: "flex-start",
                paddingLeft: "30px",
              }}
              onClick={() => router.push("/card/selectcard")}
            >
              <div>
                <div className="flex">
                  <div style={{ color: "black", fontSize: "16px" }}>
                    {t("credit_card")}
                  </div>
                </div>
              </div>
            </Button>
          </div>
          <div className="flex justify-center mt-4 w-100 mb-4">
            <Button
              className="w-100"
              style={{
                borderRadius: "50px",
                height: "50px",
                textTransform: "none",
                fontFamily: "Karla_Bold",
                boxShadow: `0px 1px 4px 0px rgba(0, 0, 0, 0.25)`,
                justifyContent: "flex-start",
                paddingLeft: "30px",
              }}
              onClick={cakePaymentProcess}
            >
              <div>
                <div className="flex">
                  <div style={{ color: "black", fontSize: "16px" }}>
                    {t("cake_capital")}
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
