import React, { useReducer, Reducer, Fragment, useEffect } from "react";
import {
   Card,
   Typography,
   Grid,
   TextField,
   Button,
   MenuItem,
   Snackbar,
   IconButton,
} from "@material-ui/core";
import { useStyles } from "./styles";
import { FormFieldProps } from "../../Models/Form";
import { Action } from "../../Models/Action";
import { format } from "date-fns";
import CloseIcon from "@material-ui/icons/Close";

interface CarModelList {
   id: string;
   name: string;
}

interface CarListItem extends CarModelList {
   children: [CarModelList];
}

interface CarBrandList {
   all_brands: [CarListItem];
   popular: [CarListItem];
}

interface LocationItem {
   name: string;
}

interface SlotItem {
   slotNo: number;
   available: boolean;
}

interface SlotGrpItem {
   time: string;
   slots: [SlotItem];
}

interface dayItem {
   date: string;
   day: number;
   slotsPerGroup: number;
   slotGrpArr: [SlotGrpItem];
}

interface FormState {
   name: FormFieldProps;
   email: FormFieldProps;
   phoneNo: FormFieldProps;
   brand: FormFieldProps;
   model: FormFieldProps;
   location: FormFieldProps;
   date: FormFieldProps;
   time: FormFieldProps;
   cars: CarBrandList;
   locations: [LocationItem];
   slotsAvai: [dayItem];
   slotNum: number;
   open: boolean;
}

export const Main = (props: any) => {
   const classes = useStyles();
   const API = "http://localhost:4000";
   const initialState: FormState = {
      name: {
         error: false,
         helperText: "",
         value: "",
      },
      email: {
         error: false,
         helperText: "",
         value: "",
      },
      phoneNo: {
         error: false,
         helperText: "",
         value: "",
      },
      brand: {
         error: false,
         helperText: "",
         value: "",
      },
      model: {
         error: false,
         helperText: "",
         value: "",
      },
      location: {
         error: false,
         helperText: "",
         value: "",
      },
      date: {
         error: false,
         helperText: "",
         value: "",
      },
      time: {
         error: false,
         helperText: "",
         value: "",
      },
      cars: {
         all_brands: [
            {
               name: "",
               id: "",
               children: [
                  {
                     name: "",
                     id: "",
                  },
               ],
            },
         ],
         popular: [
            {
               name: "",
               id: "",
               children: [
                  {
                     name: "",
                     id: "",
                  },
               ],
            },
         ],
      },
      locations: [{ name: "" }],
      slotsAvai: [
         {
            date: "",
            day: 0,
            slotsPerGroup: 0,
            slotGrpArr: [{ time: "", slots: [{ slotNo: 0, available: false }] }],
         },
      ],
      slotNum: 0,
      open: false,
   };

   const reducer: Reducer<FormState, Action> = (prevState, action) => {
      switch (action.type) {
         case "reset":
            return initialState;
         default:
            return { ...prevState, [action.type]: action.payload };
      }
   };

   const [state, dispatch] = useReducer(reducer, initialState);

   const fetchData = async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data;
   };

   /**
    * Runs on page load
    */
   useEffect(() => {
      fetchData(`${API}/cars`).then((data) =>
         dispatch({ type: "cars", payload: data })
      );
      fetchData(`${API}/locations`).then((data) =>
         dispatch({ type: "locations", payload: data })
      );
   }, []);

   /**
    * Runs on state.location.value change
    */
   useEffect(() => {
      if (state.location.value !== "") {
         fetchData(`${API}/available-slots/${state.location.value}`).then((data) =>
            dispatch({ type: "slotsAvai", payload: data })
         );
      }
   }, [state.location.value]);

   useEffect(() => {
      if (state.time.value !== "") {
         const nextAvaiSlotNum = state.time.value.slots.filter(
            (el: SlotItem) => el.available === true
         )[0].slotNo;

         dispatch({
            type: "slotNum",
            payload: nextAvaiSlotNum,
         });
      }
   }, [state.time.value]);

   const handleSubmit = async () => {
      let err = false;

      if (state.name.value === "") {
         err = true;
         dispatch({
            type: "name",
            payload: {
               value: state.name.value,
               error: true,
               helperText: "Name is required",
            },
         });
      }

      if (state.email.value === "") {
         err = true;
         dispatch({
            type: "email",
            payload: {
               value: state.email.value,
               error: true,
               helperText: "Email is required",
            },
         });
      }

      if (state.phoneNo.value === "") {
         err = true;
         dispatch({
            type: "phoneNo",
            payload: {
               value: state.phoneNo.value,
               error: true,
               helperText: "Phone No. is required",
            },
         });
      }

      if (state.brand.value === "") {
         err = true;
         dispatch({
            type: "brand",
            payload: {
               value: state.brand.value,
               error: true,
               helperText: "Brand is required",
            },
         });
      }

      if (state.model.value === "" && state.brand.value.name !== "Others") {
         err = true;
         dispatch({
            type: "model",
            payload: {
               value: state.model.value,
               error: true,
               helperText: "Model is required",
            },
         });
      }

      if (state.location.value === "") {
         err = true;
         dispatch({
            type: "location",
            payload: {
               value: state.location.value,
               error: true,
               helperText: "Location is required",
            },
         });
      }

      if (state.date.value === "") {
         err = true;
         dispatch({
            type: "date",
            payload: {
               value: state.date.value,
               error: true,
               helperText: "Date is required",
            },
         });
      }

      if (state.time.value === "") {
         err = true;
         dispatch({
            type: "time",
            payload: {
               value: state.time.value,
               error: true,
               helperText: "Time is required",
            },
         });
      }

      if (err) return;

      const postForm = await fetch(`${API}/user`, {
         method: "POST",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            name: state.name.value.trim(),
            email: state.email.value.trim(),
            phoneNum: state.phoneNo.value.trim(),
            carBrand: state.brand.value.name,
            carModel: state.model.value,
         }),
      });

      const postData = await postForm.json();

      // console.log(postData);

      const bookingForm = await fetch(`${API}/timeslot`, {
         method: "POST",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            userId: postData.id,
            dateTime: state.time.value.time,
            location: state.location.value,
            slotNum: state.slotNum,
         }),
      });

      const bookingData = await bookingForm.json();

      // console.log(bookingData);

      dispatch({
         type: "open",
         payload: true,
      });
   };

   const handleClose = () => {
      dispatch({
         type: "open",
         payload: false,
      });

      dispatch({
         type: "reset",
         payload: "",
      });
   };

   return (
      <Fragment>
         <Card className={classes.card}>
            <Grid container>
               <Grid item xs={12}>
                  <Typography variant="h3">CarClone</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant="h5">Inspection Booking</Typography>
               </Grid>
            </Grid>
         </Card>
         {/* <Button variant="contained" onClick={() => console.log(state)}>
            Log State
         </Button> */}
         <Card className={classes.card}>
            <Grid container>
               <Grid item xs={12}>
                  <form>
                     <Typography className={classes.formField} variant="h6">
                        Seller Details
                     </Typography>
                     <TextField
                        required
                        label="Name"
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                        value={state.name.value}
                        error={state.name.error}
                        helperText={state.name.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "name",
                              payload: {
                                 value: e.target.value,
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                     />
                     <TextField
                        required
                        label="Email"
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                        value={state.email.value}
                        error={state.email.error}
                        helperText={state.email.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "email",
                              payload: {
                                 value: e.target.value.trim(),
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                     />
                     <TextField
                        required
                        label="Phone No."
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                        value={state.phoneNo.value}
                        error={state.phoneNo.error}
                        helperText={state.phoneNo.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "phoneNo",
                              payload: {
                                 value: e.target.value.trim(),
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                     />
                     <TextField
                        required
                        label="Brand"
                        variant="outlined"
                        fullWidth
                        select
                        className={classes.formField}
                        value={state.brand.value}
                        error={state.brand.error}
                        helperText={state.brand.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "brand",
                              payload: {
                                 value: e.target.value,
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                        SelectProps={{
                           renderValue: (selected: any) => {
                              return selected.name;
                           },
                        }}
                     >
                        <MenuItem disabled>
                           <Typography variant="h6" style={{ fontWeight: "bold" }}>
                              Popular
                           </Typography>
                        </MenuItem>
                        {state.cars.popular.map((el: CarListItem) => {
                           return (
                              <MenuItem key={el.name} value={el as any}>
                                 {el.name}
                              </MenuItem>
                           );
                        })}
                        <MenuItem disabled>
                           <Typography variant="h6" style={{ fontWeight: "bold" }}>
                              All Brands
                           </Typography>
                        </MenuItem>
                        {state.cars.all_brands.map((el: CarListItem) => {
                           return (
                              <MenuItem key={el.name} value={el as any}>
                                 {el.name}
                              </MenuItem>
                           );
                        })}
                     </TextField>
                     <TextField
                        required
                        label="Model"
                        variant="outlined"
                        fullWidth
                        select
                        disabled={
                           state.brand.value === "" ||
                           state.brand.value.children.length === 0
                        }
                        className={classes.formField}
                        value={state.model.value}
                        error={state.model.error}
                        helperText={state.model.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "model",
                              payload: {
                                 value: e.target.value,
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                     >
                        {state.brand?.value?.children?.map((el: CarModelList) => {
                           return (
                              <MenuItem key={el.name} value={el.name}>
                                 {el.name}
                              </MenuItem>
                           );
                        })}
                     </TextField>
                  </form>
               </Grid>
            </Grid>
         </Card>
         <Card className={classes.card}>
            <Grid container>
               <Grid item xs={12}>
                  <form>
                     <Typography className={classes.formField} variant="h6">
                        Inspection Booking
                     </Typography>
                     <TextField
                        required
                        label="Location"
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                        select
                        value={state.location.value}
                        error={state.location.error}
                        helperText={state.location.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "location",
                              payload: {
                                 value: e.target.value,
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                     >
                        {state.locations.map((el: LocationItem) => {
                           return (
                              <MenuItem key={el.name} value={el.name}>
                                 {el.name}
                              </MenuItem>
                           );
                        })}
                     </TextField>
                     <TextField
                        required
                        label="Date"
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                        disabled={state.location.value === ""}
                        select
                        value={state.date.value}
                        error={state.date.error}
                        helperText={state.date.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "date",
                              payload: {
                                 value: e.target.value,
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                        SelectProps={{
                           renderValue: (selected: any) => {
                              return format(new Date(selected.date), "do MMM yyyy");
                           },
                        }}
                     >
                        {state.slotsAvai.map((el: dayItem) => {
                           const isFullyBooked =
                              el.slotGrpArr.filter((el2: SlotGrpItem) => {
                                 const slotCount = el2.slots.filter(
                                    (el3: SlotItem) => el3.available === false
                                 );
                                 return slotCount.length === el.slotsPerGroup;
                              }).length === el.slotGrpArr.length;

                           return (
                              <MenuItem
                                 key={el.date}
                                 value={el as any}
                                 disabled={isFullyBooked}
                              >
                                 {format(new Date(el.date || "0000"), "do MMM yyyy")}
                              </MenuItem>
                           );
                        })}
                     </TextField>
                     <TextField
                        required
                        label="Time"
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                        disabled={state.date.value === ""}
                        select
                        value={state.time.value}
                        error={state.time.error}
                        helperText={state.time.helperText}
                        onChange={(e) => {
                           dispatch({
                              type: "time",
                              payload: {
                                 value: e.target.value,
                                 error: false,
                                 helperText: "",
                              },
                           });
                        }}
                     >
                        {state.date.value.slotGrpArr?.map((el: SlotGrpItem) => {
                           const isSlotFullyBooked =
                              el.slots.filter(
                                 (el2: SlotItem) => el2.available === false
                              ).length === el.slots.length;

                           return (
                              <MenuItem
                                 key={el.time}
                                 value={el as any}
                                 disabled={isSlotFullyBooked}
                              >
                                 {format(new Date(el.time || "0000"), "hh.mma")}
                              </MenuItem>
                           );
                        })}
                     </TextField>
                  </form>
               </Grid>
            </Grid>
         </Card>
         <Card className={classes.card} style={{ textAlign: "center" }}>
            <Button variant="contained" onClick={handleSubmit}>
               Book an Inspection
            </Button>
         </Card>
         <Snackbar
            anchorOrigin={{
               vertical: "bottom",
               horizontal: "center",
            }}
            open={state.open}
            autoHideDuration={3000}
            onClose={handleClose}
            message="Inspection Booked"
            action={
               <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
               >
                  <CloseIcon fontSize="small" />
               </IconButton>
            }
         />
      </Fragment>
   );
};
