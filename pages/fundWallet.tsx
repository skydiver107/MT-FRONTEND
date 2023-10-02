import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";
import Footer from "@/layouts/footer";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useResize } from "@/utils/helper";

import { toast } from "react-toastify";

// redux
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

interface StyledTabProps {
  label: string;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-flexContainer": {
    flexWrap: "wrap",
    justifyContent: "center",
  },
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 0,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: "800",
  fontSize: "20px",
  fontFamily: "Karla_ExtraBold",
  marginLeft: "10px",
  minHeight: "65px",
  minWidth: "90px",
  marginRight: "10px",
  marginBottom: "30px",
  color: "#000000",
  borderBottom: `2px solid rgba(0, 0, 0, 0.25)`,
  borderRadius: "50px",
  boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
  "&.Mui-selected": {
    color: "#FFFF",
    background:
      "var(--degradado-2, linear-gradient(101deg, #3892DB 0%, #974ED6 59.90%, #D721D2 100%))",
    borderBottom: `1px solid rgba(0, 0, 0, 0.25)`,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

export default function FundWallet() {
  const router = useRouter();

  const { t } = useTranslation("common");
  const title: any = t("fund_wallet");

  const amount: any[] = [50, 100, 200, 400, 700, 1000];

  const [value, setValue] = useState(0);

  const [sliderValue, setSliderValue] = useState(50);
  const userStore = useSelector((state: any) => state.userStore);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSliderValue(amount[newValue] as number);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const confirmPurchase = () => {
    sessionStorage.setItem("amount", sliderValue.toString());
    if (sliderValue == 0) {
      toast("Amount should be valid.", {
        hideProgressBar: false,
        autoClose: 3000,
        type: "error",
        theme: "dark",
      });
      return;
    }
    router.push("/confirmPurchase");
  };

  return (
    <div>
      <HeaderRoutes title={title} />
      <div className="flex justify-center" style={{ marginBottom: "90px" }}>
        <div className="select_method_wrapper">
          <div className="select_method_title">{t("add_funds")}</div>
          <div className="mtc_balance_area mt-4">
            <div className="mtc_balance_title">{t("MTC_balance")}</div>
            <div className="mtc_balance_content">{userStore.mtcAmount}</div>
          </div>

          <div className="mt-6">
            <div className="mtc_selected_value flex justify-center">
              {sliderValue}
            </div>
            <div className="mtc_selected_currency flex justify-center">
              {t("amount")}(US)
            </div>
          </div>
          <div className="mt-6">
            <Slider
              min={0}
              max={1000}
              sx={{
                height: 20,

                "& .MuiSlider-thumb": {
                  borderRadius: "5px",
                  width: "20px",
                  height: "30px",
                },
                "& .MuiSlider-track": {
                  color: "#393CDC",
                  opacity: "0.7",
                },
              }}
              value={sliderValue}
              onChange={handleSliderChange}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <div className="tabs_wrapper">
              <Box>
                <StyledTabs
                  value={value}
                  onChange={handleTabChange}
                  aria-label="styled tabs example"
                >
                  <StyledTab label="$50" />
                  <StyledTab label="$100" />
                  <StyledTab label="$200" />
                  <StyledTab label="$400" />
                  <StyledTab label="$700" />
                  <StyledTab label="$1000" />
                </StyledTabs>
              </Box>
            </div>
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
              onClick={confirmPurchase}
            >
              {t("add_funds_now")}
            </Button>
          </div>
          <div className="mt-4 mb-4">
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
              onClick={() => router.push("/transaction")}
            >
              {t("purchase_history")}
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
