import { useAuth } from "@easymotion/auth-context";
import { Avatar, SxProps } from "@mui/material";
import { getStaticImageUrl } from "../../utils/format";

export interface ProfileAvatarProps {
  sx?: SxProps;
}

export default function ProfileAvatar(props: ProfileAvatarProps) {
  const { sx } = props;
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <Avatar
      src={user.picturePath ? getStaticImageUrl(user.picturePath) : undefined}
      sx={sx}
    >
      {user.firstName.charAt(0).toUpperCase()}
      {user.lastName.charAt(0).toUpperCase()}
    </Avatar>
  );
}
