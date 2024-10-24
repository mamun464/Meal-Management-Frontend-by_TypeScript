import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useAuth } from "../contexts/AuthProvider";

const Login = () => {
  const { isLoggingIn, login } = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const handleLogin = (phone: string, password: string) => {
    login(phone, password)
      .then(() =>
        navigate(`/${process.env.PUBLIC_URL}/admin`, { replace: true })
      )
      .catch(() => snackbar.error(t("common.errors.unexpected.subTitle")));
  };

  const formik = useFormik({
    initialValues: {
      phone: "018", // phone number instead of email
      password: "123456",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^[0-9]+$/, t("common.validations.phone")) // allow only numbers
        .min(3, t("common.validations.min", { size: 10 })) // ensure minimum length for phone number
        .required(t("common.validations.required")),
      password: Yup.string()
        .min(5, t("common.validations.min", { size: 8 }))
        .required(t("common.validations.required")),
    }),
    onSubmit: (values) => handleLogin(values.phone, values.password), // use phone instead of email
  });

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(./img/startup.svg)",
          backgroundRepeat: "no-repeat",
          bgcolor: "background.default",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} square>
        <BoxedLayout>
          <Typography component="h1" variant="h5">
            {t("auth.login.title")}
          </Typography>
          <Box
            component="form"
            marginTop={3}
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <TextField
              margin="normal"
              variant="filled"
              required
              fullWidth
              id="phone"  // changed from email to phone
              label={t("auth.login.form.phone.label")}  // update the label to use phone
              name="phone"  // changed from email to phone
              autoComplete="tel"  // changed to use "tel" for phone autocomplete
              autoFocus
              disabled={isLoggingIn}
              value={formik.values.phone}  // changed from formik.values.email to formik.values.phone
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}  // changed from email to phone
              helperText={formik.touched.phone && formik.errors.phone}  // changed from email to phone
            />
            <TextField
              margin="normal"
              variant="filled"
              required
              fullWidth
              name="password"
              label={t("auth.login.form.password.label")}
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={isLoggingIn}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Box sx={{ textAlign: "right" }}>
              <Link
                component={RouterLink}
                to={`/${process.env.PUBLIC_URL}/forgot-password`}
                variant="body2"
              >
                {t("auth.login.forgotPasswordLink")}
              </Link>
            </Box>
            <LoadingButton
              type="submit"
              fullWidth
              loading={isLoggingIn}
              variant="contained"
              sx={{ mt: 3 }}
            >
              {t("auth.login.submit")}
            </LoadingButton>
            <Button
              component={RouterLink}
              to={`/${process.env.PUBLIC_URL}/register`}
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {t("auth.login.newAccountLink")}
            </Button>
          </Box>
        </BoxedLayout>
      </Grid>
    </Grid>
  );
};

export default Login;
