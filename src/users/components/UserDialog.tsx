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

const genders = [
  { label: "userManagement.form.gender.options.f", value: "F" },
  { label: "userManagement.form.gender.options.m", value: "M" },
  { label: "userManagement.form.gender.options.n", value: "NC" },
];
const roles = ["Admin", "Member"];

type UserDialogProps = {
  onAdd: (user: Partial<User>) => void;
  onClose: () => void;
  onUpdate: (user: User) => void;
  open: boolean;
  processing: boolean;
  user?: User;
};

const UserDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  user,
}: UserDialogProps) => {
  const { t } = useTranslation();

  const editMode = Boolean(user && user.id);

  const handleSubmit = (values: Partial<User>) => {

    if (user && user.id) {
      onUpdate({ ...values, id: user.id } as User);
    } else {
      onAdd(values);
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
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("common.validations.email"))
        .required(t("common.validations.required")),
      fullName: Yup.string()
        .max(20, t("common.validations.max", { size: 20 }))
        .required(t("common.validations.required")),
      phone_no: Yup.string()
        .max(30, t("common.validations.max", { size: 30 }))
        .required(t("common.validations.required")),
      role: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="user-dialog-title">
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="user-dialog-title">
          {editMode
            ? t("userManagement.modal.edit.title")
            : t("userManagement.modal.add.title")}
        </DialogTitle>
        <DialogContent>

          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label={t("userManagement.form.name.label")}
            name="fullName"
            autoComplete="name"
            disabled={processing}
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone_no"
            label={t("userManagement.form.phone.label")}
            name="phone_no"
            autoComplete="tel"
            autoFocus

            value={formik.values.phone_no}
            onChange={formik.handleChange}
            error={formik.touched.phone_no && Boolean(formik.errors.phone_no)}
            helperText={formik.touched.phone_no && formik.errors.phone_no}
          />
          {/* <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">
              {t("userManagement.form.gender.label")}
            </FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              // value={formik.values.gender}
              onChange={formik.handleChange}
            >
              {genders.map((gender) => (
                <FormControlLabel
                  key={gender.value}
                  disabled={processing}
                  value={gender.value}
                  control={<Radio />}
                  label={t(gender.label)}
                />
              ))}
            </RadioGroup>
          </FormControl> */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("userManagement.form.email.label")}
            name="email"
            autoComplete="email"
            disabled={processing}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          {/* <TextField
            margin="normal"
            required
            id="role"
            disabled={processing}
            fullWidth
            select
            label={t("userManagement.form.role.label")}
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField> */}
          <FormControl component="fieldset" margin="normal">
            {/* <FormControlLabel
              name="is_active"
              disabled={processing}
              onChange={formik.handleChange}
              // checked={!formik.values.is_active}
              control={<Checkbox />}
              label={t("userManagement.form.disabled.label")}
            /> */}
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
              ? t("userManagement.modal.edit.action")
              : t("userManagement.modal.add.action")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDialog;
