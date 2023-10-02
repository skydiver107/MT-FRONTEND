import HeaderRoutes from "@/layouts/headerRoutes";
import Footer from "@/layouts/footer";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useResize } from "@/utils/helper";
import { useRouter } from "next/router";

import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Image from "next/image";

import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Container, InputAdornment, TextField } from "@mui/material";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// for loading spinner
import { Oval } from "react-loader-spinner";

export default function Transaction() {
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: "#6B6B6B",
    fontSize: "12px",
    fontFamily: "Karla_Bold",
    fontWeight: "500",
    lineHeight: "22px",
    padding: isMobile ? "5px 10px" : "10px 40px",
    marginLeft: "5px",
    marginRight: "5px",
    "&:hover": {
      color: "black",
    },
    borderRadius: "50px",
    background: "white",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  }));

  const { isMobile } = useResize();
  // modal style
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "white",
    borderRadius: "50px",
    boxShadow: 24,
    outline: "none",
    p: 4,
  };

  const [openedModal, setOpenedModal] = useState<any>();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // get search keyword
  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
    searchTransactions(event.target.value);
  };

  const openModal = (id: any) => {
    setOpenedModal(id);
  };
  const closeModal = () => {
    setOpenedModal(null);
  };

  const { t } = useTranslation(["transaction"]);

  const userStore = useSelector((state: any) => state.userStore);
  const [result, setResult] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);

  const getAllTransactions = async () => {
    setLoading(true);
    const userId = sessionStorage.getItem("userId");
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/getAllBalanceHistory`,
        {
          userId: userId,
        }
      )
      .then((res: any) => {
        console.log("res data", res.data.history);
        setResult(res.data.history);
        setTransactions(res.data.history);
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
  };

  const getAll = async () => {
    setResult([]);
    await getAllTransactions();
  };

  const searchTransactions = async (term: any) => {
    setLoading(true);
    console.log("term", term);
    if (term == "") {
      setResult(transactions);
      setLoading(false);
      return;
    }
    const filteredTx: any = transactions.filter((result: any) => {
      return (
        result.institutionName?.toLowerCase().includes(term.toLowerCase()) ||
        result.brand?.toLowerCase().includes(term.toLowerCase())
      );
    });
    console.log("searched", filteredTx);
    setResult(filteredTx);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getAllTransactions();
    })();
  }, []);

  return (
    <div>
      <div className="header_logo">
        <div className="block" style={{ width: isMobile ? "90%" : "70%" }}>
          <div className="flex justify-center">
            <Image
              src="/assets/moneto_logo_small.svg"
              width={170}
              height={30}
              alt="error"
              onClick={() => router.push("/profile")}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="flex justify-between">
            <div className="flex text-center justify-start mt-4">
              <div className="flex items-center ml-4 header_button_title">
                {t("transactions")}
              </div>
            </div>

            <div className="flex items-center text-center justify-center mt-4">
              <TuneOutlinedIcon sx={{ color: "white" }} />
            </div>
          </div>

          <div>
            <TextField
              type="search"
              // label="Search"
              value={searchTerm}
              onChange={handleChange}
              InputLabelProps={{ shrink: false }}
              placeholder="Search by Bank or Card Name"
              fullWidth
              style={{
                borderRadius: "30px !important",
                marginTop: "30px",
              }}
              sx={{
                "& label": {
                  left: "20px",
                  // display: "none",
                },

                "& input": {
                  marginLeft: "15px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="mt-4 flex justify-between">
            <ColorButton
              sx={{
                backgroundColor: "white !important",
              }}
              onClick={() => getAll()}
            >
              {t("all")}
            </ColorButton>
            <ColorButton
              sx={{
                backgroundColor: "white !important",
              }}
            >
              {t("deposits")}
            </ColorButton>
            <ColorButton
              sx={{
                backgroundColor: "white !important",
              }}
            >
              {t("transfers")}
            </ColorButton>
            <ColorButton
              sx={{
                backgroundColor: "white !important",
              }}
            >
              {t("withdrawal")}
            </ColorButton>
          </div>
        </div>
      </div>

      {loading && (
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
      <div className="pl-6 pr-6 mt-4 flex justify-center mb-32">
        <div className="general_wrapper">
          {result &&
            result.length > 0 &&
            result.map((history: any, index: any) => (
              <div key={index}>
                {result &&
                  result.length > 0 &&
                  result[index] &&
                  result[index].paymentMethod == "plaid" && (
                    <div>
                      <div
                        className="w-100 transaction_history_button mt-4"
                        onClick={() => openModal(index)}
                      >
                        <div className="flex">
                          <div className="tx_inner_circle"></div>
                          <div className="block w-100">
                            <div className="flex justify-between ml-4 mr-4">
                              <div className="tx_bankname">
                                {result &&
                                  result.length > 0 &&
                                  result[index] &&
                                  result[index].institutionName}
                              </div>
                              <div className="tx_bankname">
                                $ {history.amount}
                              </div>
                            </div>

                            <div className="flex justify-between ml-4 mr-4 ">
                              <div className="tx_type">Purchase MTC</div>
                              <div className="tx_type">
                                {result[index].diffDays > 0
                                  ? result[index].diffDays + " days ago"
                                  : result[index].diffHrs > 0
                                  ? result[index].diffHrs + " hrs ago"
                                  : result[index].diffMs + " min ago"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Modal
                        open={openedModal == index}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <div className="flex justify-between">
                            <div>
                              <div className="txn_details">Txn Details</div>
                              <div className="tx_bankname_bold mt-4">
                                {result &&
                                  result.length > 0 &&
                                  result[index] &&
                                  result[index].institutionName}
                              </div>
                              <div className="tx_category">
                                support@email.com
                              </div>
                            </div>
                            <div>
                              <div
                                className="tx_inner_circle"
                                style={{ width: "82px", height: "82px" }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between mt-8 items-center">
                            <div className="tx_category">Date</div>
                            <div className="tx_result">
                              {result[index].diffDays > 0
                                ? result[index].diffDays + " days ago"
                                : result[index].diffHrs > 0
                                ? result[index].diffHrs + " hrs ago"
                                : result[index].diffMs + " min ago"}
                            </div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Type</div>
                            <div className="tx_result">Purchase MTC</div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Amount</div>
                            <div className="tx_result">$ {history.amount}</div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Bank Account</div>
                            <div className="tx_result">
                              {result &&
                                result.length > 0 &&
                                result[index] &&
                                result[index].accountName}
                            </div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Account Number</div>
                            <div className="tx_result">
                              **** {history.last4}
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <div className="tx_category">Note</div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <div className="tx_result">
                              {"Ipsum Lorem Ips -->"}
                            </div>
                          </div>

                          <div className="mt-4">
                            <Divider />
                          </div>

                          <div className="mt-4 flex justify-between">
                            <div className="flex" style={{ cursor: "pointer" }}>
                              <div>
                                <ShareIcon />
                              </div>
                              <div
                                className="ml-8"
                                style={{ cursor: "pointer" }}
                              >
                                <FileDownloadOutlinedIcon />
                              </div>
                            </div>

                            <div
                              className="tx_bankname_bold"
                              style={{ cursor: "pointer" }}
                              onClick={closeModal}
                            >
                              Close
                            </div>
                          </div>
                        </Box>
                      </Modal>
                    </div>
                  )}
                {result &&
                  result.length > 0 &&
                  result[index] &&
                  result[index].paymentMethod == "stripe" && (
                    <div>
                      <div
                        className="w-100 transaction_history_button mt-4"
                        onClick={() => openModal(index)}
                      >
                        <div className="flex">
                          <div className="tx_inner_circle"></div>
                          <div className="block w-100">
                            <div className="flex justify-between ml-4 mr-4">
                              <div className="tx_bankname">
                                {result &&
                                  result.length > 0 &&
                                  result[index] &&
                                  result[index].brand}{" "}
                                Card
                              </div>
                              <div className="tx_bankname">
                                $ {history.amount}
                              </div>
                            </div>

                            <div className="flex justify-between ml-4 mr-4 ">
                              <div className="tx_type">Purchase MTC</div>
                              <div className="tx_type">
                                {result[index].diffDays > 0
                                  ? result[index].diffDays + " days ago"
                                  : result[index].diffHrs > 0
                                  ? result[index].diffHrs + " hrs ago"
                                  : result[index].diffMs + " min ago"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Modal
                        open={openedModal == index}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <div className="flex justify-between">
                            <div>
                              <div className="txn_details">Txn Details</div>
                              <div className="tx_bankname_bold mt-4">
                                {result &&
                                  result.length > 0 &&
                                  result[index] &&
                                  result[index].institutionName}
                              </div>
                              <div className="tx_category">
                                support@amebank.com
                              </div>
                            </div>
                            <div>
                              <div
                                className="tx_inner_circle"
                                style={{ width: "82px", height: "82px" }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between mt-8 items-center">
                            <div className="tx_category">Date</div>
                            <div className="tx_result">
                              {result[index].diffDays > 0
                                ? result[index].diffDays + " days ago"
                                : result[index].diffHrs > 0
                                ? result[index].diffHrs + " hrs ago"
                                : result[index].diffMs + " min ago"}
                            </div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Type</div>
                            <div className="tx_result">Purchase MTC</div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Amount</div>
                            <div className="tx_result">$ {history.amount}</div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Card Number</div>
                            <div className="tx_result">
                              ****{" "}
                              {result &&
                                result.length > 0 &&
                                result[index] &&
                                result[index].last4}
                            </div>
                          </div>
                          <div className="flex justify-between mt-4 items-center">
                            <div className="tx_category">Name On Card</div>
                            <div className="tx_result">
                              {result &&
                                result.length > 0 &&
                                result[index] &&
                                result[index].name}
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <div className="tx_category">Note</div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <div className="tx_result">
                              {"Ipsum Lorem Ips -->"}
                            </div>
                          </div>

                          <div className="mt-4">
                            <Divider />
                          </div>

                          <div className="mt-4 flex justify-between">
                            <div className="flex" style={{ cursor: "pointer" }}>
                              <div>
                                <ShareIcon />
                              </div>
                              <div
                                className="ml-8"
                                style={{ cursor: "pointer" }}
                              >
                                <FileDownloadOutlinedIcon />
                              </div>
                            </div>

                            <div
                              className="tx_bankname_bold"
                              style={{ cursor: "pointer" }}
                              onClick={closeModal}
                            >
                              Close
                            </div>
                          </div>
                        </Box>
                      </Modal>
                    </div>
                  )}
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["transaction"])),
  },
});
