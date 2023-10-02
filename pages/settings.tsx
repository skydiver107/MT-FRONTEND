import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";
import Image from "next/image";
import { useState, useEffect } from "react";
import * as React from "react";
import { useResize } from "@/utils/helper";
import { alpha, styled } from "@mui/material/styles";

import Switch, { SwitchProps } from "@mui/material/Switch";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

// for Mui Select button
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

// redux
import { useDispatch, useSelector } from "react-redux";

export default function Settings() {
  const title: any = "Settings";
  const router = useRouter();
  const { isMobile } = useResize();
  const { locale } = router;
  const { t } = useTranslation("settings");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("usd");

  const userStore = useSelector((state: any) => state.userStore);
  const defaultAvatar = "/images/defaultAvatar.jpg";

  const handleLangChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
    router.locale = event.target.value;
    sessionStorage.setItem("language", event.target.value);

    router.push("/settings", "/settings", { locale: router.locale });
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string);
  };

  const CustomSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          background:
            "var(--degradado-2, linear-gradient(101deg, #3892DB 0%, #974ED6 59.90%, #D721D2 100%))",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 18,
      height: 18,
      marginTop: 2,
      marginLeft: 2,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  useEffect(() => {
    const tempLang: any = sessionStorage.getItem("language");
    setLanguage(tempLang);
  }, [language]);

  return (
    <div>
      <HeaderRoutes title={t("settings")} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div className="flex justify-center" style={{ marginTop: "-10px" }}>
            <div
              className="flex "
              style={{
                position: "relative",
                width: "63px",
                height: "63px",
                marginLeft: "-80px",
              }}
            >
              <Image
                src={
                  userStore.userAvatar !== null
                    ? userStore.userAvatar
                    : defaultAvatar
                }
                fill
                alt="error"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginLeft: "-63px",
                }}
              />
              <div className="ml-4 mt-4">
                <div className="setting_title">{userStore.fullName}</div>
                <div className="setting_content">{userStore.email}</div>
              </div>
            </div>
          </div>

          <div className="setting_card_wrapper mt-4 mb-4">
            <div className="flex justify-center">
              <Button
                className="w-90 transfer_button"
                style={{
                  background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                  borderRadius: "50px",
                  color: "#FFFF",
                  height: "40px",
                  marginRight: "8px",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                onClick={() =>
                  router.push("/profile/setting", "/profile/setting", {
                    locale: router.locale,
                  })
                }
              >
                {t("edit")}
              </Button>
            </div>

            <div className="setting_title mt-8">{t("security")}</div>

            <div
              className="setting_button flex justify-between mt-8"
              onClick={() => router.push("/pinsetup")}
            >
              <div className="flex text-center items-center">
                <LockOutlinedIcon sx={{ color: "#393CDC" }} />
                <div className="setting_subtitle ml-2">{t("set_up_pin")}</div>
              </div>
              <div className="flex text-center items-center">
                <KeyboardArrowRightOutlinedIcon
                  sx={{ color: "#C4C4C4", marginRight: "5px" }}
                />
              </div>
            </div>

            <div className="setting_button flex justify-between mt-8">
              <div className="flex text-center items-center">
                <SentimentSatisfiedAltOutlinedIcon sx={{ color: "#393CDC" }} />
                <div className="setting_subtitle ml-2">
                  {t("login_with_face_id")}
                </div>
              </div>
              <div className="flex text-center items-center">
                <CustomSwitch inputProps={{ "aria-label": "controlled" }} />
              </div>
            </div>

            <div className="setting_button flex justify-between mt-8">
              <div className="flex text-center items-center">
                <FingerprintOutlinedIcon sx={{ color: "#393CDC" }} />
                <div className="setting_subtitle ml-2">
                  {t("login_with_fingerprint")}
                </div>
              </div>
              <div className="flex text-center items-center">
                <CustomSwitch inputProps={{ "aria-label": "controlled" }} />
              </div>
            </div>

            <div className="setting_button flex justify-between mt-8">
              <div className="flex text-center items-center">
                <NotificationsNoneOutlinedIcon sx={{ color: "#393CDC" }} />
                <div className="setting_subtitle ml-2">{t("notification")}</div>
              </div>
              <div className="flex text-center items-center">
                <CustomSwitch inputProps={{ "aria-label": "controlled" }} />
              </div>
            </div>

            <div className="setting_title mt-8">{t("others")}</div>

            <div className="setting_button flex justify-between mt-8">
              <div className="flex text-center items-center">
                <LanguageOutlinedIcon sx={{ color: "#393CDC" }} />
                <div className="setting_subtitle ml-2">{t("language")}</div>
              </div>
              <div className="flex items-center">
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    Choose Language
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={language}
                    label="Choose language"
                    onChange={handleLangChange}
                    sx={{ width: "150px", height: "40px" }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="setting_button flex justify-between mt-8">
              <div className="flex text-center items-center">
                <PaymentsOutlinedIcon sx={{ color: "#393CDC" }} />
                <div className="setting_subtitle ml-2">
                  {t("base_currency")}
                </div>
              </div>
              <div className="flex items-center">
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    Currency
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currency}
                    label="Currency"
                    onChange={handleCurrencyChange}
                    sx={{ width: "150px", height: "40px" }}
                  >
                    <MenuItem value="usd">USD</MenuItem>
                    <MenuItem value="cad">CAD</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["settings"])),
  },
});
