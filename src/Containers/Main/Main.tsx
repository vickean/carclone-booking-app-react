import React, { useReducer, Reducer, Fragment, useEffect } from "react";
import {
   Card,
   Typography,
   Grid,
   TextField,
   Button,
   MenuItem,
} from "@material-ui/core";
import { useStyles } from "./styles";
import { FormFieldProps } from "../../Models/Form";
import { Action } from "../../Models/Action";

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

interface LocationList {
   locations: [string];
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
   locations: LocationList;
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
      locations: { locations: [""] },
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
   }, []);

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
         <Button variant="contained" onClick={() => console.table(state)}>
            Log State
         </Button>
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
                                 value: e.target.value.trim(),
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
                     />
                     <TextField
                        required
                        label="Date"
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                     />
                     <TextField
                        required
                        label="Time"
                        variant="outlined"
                        fullWidth
                        className={classes.formField}
                     />
                  </form>
               </Grid>
            </Grid>
         </Card>
         <Card className={classes.card} style={{ textAlign: "center" }}>
            <Button variant="contained">Book an Inspection</Button>
         </Card>
      </Fragment>
   );
};
