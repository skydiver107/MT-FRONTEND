import { useRouter } from "next/router";
import HeaderRoutes from "@/layouts/headerRoutes";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useResize } from "@/utils/helper";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Container, InputAdornment, TextField } from "@mui/material";
import Footer from "@/layouts/footer";

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

export default function Transfer() {
  const router = useRouter();
  const title: any = "Transfer";

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <HeaderRoutes title={title} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <TextField
            InputLabelProps={{ shrink: false }}
            placeholder="From: MTC"
            size="small"
            fullWidth
            style={{
              borderRadius: "30px !important",
              marginTop: "30px",
            }}
            sx={{
              "& label": {
                left: "20px",
                display: "none",
              },

              "& input": {
                marginLeft: "15px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <KeyboardArrowDownIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            InputLabelProps={{ shrink: false }}
            placeholder="To: Moneto Prepaid Card"
            size="small"
            fullWidth
            style={{
              borderRadius: "30px !important",
              marginTop: "10px",
            }}
            sx={{
              "& label": {
                left: "20px",
                display: "none",
              },

              "& input": {
                marginLeft: "15px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <KeyboardArrowDownIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            InputLabelProps={{ shrink: false }}
            size="small"
            placeholder="To: Bank Account(2410-Debit)"
            fullWidth
            style={{
              borderRadius: "30px !important",
              marginTop: "10px",
            }}
            sx={{
              "& label": {
                left: "20px",
                display: "none",
              },

              "& input": {
                marginLeft: "15px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <KeyboardArrowDownIcon />
                </InputAdornment>
              ),
            }}
          />
          <div className="mt-6">
            <Slider
              defaultValue={30}
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
            />
          </div>

          <div className="mt-6 flex justify-center">
            <div className="tabs_wrapper">
              <Box>
                <StyledTabs
                  value={value}
                  onChange={handleChange}
                  aria-label="styled tabs example"
                >
                  <StyledTab label="50" />
                  <StyledTab label="100" />
                  <StyledTab label="200" />
                  <StyledTab label="400" />
                  <StyledTab label="700" />
                  <StyledTab label="1000" />
                </StyledTabs>
              </Box>
            </div>
          </div>

          <div className="mt-20 flex justify-center w-100">
            <Button
              className="w-100 transfer_button"
              style={{
                background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                borderRadius: "50px",
                color: "#FFFF",
                height: "50px",
              }}
              onClick={() => router.push("/transfer/transferConfirm")}
            >
              Transfer Now
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
