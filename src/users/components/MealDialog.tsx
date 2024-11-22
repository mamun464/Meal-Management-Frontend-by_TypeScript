import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { User } from "../types/user";
import './dialog.css'




const genders = [
    { label: "userManagement.form.gender.options.f", value: "F" },
    { label: "userManagement.form.gender.options.m", value: "M" },
    { label: "userManagement.form.gender.options.n", value: "NC" },
];
const roles = ["Admin", "Member"];

type MealDialogProps = {
    editMode?: boolean;
    onClose: () => void;
    onUpdate: (user: User) => void;
    open: boolean;
    processing: boolean;
    user?: User;
};

const MealDialog = ({
    editMode,
    onClose,
    onUpdate,
    open,
    processing,
    user,
}: MealDialogProps) => {
    const { t } = useTranslation();
    // console.log("come dalogbox");
    // const editMode = Boolean(user && user.id);

    const handleSubmit = (values: Partial<User>) => {
        console.log("Editing user: ", editMode);

        if (user && user.id) {
            console.log("yyyyyyyyyyyyyyyyyyy");
            // onUpdate({ ...values, id: user.id } as User);
        } else {
            console.log("xxxxxxxxxxxxxxxxx");

            // onAdd(values);
        }
    };

    const formik = useFormik({
        initialValues: {
            is_active: user ? user.is_active : false,
            email: user ? user.email : "",
            fullName: user ? user.fullName : "",
            phone_no: user ? user.phone_no : "",
            // gender: user ? user.gender : "F",
            // lastName: user ? user.lastName : "",
            role: user ? user.role : "",
        },
        // validationSchema: Yup.object({
        //   email: Yup.string()
        //     // .email(t("common.validations.email"))
        //     .required(t("common.validations.required")),
        //   fullName: Yup.string()
        //     .max(20, t("common.validations.max", { size: 20 }))
        //     .required(t("common.validations.required")),
        //   phone_no: Yup.string()
        //     .max(30, t("common.validations.max", { size: 30 }))
        //     .required(t("common.validations.required")),
        //   role: Yup.string().required(t("common.validations.required")),
        // }),
        onSubmit: handleSubmit,
    });

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="user-dialog-title">
            {/* <h1 className="text-red-600 ">hello</h1> */}
            <form onSubmit={formik.handleSubmit} noValidate>
                <DialogTitle id="user-dialog-title">
                    {editMode
                        ? t("userManagement.modal.meal_edit.title")
                        : t("userManagement.modal.meal_add.title")}
                </DialogTitle>
                <DialogContent>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="fullName"
                        label={t("userManagement.form.name.label")}
                        name="fullName"
                        disabled={true}
                        autoComplete="name"
                        // disabled={processing}
                        value={formik.values.fullName}
                    // onChange={formik.handleChange}
                    // error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                    // helperText={formik.touched.fullName && formik.errors.fullName}
                    />

                    <div className="container">
                        <div className="input-field">
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="lunch"
                                label={t("userManagement.form.lunch.label")}
                                name="lunch"
                                autoFocus
                                disabled={processing}
                                type="number"
                                // value={formik.values.phone_no}
                                onChange={formik.handleChange}
                            // error={formik.touched.phone_no && Boolean(formik.errors.phone_no)}
                            // helperText={formik.touched.phone_no && formik.errors.phone_no}
                            />
                        </div>

                        <div className="input-field">
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="dinner"
                                label={t("userManagement.form.dinner.label")}
                                name="dinner"
                                autoComplete="dinner"
                                type="number"
                                disabled={processing}
                                // value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                    </div>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Date Select" />
                    </LocalizationProvider>; */}


                    <FormControl component="fieldset" margin="normal">

                        <FormControlLabel
                            name="is_active"
                            disabled={processing}
                            onChange={(e) => {
                                formik.setFieldValue('is_active', !(e.target as HTMLInputElement).checked);
                            }}
                            checked={!formik.values.is_active} // Negate the value to invert the behavior
                            control={<Checkbox />}
                            label={t("userManagement.form.disabled.label")}
                        />

                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{t("common.cancel")}</Button>
                    <LoadingButton loading={processing} type="submit" variant="contained">
                        {editMode
                            ? t("userManagement.modal.meal_edit.action")
                            : t("userManagement.modal.meal_add.action")}
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default MealDialog;
