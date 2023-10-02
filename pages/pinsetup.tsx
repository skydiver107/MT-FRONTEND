import Image from "next/image";
import { useRouter } from "next/router";
import { useResize } from "@/utils/helper";
import { useState } from "react";

import dynamic from "next/dynamic";

const ReactCodeInput = dynamic(import("react-code-input"));

export default function Pinsetup() {
  const { isMobile } = useResize();
  const router = useRouter();

  const customProps = {
    inputStyle: {
      fontFamily: "monospace",
      margin: "0px",
      width: "55px",
      borderRadius: "0px",
      fontSize: "24px",
      height: "60px",
      paddingLeft: "22px",
      border: "0px",
    },
    inputStyleInvalid: {
      fontFamily: "monospace",
      margin: "0px",
      width: "55px",
      borderRadius: "0px",
      fontSize: "24px",
      height: "60px",
      paddingLeft: "22px",
      color: "red",
      border: "1px solid red",
    },
  };
  return (
    <div>
      <div className="pin_page">
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
          <div
            className="flex text-center justify-start mt-4"
            onClick={() => router.back()}
          >
            <Image
              src="/assets/back_btn.svg"
              width={30}
              height={30}
              alt="error"
              className="header_button"
            />
            <div className="flex items-center ml-4 header_button_title">
              Set up PIN
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Image
              src="/icons/pin_icon.svg"
              width={87}
              height={71}
              alt="error"
            />
          </div>
          <div className="pin_title flex justify-center mt-4">
            Create a new device PIN
          </div>
          <div className="pin_text flex justify-center mt-1">
            Enter a new 6-digit PIN to sign in to this device
          </div>
          <div className="flex justify-center mt-8">
            <ReactCodeInput
              type="password"
              fields={6}
              name="pin_setup"
              inputMode="numeric"
              {...customProps}
            />
          </div>

          <div className="number_pad">
            <div className="flex justify-center">
              <div
                className={
                  isMobile
                    ? "w-80 flex justify-between mt-8"
                    : "w-50 flex justify-between mt-8"
                }
              >
                <div className="number_button">1</div>
                <div className="number_button">2</div>
                <div className="number_button">3</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className={
                  isMobile
                    ? "w-80 flex justify-between mt-4"
                    : "w-50 flex justify-between mt-4"
                }
              >
                <div className="number_button">4</div>
                <div className="number_button">5</div>
                <div className="number_button">6</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className={
                  isMobile
                    ? "w-80 flex justify-between mt-4"
                    : "w-50 flex justify-between mt-4"
                }
              >
                <div className="number_button">7</div>
                <div className="number_button">8</div>
                <div className="number_button">9</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className={
                  isMobile
                    ? "w-80 flex justify-between mt-4 mb-4"
                    : "w-50 flex justify-between mt-4 mb-4"
                }
              >
                <div
                  className="number_button"
                  style={{ visibility: "hidden" }}
                ></div>
                <div className="number_button">0</div>
                <div className="number_button">
                  <Image
                    src="/icons/delete_btn.svg"
                    width={32}
                    height={18}
                    alt="error"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
