import { useResize } from "@/utils/helper";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import IconButton from "@mui/material/IconButton";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Footer() {
  const { isMobile } = useResize();
  const { isResponsive } = useResize();
  const [path, setPath] = useState("");
  const router = useRouter();

  const { t } = useTranslation(["dashboard"]);

  const defaultButtonStyle = {
    background: "white !important",
    color: "darkgrey",
    height: "42px",
    width: "42px",
    marginTop: "20px",
    border: "1px groove #E5E5E5",
  };

  const activeStyle = {
    background:
      "linear-gradient(320deg, #5c52b3 0%, #4478d0 58.85%, #1eb4ff 100%) !important",
    color: "white",
    border: "1px solid #FFF",
    boxShadow: `0px 4px 4px 0px rgba(0, 0, 0, 0.25)`,
    height: "42px",
    width: "42px",
  };

  useEffect(() => {
    setPath(router.pathname);
  }, []);

  return (
    <div>
      <div className="footer_area">
        <div className="flex justify-center">
          <div
            className="flex justify-center mb-4 mt-2"
            style={{ width: isResponsive ? "90%" : "40%" }}
          >
            <div className="w-33 flex justify-center">
              {path == "/profile" ? (
                <div className="block ">
                  <div className="flex justify-center">
                    <IconButton sx={activeStyle}>
                      <GridViewOutlinedIcon />
                    </IconButton>
                  </div>

                  <div className="flex justify-center">
                    <div className="footer_button_text">DASHBOARD</div>
                  </div>
                </div>
              ) : (
                <IconButton
                  sx={defaultButtonStyle}
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  <GridViewOutlinedIcon />
                </IconButton>
              )}
            </div>

            <div className="w-33 flex justify-center">
              {path == "/wallet" || path == "/transfer/transfer" ? (
                <div className="block">
                  <div className="flex justify-center">
                    <IconButton sx={activeStyle}>
                      <CreditCardOutlinedIcon />
                    </IconButton>
                  </div>
                  <div>
                    <div className="footer_button_text">WALLET</div>
                  </div>
                </div>
              ) : path == "/selectFundType" ? (
                <IconButton
                  sx={activeStyle}
                  style={{ marginTop: "20px" }}
                  onClick={() => {
                    router.push("/wallet");
                  }}
                  className="mb-1 animate-bounce"
                >
                  <CreditCardOutlinedIcon />
                </IconButton>
              ) : (
                <IconButton
                  sx={defaultButtonStyle}
                  onClick={() => {
                    router.push("/wallet");
                  }}
                  className="mb-1"
                >
                  <CreditCardOutlinedIcon />
                </IconButton>
              )}
            </div>

            <div className="w-33 flex justify-center">
              {path == "/transaction" ? (
                <div className="block">
                  <div className="flex justify-center">
                    <IconButton sx={activeStyle}>
                      <EqualizerIcon />
                    </IconButton>
                  </div>
                  <div className="footer_button_text">TRANSACTION</div>
                </div>
              ) : (
                <IconButton
                  sx={defaultButtonStyle}
                  onClick={() => {
                    router.push("/transaction");
                  }}
                >
                  <EqualizerIcon />
                </IconButton>
              )}
            </div>

            {/* <div className="w-25 flex justify-center">
              {path == "/profile/setting" ? (
                <div className="block">
                  <div className="flex justify-center">
                    <IconButton sx={activeStyle}>
                      <PersonOutlinedIcon />
                    </IconButton>
                  </div>
                  <div className="footer_button_text">Profile</div>
                </div>
              ) : (
                <IconButton
                  sx={defaultButtonStyle}
                  onClick={() => {
                    router.push("/profile/setting");
                  }}
                >
                  <PersonOutlinedIcon />
                </IconButton>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale ?? "en", ["dashboard", "wallet"])),
//   },
// });
