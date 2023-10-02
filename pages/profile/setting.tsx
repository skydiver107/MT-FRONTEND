import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import { styled } from "@mui/material/styles";
import Footer from "@/layouts/footer";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Radio, { RadioProps } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { useDispatch, useSelector, useStore } from "react-redux";
import { setStore, resetStore } from "@/redux/actions";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useResize } from "@/utils/helper";

// for image blob
import { PutBlobResult } from "@vercel/blob";

import validator from "validator";

import axios from "axios";

export default function ProfileSubmit() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userStore = useSelector((state: any) => state.userStore);
  const defaultAvatar = "/images/defaultAvatar.jpg";
  const { isMobile } = useResize();

  const { locale } = router;
  const { t } = useTranslation(["profile_setting", "common"]);
  const [currentLang, setCurrentLang] = useState<any>();

  // for formData
  const [avatarURL, setAvatarURL] = useState(
    userStore.userAvatar ? userStore.userAvatar : defaultAvatar
  );
  const [fullName, setFullName] = useState<any>(userStore.fullName);
  const [birthDate, setBirthDate] = useState<any>(userStore.birthDate);
  const [contactNumber, setContactNumber] = useState<any>(
    userStore.contactNumber
  );
  const [gender, setGender] = useState<any>(userStore.gender);
  const [address, setAddress] = useState<any>(userStore.address);
  const [city, setCity] = useState<any>(userStore.city);
  const [zipCode, setZipCode] = useState<any>(userStore.zipCode);
  const [stateName, setStateName] = useState<any>(userStore.state);
  const [usCitizen, setUsCitizen] = useState<any>(userStore.usCitizen);

  // console.log("userstore is", userStore);

  const textFieldStyle = {
    "& label": {
      left: "10px",
    },
    "& legend": {
      textAlign: "left",
      marginLeft: "10px",
    },
    "& input": {
      marginLeft: "20px",
    },
  };

  const changeAvatar = (event: any) => {
    const fileReader = new FileReader();
    const { files } = event.target as HTMLInputElement;

    if (files && files.length) {
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = () => {
        if (typeof fileReader.result === "string")
          setAvatarURL(fileReader.result);
      };
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender((event.target as HTMLInputElement).value);
  };

  const handleCitizenStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsCitizen((event.target as HTMLInputElement).value);
  };

  const handlePhoneNumberChange = (event: any) => {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, ""); // Remove non-digit characters
    let formattedInput = "";

    if (input.length >= 1) {
      formattedInput += "(" + input.substr(0, 3);
    }

    if (input.length >= 4) {
      formattedInput += ") " + input.substr(3, 3);
    }

    if (input.length >= 7) {
      formattedInput += "-" + input.substr(6, 4);
    }

    setContactNumber(formattedInput);
  };

  const handleZipcodeChange = (event: any) => {
    // for Zip Code
    // let input = event.target.value;
    // input = input.replace(/[^0-9]/g, "");
    // let formattedInput = "";
    // formattedInput = input.substr(0, 5);
    // setZipCode(formattedInput);

    // for Canadian postal code
    let input = event.target.value;
    let formattedInput = "";
    // input = input.replace(
    //   /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/i,
    //   ""
    // );

    formattedInput = input.substr(0, 6);

    console.log("format postal code", formattedInput);
    setZipCode(formattedInput);
  };

  const handleDOBChange = (event: any) => {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, "");

    let formattedInput = "";

    // Handlers for Year (YYYY)
    if (input.length >= 4) {
      formattedInput += input.substr(0, 4);
    } else {
      formattedInput += input;
    }

    // Handlers for Month (MM)
    if (input.length >= 5) {
      formattedInput += "-" + input.substr(4, 2);
    }

    // Handlers for Day (DD)
    if (input.length >= 7) {
      formattedInput += "-" + input.substr(6, 2);
    }

    setBirthDate(formattedInput);
  };

  const validateDate = (dateString: any) => {
    if (dateString == "") return false;
    const month = parseInt(dateString.split("-")[0], 10);
    const year = parseInt(dateString.split("-")[1], 10);
    const date = parseInt(dateString.split("-")[2], 10);
    const currentYear = new Date().getFullYear();
    if (month > 12) {
      return false;
    }
    if (date < 1 || date > 31) {
      return false;
    }
    if (currentYear < year) {
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    const id = userStore.id;
    if (fullName == null || contactNumber == null) {
      toast(`${t("You Should Input Your Name and Contact Number.")}`, {
        hideProgressBar: false,
        autoClose: 3000,
        type: "error",
        theme: "dark",
      });
      return;
    }

    if (birthDate !== null) {
      const year = parseInt(birthDate.split("-")[0], 10);
      const month = parseInt(birthDate.split("-")[1], 10);
      const date = parseInt(birthDate.split("-")[2], 10);
      const currentYear = new Date().getFullYear();

      if (month > 12 || date < 1 || date > 31 || currentYear < year) {
        toast("Please Input Validate Date", {
          hideProgressBar: false,
          autoClose: 3000,
          type: "error",
          theme: "dark",
        });
        return;
      }
    }

    if (contactNumber != null) {
      const checkPhoneNumber: Boolean = validator.isMobilePhone(contactNumber);
      if (checkPhoneNumber == false) {
        toast("Please Input Validate Phone Number.", {
          hideProgressBar: false,
          autoClose: 3000,
          type: "error",
          theme: "dark",
        });
        return;
      }
    }

    if (zipCode != null) {
      const checkZipCode: Boolean =
        validator.isPostalCode(zipCode, "CA") ||
        validator.isPostalCode(zipCode, "US");
      if (checkZipCode == false) {
        toast("Please Input Validate Postal Code.", {
          hideProgressBar: false,
          autoClose: 3000,
          type: "error",
          theme: "dark",
        });
        return;
      }
    }

    await axios
      .put(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/user/${id}`, {
        userAvatar: avatarURL,
        fullName: fullName,
        birthDate: birthDate,
        contactNumber: contactNumber,
        gender: gender,
        address: address,
        city: city,
        zipCode: zipCode,
        state: stateName,
        usCitizen: usCitizen,
      })
      .then((response) => {
        toast(`${t("submitted")}`, {
          hideProgressBar: false,
          autoClose: 3000,
          type: "success",
          theme: "dark",
        });
        router.push("/wallet");
      })
      .catch((e) => {
        toast("Failed to upload data. Please check again.", {
          hideProgressBar: false,
          autoClose: 2000,
          type: "error",
          theme: "dark",
        });
      });
  };

  // for mui style
  const labelStyle = {
    style: { fontFamily: "Karla_Bold" },
  };

  const CustomizeCheckboxIcon = styled("span")(({ theme }) => ({
    borderRadius: 11,
    width: 16,
    height: 16,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 0 0 1px rgb(16 22 26 / 40%)"
        : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
        : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    ".Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background:
        theme.palette.mode === "dark"
          ? "rgba(57,75,89,.5)"
          : "rgba(206,217,224,.5)",
    },
  }));

  const BpCheckedIcon = styled(CustomizeCheckboxIcon)({
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  });

  function BpRadio(props: RadioProps) {
    return (
      <Radio
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<CustomizeCheckboxIcon />}
        {...props}
      />
    );
  }

  return (
    <div>
      <div className="profile_submit_header">
        <div className="welcome_logo">
          <div style={{ marginTop: "20px" }}>
            <Image
              src="/assets/moneto_logo_small.svg"
              width={250}
              height={30}
              alt="error"
              onClick={() => router.push("/profile")}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div
            className="flex text-center justify-start mt-4"
            onClick={() =>
              window.history.state ? router.back() : router.push("/profile")
            }
            style={{ cursor: "pointer", width: isMobile ? "90%" : "70%" }}
          >
            <Image
              src="/assets/back_btn.svg"
              width={30}
              height={30}
              alt="error"
              className="header_button"
            />
            <div className="flex items-center ml-4 header_button_title">
              {t("account_profile")}
            </div>
          </div>

          <div className="flex items-center text-center justify-center mt-4">
            {/* <TuneOutlinedIcon sx={{ color: "white" }} /> */}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "110px" }}>
        <div className="avatar_area_submit flex justify-center">
          <input type="file" onChange={changeAvatar} />
          <div
            style={{ position: "relative", width: "100px", height: "100px" }}
          >
            <Image
              src={avatarURL}
              fill
              alt="error"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="profile_area profile_submit_area">
          <div className="pl-6 pr-6 mt-4 flex justify-center">
            <div className="general_wrapper">
              <div className="mt-4">
                <TextField
                  label={t("full_name")}
                  value={fullName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFullName(event.target.value);
                  }}
                  size="small"
                  style={{
                    color: "#393CDC",
                    borderRadius: "30px",
                    marginTop: "10px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <EditOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={labelStyle}
                  sx={textFieldStyle}
                  placeholder="Eli Zhang"
                  fullWidth
                ></TextField>
              </div>

              <div className="mt-4">
                <TextField
                  label={t("date_of_birth")}
                  value={birthDate}
                  onChange={handleDOBChange}
                  style={{
                    color: "#393CDC",
                    borderRadius: "30px",
                    marginTop: "10px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <EditOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={labelStyle}
                  size="small"
                  sx={textFieldStyle}
                  placeholder="YYYY-MM-DD"
                  fullWidth
                ></TextField>
              </div>

              <div className="mt-4">
                <TextField
                  label={t("contact_number")}
                  value={contactNumber}
                  onChange={handlePhoneNumberChange}
                  size="small"
                  style={{
                    color: "#393CDC",
                    borderRadius: "30px",
                    marginTop: "10px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <EditOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={labelStyle}
                  sx={textFieldStyle}
                  placeholder="+12343459090"
                  fullWidth
                ></TextField>
              </div>
              <div className="mt-4 normal_font flex items-center">
                <div>{t("gender")}</div>
                <div className="mt-0 ml-8 items-center">
                  <FormControl>
                    <RadioGroup
                      // defaultValue={userStore.gender ? userStore.gender : "m"}
                      aria-labelledby="demo-customized-radios"
                      name="customized-radios"
                      onChange={handleGenderChange}
                      value={gender}
                      row
                    >
                      <FormControlLabel
                        value="f"
                        control={<BpRadio />}
                        label="W"
                      />
                      <FormControlLabel
                        value="m"
                        control={<BpRadio />}
                        label="M"
                      />
                      <FormControlLabel
                        value="x"
                        control={<BpRadio />}
                        label="X"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="mt-4 mb-4">
                <Divider sx={{ bgcolor: "#000000" }} />
              </div>
              <div className="mt-4">
                <TextField
                  label={t("address")}
                  value={address}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(event.target.value);
                  }}
                  size="small"
                  style={{
                    color: "#393CDC",
                    borderRadius: "30px",
                    marginTop: "10px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <EditOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={labelStyle}
                  sx={textFieldStyle}
                  placeholder="2715 Ash Drive"
                  fullWidth
                ></TextField>
              </div>
              <div className="flex justify-center mt-4">
                <TextField
                  label={t("city")}
                  value={city}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCity(event.target.value);
                  }}
                  size="small"
                  style={{
                    color: "#393CDC",
                    borderRadius: "30px",
                    marginTop: "10px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <EditOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={labelStyle}
                  sx={textFieldStyle}
                  placeholder="Bevery Hills"
                  fullWidth
                ></TextField>
                <TextField
                  label={t("zip_code")}
                  value={zipCode}
                  onChange={handleZipcodeChange}
                  size="small"
                  style={{
                    color: "#393CDC",
                    borderRadius: "30px",
                    marginTop: "10px",
                    marginLeft: "20px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <EditOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={labelStyle}
                  sx={textFieldStyle}
                  placeholder="20210"
                  fullWidth
                ></TextField>
              </div>

              <div className="flex justify-center mt-4">
                <div style={{ width: "50%" }}>
                  <TextField
                    label={t("state")}
                    value={stateName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setStateName(event.target.value);
                    }}
                    size="small"
                    style={{
                      color: "#393CDC",
                      borderRadius: "30px",
                      marginTop: "10px",
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <EditOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={labelStyle}
                    sx={textFieldStyle}
                    placeholder="California"
                    fullWidth
                  ></TextField>
                </div>

                <div
                  className="normal_font"
                  style={{ width: "50%", marginLeft: "20px" }}
                >
                  {t("us_citizen")}
                  <div className="mt-0 ml-1">
                    <FormControl>
                      <RadioGroup
                        // defaultValue={
                        //   userStore.usCitizen ? userStore.usCitizen : false
                        // }
                        aria-labelledby="demo-customized-radios"
                        name="customized-radios"
                        onChange={handleCitizenStatusChange}
                        value={usCitizen}
                        row
                      >
                        <FormControlLabel
                          value={true}
                          control={<BpRadio />}
                          label={t("yes", { ns: "common" })}
                        />
                        <FormControlLabel
                          value={false}
                          control={<BpRadio />}
                          label={t("no", { ns: "common" })}
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  className="w-100 transfer_button"
                  style={{
                    background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                    borderRadius: "50px",
                    color: "#FFFF",
                    height: "50px",
                    marginRight: "8px",
                  }}
                  onClick={submitForm}
                >
                  {t("submit")}
                </Button>
                <Button
                  className="w-100 transfer_button"
                  style={{
                    background: `#E4E4E4`,
                    borderRadius: "50px",
                    color: "black",
                    height: "50px",
                    marginLeft: "8px",
                  }}
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  {t("back")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", [
      "profile_setting",
      "common",
    ])),
  },
});
