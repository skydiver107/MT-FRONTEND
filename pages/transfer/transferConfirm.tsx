import { useRouter } from "next/router";
import HeaderRoutes from "@/layouts/headerRoutes";
import { useResize } from "@/utils/helper";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Container, InputAdornment, TextField } from "@mui/material";

export default function TransferConfirm() {
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
              Pending Transfer Details
            </div>
            <div className="flex justify-center mt-12">
              <div className="w-80 flex">
                <div className="pending_transfer_detail w-50">From Account</div>
                <div className="pending_transfer_detail w-50">MTC</div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <div className="w-80 flex">
                <div className="pending_transfer_detail w-50">To Account</div>
                <div className="pending_transfer_detail w-50">
                  Moneto Prepaid Card
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <div className="w-80 flex">
                <div className="pending_transfer_detail w-50">Amount</div>
                <div className="pending_transfer_detail w-50">$ 700</div>
              </div>
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
                onClick={() => router.push("/transfer/transferSuccess")}
              >
                Transfer Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
