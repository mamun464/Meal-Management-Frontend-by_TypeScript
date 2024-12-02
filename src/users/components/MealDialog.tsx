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
import MobileDatePicker from "@material-ui/lab/MobileDatePicker";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";


const roles = ["Admin", "Member"];

type MealDialogProps = {
    editMode?: boolean;
    onClose: () => void;
    onMealAdd: (body: any) => void;
    open: boolean;
    processing: boolean;
    user?: User;
};

type ExtendedUser = Partial<User> & {
    selected_day: Date;
    lunch: string;
    dinner: string;
};

const MealDialog = ({
    editMode,
    onClose,
    onMealAdd,
    open,
    processing,
    user,
}: MealDialogProps) => {
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    // const [startDate, setStartDate] = useState(new Date());
    // console.log("come dalogbox");
    // const editMode = Boolean(user && user.id);

    const handleSubmit = (values: ExtendedUser) => {
        console.log("User ID:", user?.id);
        const formattedDate = values.selected_day.toISOString().split("T")[0];
        console.log("fullName:", values.fullName);
        console.log("Selected Day:", formattedDate);
        console.log("Lunch:", values.lunch);
        console.log("Dinner:", values.dinner);

        // Validate each field individually and show specific error messages
        if (!values.selected_day) {
            snackbar.error(
                t("common.validations.field_required", { field_name: t("userManagement.form.selected_day.label") })
            );
            return;
        }
        if (!values.lunch) {
            snackbar.error(
                t("common.validations.field_required", { field_name: t("userManagement.form.lunch.label") })
            );
            return;
        }
        if (!values.dinner) {
            snackbar.error(
                t("common.validations.field_required", { field_name: t("userManagement.form.dinner.label") })
            );
            return;
        }

        if (user && user.id) {
            onMealAdd({
                user: user.id,
                name: values.fullName,
                date: formattedDate,
                lunch: values.lunch,
                dinner: values.dinner
            })

        } else {
            snackbar.error(t("common.errors.unexpected.subTitle"));
        }
    };


    const formik = useFormik<ExtendedUser>({
        initialValues: {
            is_active: user ? user.is_active : false,
            email: user ? user.email : "",
            fullName: user ? user.fullName : "",
            phone_no: user ? user.phone_no : "",
            selected_day: new Date(),
            lunch: "", // Default value
            dinner: "", // Default value
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

                    <MobileDatePicker
                        label={t("calendar.form.selected_day.label")}
                        inputFormat="dd/MM/yyyy"
                        value={formik.values.selected_day}
                        onChange={(date: Date | null) => {
                            if (date) {
                                formik.setFieldValue("selected_day", date); // Update the correct field
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="selected_day"
                                disabled={processing}
                                fullWidth
                                margin="normal"
                                name="selected_day"
                            />
                        )}
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
                                // value="yy"
                                onChange={formik.handleChange}
                                error={formik.touched.lunch && Boolean(formik.errors.lunch)}
                                helperText={formik.touched.lunch && formik.errors.lunch}
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
                                // value="xx"
                                onChange={formik.handleChange}
                                error={formik.touched.dinner && Boolean(formik.errors.dinner)}
                                helperText={formik.touched.dinner && formik.errors.dinner}
                            />
                        </div>
                    </div>



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
