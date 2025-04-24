import { useAuth } from "@easymotion/auth-context";
import { Avatar, SxProps } from "@mui/material";
import { getProfilePictureUrl } from "../../utils/format";

export interface ProfileAvatarProps {
  sx?: SxProps;
}

export default function ProfileAvatar(props: ProfileAvatarProps) {
  const { sx } = props;
  const { user } = useAuth();

  if (!user) return <></>;

  if (!user.picturePath)
    return (
      <Avatar>
        {user.firstName.charAt(0).toUpperCase()}
        {user.lastName.charAt(0).toUpperCase()}
      </Avatar>
    );

  return <Avatar src={getProfilePictureUrl(user.picturePath)} sx={sx} />;
}
