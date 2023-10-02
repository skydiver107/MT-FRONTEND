import Footer from "@/layouts/footer";
import HeaderRoutes from "@/layouts/headerRoutes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import { useResize } from "@/utils/helper";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useDispatch, useSelector } from "react-redux";

export default function Wallet() {
  const title: any = "Wallet";
  const router = useRouter();
  const { isResponsive } = useResize();
  const [bankAccounts, setBankAccounts] = useState<any>([]);
  const [detailedBankData, setDetailedBankData] = useState<any>();

  const userStore = useSelector((state: any) => state.userStore);

  const { t } = useTranslation(["wallet"]);

  const getBankAccountByAccessToken = async (access_token: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/get_bank_accounts`,
        {
          access_token: access_token,
        }
      )
      .then((res: any) => {
        setDetailedBankData(res.data.accounts[0]);
      })
      .catch((e) => {
        console.log(e);
      });
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

  useEffect(() => {
    (async () => {
      const userId = sessionStorage.getItem("userId");
      const itemId = sessionStorage.getItem("itemId");

      if (itemId == null) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/accounts`,
            {
              userId: userId,
            }
          )
          .then((res: any) => {
            getBankAccountByAccessToken(res.data.accounts[0].accessToken);
            setBankAccounts(res.data.accounts);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/getBankAccountbyItemId`,
            {
              itemId: itemId,
            }
          )
          .then(async (res: any) => {
            await getBankAccountByAccessToken(res.data.accounts[0].accessToken);
            setBankAccounts(res.data.accounts);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })();
  }, []);

  return (
    <div>
      <HeaderRoutes title={t("wallet")} />
      <div className="pl-6 pr-6 mt-4 flex justify-center">
        <div className="general_wrapper">
          <div className="flex justify-between">
            <div className="profile_general mt-1">{t("balances")}</div>
            <div className="profile_general mt-1">
              {userStore.mtcAmount} USD
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex">
              <div className="token_price ml-6">{t("name")}</div>
              <div className="token_price ml-6">{t("price")}</div>
            </div>
            <div className="token_price mr-12">{t("total")}</div>
          </div>

          <Button
            className="w-100 token_button mt-2"
            style={{ justifyContent: "flex-start", marginTop: "8px" }}
          >
            <div className="w-100 mt-1">
              <div className="flex justify-between ml-4 mr-4">
                <div className="flex mt-1">
                  <div className="token_type">MTC</div>
                  <div className="token_price ml-6">$ 1.00</div>
                </div>
                <div className="flex">
                  <div className="token_amount mt-1 mr-2">
                    $ {userStore.mtcAmount}
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </Button>

          <Accordion
            sx={{
              justifyContent: "flex-start",
              marginTop: "16px",
              borderRadius: "25px",
              border: "none",
              "&:before": {
                display: "none",
              },
              boxShadow: `0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important`,
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon className="mt-2" sx={{ color: "black" }} />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                alignItems: "center",
                display: "flex",
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  marginTop: "16px",
                  color: "black",
                },
              }}
            >
              <div className="w-100 mt-1">
                <div className="flex justify-between ml-2 mr-4">
                  <div className="flex mt-1">
                    <div className="token_type">{t("bank_account")}</div>
                    <div className="token_price ml-6">(2410-Debit)</div>
                  </div>
                  <div className="flex">
                    <div className="token_amount mt-1 mr-0">$ 2000</div>
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="token_amount mt-1 mr-2 ml-2">
                Name :{" "}
                {bankAccounts &&
                  bankAccounts.length > 0 &&
                  bankAccounts[0].institutionName}
              </div>
              <div className="token_amount mt-1 mr-2 ml-2">
                Account Name :{" "}
                {bankAccounts &&
                  bankAccounts.length > 0 &&
                  bankAccounts[0].accountName}
              </div>

              <div className="token_amount mt-1 mr-2 ml-2">
                Currency Code :{" "}
                {detailedBankData &&
                  detailedBankData.balances.iso_currency_code}
              </div>

              <div className="token_amount mt-1 mr-2 ml-2">
                Mask : **** {detailedBankData && detailedBankData.mask}
              </div>

              <div className="token_amount mt-1 mr-2 ml-2">
                Official Name :{" "}
                {detailedBankData && detailedBankData.official_name}
              </div>
            </AccordionDetails>
          </Accordion>

          <Button
            className="w-100 token_button mt-2"
            style={{ justifyContent: "flex-start", marginTop: "16px" }}
          >
            <div className="w-100 mt-1">
              <div className="flex justify-between ml-4 mr-4">
                <div className="flex mt-1">
                  <div className="token_type">USDC</div>
                  <div className="token_price ml-6">$ 1.00(Stable Coin)</div>
                </div>
                <div className="flex">
                  <div className="token_amount mt-1 mr-2">$ 0</div>
                  <div></div>
                </div>
              </div>
            </div>
          </Button>

          <div className="profile_general mt-12">{t("linked_accounts")}</div>
          <div className="flex justify-between mt-4">
            <Button
              className="link_account_button"
              onClick={() => router.push("/selectFundType")}
              // onClick={cakePaymentProcess}
              sx={{ borderRadius: "16px" }}
            >
              <div>
                <div className="flex justify-center mt-2">
                  <Image
                    src="/icons/addfund.svg"
                    width={27}
                    height={25}
                    alt="error"
                  />
                </div>
                <div className="token_type flex justify-center mt-1">
                  {t("add_funds")}
                </div>
              </div>
            </Button>

            <Button
              className="link_account_button"
              onClick={() => router.push("/transfer/transfer")}
              sx={{ borderRadius: "16px" }}
            >
              <div>
                <div className="flex justify-center mt-2">
                  <Image
                    src="/icons/withdraw_transfer.svg"
                    width={30}
                    height={28}
                    alt="error"
                  />
                </div>
                {isResponsive ? (
                  <>
                    <div className="token_type flex justify-center mt-1">
                      {t("withdraw")}/
                    </div>
                    <div
                      className="token_type flex justify-center"
                      style={{ marginTop: "-7px" }}
                    >
                      {t("transfer")}
                    </div>
                  </>
                ) : (
                  <div className="token_type flex justify-center mt-1">
                    {t("withdraw_transfer")}
                  </div>
                )}
              </div>
            </Button>

            <Button
              className="link_account_button"
              sx={{ borderRadius: "16px" }}
            >
              <div>
                <div className="flex justify-center mt-2">
                  <Image
                    src="/icons/link_account.svg"
                    width={30}
                    height={28}
                    alt="error"
                  />
                </div>
                {isResponsive ? (
                  <>
                    <div className="token_type flex justify-center mt-1">
                      {t("link")}
                    </div>
                    <div
                      className="token_type flex justify-center"
                      style={{ marginTop: "-7px" }}
                    >
                      {t("accounts")}
                    </div>
                  </>
                ) : (
                  <div className="token_type flex justify-center mt-1">
                    {t("link_accounts")}
                  </div>
                )}
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
    ...(await serverSideTranslations(locale ?? "en", ["wallet"])),
  },
});
