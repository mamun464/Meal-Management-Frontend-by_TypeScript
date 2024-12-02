import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useUpdateProfileInfo } from "../../admin/hooks/useUpdateProfileInfo";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useProfileInfo } from "../hooks/useProfileInfo";
import { ProfileInfo } from "../types/profileInfo";
import { User } from "@sentry/react";
import Checkbox from "@material-ui/core/Checkbox";
import { tr } from "date-fns/locale";


interface ProfileInformationProps {
  userData: User | null; // userData can be null if data is not yet available
  processing: boolean;
}


const ProfileInformation: React.FC<ProfileInformationProps> = ({ userData, processing }) => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const { data } = useProfileInfo();
  const { isUpdating, updateProfileInfo } = useUpdateProfileInfo();

  return (
    <form noValidate>
      <Card>
        <CardHeader title={t("profile.info.memberInfo")} />
        <CardContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label={t("userManagement.form.name.label")}
            name="fullName"
            disabled={true}
            value={processing ? "Loading..." : userData?.fullName || "No data available"}
            InputLabelProps={{
              shrink: true,  // Ensures the label stays above the field
            }}
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
            disabled={true}
            value={processing ? "Loading..." : userData?.phone_no || "No data available"} // Conditionally show loading text
            InputLabelProps={{
              shrink: true, // Ensures the label stays above the field
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("profile.info.form.email.label")}
            name="email"
            autoComplete="email"
            disabled={true}
            value={processing ? "Loading..." : userData?.email || "No data available"} // Conditionally show loading text
            InputLabelProps={{
              shrink: true, // Ensures the label stays above the field
            }}
          />
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
              checked={userData?.is_active || false} // Negate the value to invert the behavior
              control={<Checkbox />}
              label={t("userManagement.form.disabled.label")}
            />

          </FormControl>
        </CardContent>
        {/* <CardActions>
          <Button >
            {t("common.reset")}
          </Button>
          <LoadingButton loading={isUpdating} type="submit" variant="contained">
            {t("common.update")}
          </LoadingButton>
        </CardActions> */}
      </Card>
    </form>
  );
};

export default ProfileInformation;
