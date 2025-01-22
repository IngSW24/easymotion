import { Clear } from "@mui/icons-material";
import { Search, SearchIconWrapper, StyledInputBase } from "./styles";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "../../../hooks/useDebounce";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";

export interface DebouncedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DebouncedSearchBar(props: DebouncedSearchBarProps) {
  const { value, onChange } = props;

  const [text, setText] = useState(value);
  const debouncedName = useDebounce(text, 500);

  useEffect(() => {
    onChange(debouncedName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  useEffect(() => {}, []);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Che corso stai cercando?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        endAdornment={
          <IconButton onClick={() => !!text && setText("")} size="small">
            <Clear />
          </IconButton>
        }
      />
    </Search>
  );
}
