import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useResize } from "@/utils/helper";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import { PlaidLink } from "react-plaid-link";
import axios from "axios";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// for loading spinner
import { Oval } from "react-loader-spinner";

export default function AddPlaid() {
  const title: any = "Link Bank Account";
  const router = useRouter();
  const { isMobile } = useResize();

  const { t } = useTranslation("common");

  // for plaid state variables
  const [linkToken, setLinkToken] = useState("");
  const [linked, setLinked] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [balance_amount, setBalance_amount] = useState();
  const [currency_code, setCurrency_code] = useState("");
  const [official_name, setOfficial_name] = useState("");

  // bank accounts
  const [bankAccounts, setBankAccounts] = useState<any[]>();
  const [detailedBankData, setDetailedBankData] = useState<any[]>([]);

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  //Rest apis
  const createLinkToken = async () => {
    setLoading(true);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/create_link_token`
    );

    setLinkToken(response.data.link_token);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    setLoading(false);
  };

  const exchangePublicToken = async (token: string) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/exchange_public_token`,
      {
        token,
      }
    );
  };

  const getBalance = async (token: string) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/get_balance`,
      {
        token,
      }
    );
  };

  const handleOnSuccess = async (public_token: string, metadata: any) => {
    setLoading(true);
    console.log("==============Success==============");
    console.log("plaid metadata is", metadata);
    const userId = sessionStorage.getItem("userId");

    const plaidData = {
      public_token: public_token,
      metadata: metadata,
      userId: userId,
    };

    console.log("current plaid data is", plaidData);
    try {
      const response = await exchangePublicToken(public_token);

      sessionStorage.setItem("accessToken_plaid", response.data.access_token);
      sessionStorage.setItem("publicToken_plaid", public_token);

      try {
        const res = await getBalance(response.data.access_token);

        console.log(res.data);
        setOfficial_name(res.data.official_name);
        setBalance_amount(res.data.balances.available);
        setCurrency_code(res.data.balances.iso_currency_code);
        setAccountId(res.data.account_id);
        setLinked(true);

        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/addAccount`,
            plaidData
          )
          .then((res) => {
            sessionStorage.setItem("itemId", res.data.itemId);
            console.log("response is", res);
          })
          .catch((e) => {
            console.log(e);
          });

        sessionStorage.setItem("account_id_plaid", res.data.account_id);
        router.push("/fundWallet");
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const handleOnLoad = () => {
    console.log("==============OnLoad===========");
  };

  const getBankAccounts = async () => {
    const userId = sessionStorage.getItem("userId");
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/accounts`, {
        userId: userId,
      })
      .then((res: any) => {
        setBankAccounts(res.data.accounts);
        res.data.accounts &&
          res.data.accounts.length > 0 &&
          res.data.accounts.forEach(async function (bankAccount: any) {
            await axios
              .post(
                `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/plaid/get_bank_accounts`,
                {
                  access_token: bankAccount.accessToken,
                }
              )
              .then((response: any) => {
                detailedBankData.push(response.data.accounts[0]);
              })
              .catch((e) => {
                console.log(e);
              });
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const continuePayment = () => {
    {
      bankAccounts &&
        sessionStorage.setItem("itemId", bankAccounts[Number(value)].itemId);
      router.push("/fundWallet");
    }
  };

  useEffect(() => {
    sessionStorage.setItem("paymentMethod", "plaid");
    createLinkToken();
  }, []);

  useEffect(() => {
    (async () => {
      await getBankAccounts();
    })();
  }, []);

  return (
    <div>
      <HeaderRoutes title={t("live_bank_account")} />

      <div className="flex justify-center">
        {loading && (
          <div className="flex justify-center items-center text-center mt-64 w-100">
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
        {!loading && (
          <div
            className="select_method_wrapper flex"
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "calc(100vh - 127px)",
            }}
          >
            <div>
              <div className="select_method_title flex justify-center text-center">
                Continue with a saved account or add a new one...
              </div>

              <div className="select_method_title flex justify-center text-center mb-4">
                Your Bank Accounts
              </div>

              <div className="mt-4">
                <FormControl className="w-100">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={handleChange}
                  >
                    {bankAccounts &&
                      !loading &&
                      //   bankAccounts.length > 0 &&
                      //   detailedBankData &&
                      //   linkToken.toString() !== "" &&
                      bankAccounts.map((bankAccount: any, index: any) => (
                        <div key={index}>
                          <div
                            className={
                              value == index
                                ? "stripe_user_card_active mt-2 mb-2"
                                : "stripe_user_card mt-2 mb-2"
                            }
                          >
                            <FormControlLabel
                              value={index}
                              control={<Radio />}
                              label={
                                <div className="card_title ml-4">
                                  {bankAccount.institutionName}
                                  <div>
                                    {value && value == index ? (
                                      <>
                                        <div className="flex mt-1">
                                          <div className="bank_account_title">
                                            Account Name: &nbsp;
                                          </div>
                                          <div className="card_title">
                                            {bankAccounts[
                                              Number(value)
                                            ].accountName.toUpperCase()}
                                          </div>
                                        </div>
                                        <div className="flex mt-1">
                                          <div className="bank_account_title">
                                            Account Number: &nbsp;
                                          </div>
                                          {detailedBankData.length == 0 && (
                                            <div className="card_title">
                                              Loading...
                                            </div>
                                          )}
                                          {detailedBankData.length > 0 && (
                                            <div className="card_title">
                                              ****{" "}
                                              {
                                                detailedBankData[Number(value)]
                                                  .mask
                                              }
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex mt-1">
                                          <div className="bank_account_title">
                                            Account Type: &nbsp;
                                          </div>
                                          <div className="card_title">
                                            {bankAccounts[
                                              Number(value)
                                            ].accountType.toUpperCase()}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                              }
                            />
                          </div>
                        </div>
                      ))}
                  </RadioGroup>
                </FormControl>
              </div>

              {bankAccounts && bankAccounts.length == 0 && (
                <div>
                  <div className="flex justify-center text-center mb-4">
                    Please Add Your Bank Account...
                  </div>
                </div>
              )}
            </div>

            <div className="bankcard_button_wrapper mt-8 mb-8">
              <div>
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
              <div>
                {linkToken.toString() !== "" ? (
                  <PlaidLink
                    clientName="Moneto_Plaid_Setup"
                    env={process.env.NEXT_PUBLIC_ENVIRONMENT}
                    token={linkToken.toString()}
                    product={["auth", "transactions"]}
                    onLoad={handleOnLoad}
                    onSuccess={handleOnSuccess}
                    onEvent={() => {}}
                    className="w-100"
                    style={{
                      border: "none",
                      padding: "0px",
                      marginTop: "10px",
                    }}
                  >
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
                    >
                      {t("create_a_bank_account")}
                    </Button>
                  </PlaidLink>
                ) : (
                  <Button
                    className="w-100"
                    style={{
                      background: `#1380FF`,
                      borderRadius: "50px",
                      color: "#FFFF",
                      height: "50px",
                      textTransform: "none",
                      fontFamily: "Karla_Bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("loading_plaid")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
