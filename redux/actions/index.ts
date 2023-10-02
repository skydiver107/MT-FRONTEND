export const setStore = async (
  id: number,
  username: string,
  email: string,
  role: string,
  mtcAmount: number,
  userAvatar: string,
  fullName: string,
  contactNumber: string,
  zipCode: string,
  city: string,
  state: string,
  usCitizen: boolean,
  gender: string,
  birthDate: string,
  address: string,
  createdAt: Date,
  dispatch: any
) => {
  dispatch({
    type: "SET",
    id: id,
    username: username,
    email: email,
    role: role,
    mtcAmount: mtcAmount,
    userAvatar: userAvatar,
    fullName: fullName,
    contactNumber: contactNumber,
    zipCode: zipCode,
    city: city,
    state: state,
    usCitizen: usCitizen,
    gender: gender,
    birthDate: birthDate,
    address: address,
    createdAt: createdAt,
  });
};

export const resetStore = async (dispatch: any) => {
  dispatch({
    type: "RESET",
    id: 0,
    username: "",
    email: "",
    role: "",
    mtcAmount: 0,
    userAvatar: "",
    fullName: "",
    contactNumber: "",
    zipCode: "",
    city: "",
    state: "",
    usCitizen: false,
    gender: "m",
    birthDate: "",
    address: "",
    createdAt: "",
  });
};