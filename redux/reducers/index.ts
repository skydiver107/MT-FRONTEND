// ** Initial State
const initialState = {
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
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        id: action.id,
        username: action.username,
        email: action.email,
        role: action.role,
        mtcAmount: action.mtcAmount,
        userAvatar: action.userAvatar,
        fullName: action.fullName,
        contactNumber: action.contactNumber,
        zipCode: action.zipCode,
        city: action.city,
        state: action.state,
        usCitizen: action.usCitizen,
        gender: action.gender,
        birthDate: action.birthDate,
        address: action.address,
        createdAt: action.createdAt,
      };
    case "RESET":
      return {
        ...state,
        id: action.id,
        username: action.username,
        email: action.email,
        role: action.role,
        mtcAmount: action.mtcAmount,
        userAvatar: action.userAvatar,
        fullName: action.fullName,
        contactNumber: action.contactNumber,
        zipCode: action.zipCode,
        city: action.city,
        state: action.state,
        usCitizen: action.usCitizen,
        gender: action.gender,
        birthDate: action.birthDate,
        address: action.address,
        createdAt: action.createdAt,
      };
    default:
      return state;
  }
};

export default reducer;
