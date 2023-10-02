import { useRouter } from "next/router";
import HeaderRoutes from "@/layouts/headerRoutes";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Container, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";

export default function TransferSuccess() {
  const router = useRouter();
  const title: any = "Transfer";
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

          <div>
            <div className="pending_transfer_title mt-24">
              Transfer Complete
            </div>

            <div className="flex justify-center">
              <Image
                src="/assets/success.gif"
                width={500}
                height={500}
                alt="GIF"
              />
            </div>

            <div className="transfer_button_area">
              <Button
                className="w-100 transfer_button"
                style={{
                  background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                  borderRadius: "50px",
                  color: "#FFFF",
                  height: "50px",
                }}
                onClick={() => router.push("/wallet")}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
