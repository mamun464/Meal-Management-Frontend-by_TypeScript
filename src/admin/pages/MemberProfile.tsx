import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthProvider";
import QueryWrapper from "../../core/components/QueryWrapper";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import AdminAppBar from "../components/AdminAppBar";
import AdminToolbar from "../components/AdminToolbar";
import CircleProgressWidget from "../widgets/CircleProgressWidget";
import { useParams } from "react-router-dom";
import { useMemberProfile } from '../../users/hooks/useMemberProfile';
import { useEffect, useState } from "react";
import { User } from "@sentry/react";
import ProfileInformation from "./MemberProfileInformation";
import { formatDistanceToNow } from 'date-fns';
import OverviewWidget from "../widgets/OverviewWidget";

const profileMenuItems = [
  // {
  //   key: "profile.menu.activity",
  //   path: "",
  // },
  {
    key: "profile.menu.info",
    path: "",
  },
  // {
  //   key: "profile.menu.password",
  //   path: "./password",
  // },
];

const Profile = () => {
  const { isLoggingOut, logout, userInfo } = useAuth();
  const { userId } = useParams();
  const { getMemberProfile, isMemberProfile } = useMemberProfile();
  const [userData, setUserData] = useState<User | null>(null);
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const processing = isMemberProfile;

  useEffect(() => {
    if (userId) {
      const numericUserId = Number(userId); // Convert userId to a number
      if (!isNaN(numericUserId)) {
        getMemberProfile(numericUserId)
          .then((new_user) => {
            setUserData(new_user);
          })
          .catch((error) => {
            const errorMessage = error.message || t("common.errors.unexpected.subTitle");
            snackbar.error(errorMessage);
          });
      } else {
        snackbar.error(t("common.errors.invalidId"));
      }
    }
  }, [userId]);

  useEffect(() => {
    console.log("new_user-2: ", userData);

  }, [userData]);

  const calculateLastActive = (lastLogin: any) => {
    if (!lastLogin) {
      return "Never logged in";
    }

    const lastActiveTime = new Date(lastLogin); // Assuming `lastLogin` is a valid date string
    return formatDistanceToNow(lastActiveTime, { addSuffix: true });
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar>
          {/* <Fab
            aria-label="logout"
            color="secondary"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            <ExitToAppIcon />
          </Fab> */}
        </AdminToolbar>
      </AdminAppBar>
      <Grid container spacing={12}>
        <Grid item xs={12} md={4} marginTop={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              mb: 6,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "background.paper",
                mb: 3,
                height: 160,
                width: 160,
              }}
              src={userData?.user_profile_img || undefined} // Use the image if available, otherwise keep it undefined
            >
              {!userData?.user_profile_img && <PersonIcon sx={{ fontSize: 120 }} />}
            </Avatar>

            <Typography
              component="div"
              variant="h4"
            >{userData?.fullName || "Loading..."}</Typography>
            {/* <Typography variant="body2">{userInfo?.role}</Typography> */}
            <Typography variant="body2">
              {userData
                ? userData.is_superuser
                  ? "Admin"
                  : userData.is_manager
                    ? "Manager"
                    : "Member"
                : "Loading..."}
            </Typography>
          </Box>
          {/* <CircleProgressWidget
            height={244}
            title={t("profile.completion.title")}
            value={75}
          /> */}

          <OverviewWidget
            description="Last Active Status"
            title={processing ? "Loading..." : `${calculateLastActive(userData?.last_login)}`}
          />
        </Grid>
        <Grid item xs={12} md={8} marginTop={3}>
          <Box sx={{ mb: 4 }}>
            <Tabs aria-label="profile nav tabs" value={false}>
              {profileMenuItems.map((item) => (
                <Tab
                  key={item.key}
                  activeClassName="Mui-selected"
                  end={true}
                  component={NavLink}
                  label={t(item.key)}
                  to={item.path}
                />
              ))}
            </Tabs>
          </Box>
          {/* <QueryWrapper>
            <Outlet />
          </QueryWrapper> */}
          <ProfileInformation userData={userData} processing={processing} ></ProfileInformation>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;
